import { app } from './api.js';
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Helper to get UID from URL (e.g. publish.html?uid=xxxx)
function getUID() {
  const params = new URLSearchParams(window.location.search);
  return params.get('uid');
}

const db = getDatabase(app);
const uid = getUID();

const frameImage = document.getElementById('frameImage');
const userImage = document.getElementById('userImage');
const addUserImageBtn = document.getElementById('addUserImageBtn');
const userImageInput = document.getElementById('userImageInput');
const publishTitle = document.getElementById('publishTitle');
const publishDesc = document.getElementById('publishDesc');
const publishLink = document.getElementById('publishLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const publishCaption = document.getElementById('publishCaption');
const publishVisibility = document.getElementById('publishVisibility');
const downloadBtn = document.getElementById('downloadBtn');
const copyCaptionBtn = document.getElementById('copyCaptionBtn');

// Fetch campaign data and display
async function loadCampaign() {
  if (!uid) return;
  const snap = await get(ref(db, 'frameit/' + uid));
  if (!snap.exists()) return;
  const data = snap.val();
  frameImage.crossOrigin = 'anonymous';
  frameImage.src = data.imagelink;
  publishTitle.textContent = data.CampaignTitle;
  publishDesc.textContent = data.Description;
  publishLink.textContent = data.Link;
  publishCaption.textContent = data.captionTemplate;
  publishVisibility.textContent = data.visibility.charAt(0).toUpperCase() + data.visibility.slice(1);
}

// Add user image
addUserImageBtn.addEventListener('click', () => {
  console.log('Add Image button clicked');
  userImageInput.click();
});
userImageInput.addEventListener('change', (e) => {
  console.log('File input changed', e.target.files);
  if (e.target.files && e.target.files[0]) {
    const url = URL.createObjectURL(e.target.files[0]);
    userImage.crossOrigin = 'anonymous';
    userImage.src = url;
    userImage.style.display = 'block';
    console.log('User image src set:', url);
  } else {
    console.error('No file selected or file input error');
    alert('No file selected or file input error');
  }
});

// Copy link to clipboard
copyLinkBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(publishLink.textContent);
  copyLinkBtn.textContent = 'Copied!';
  setTimeout(() => copyLinkBtn.textContent = 'Copy Link', 1200);
});

// Copy caption template to clipboard
if (copyCaptionBtn) {
  copyCaptionBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(publishCaption.textContent);
    copyCaptionBtn.textContent = 'Copied!';
    setTimeout(() => copyCaptionBtn.textContent = 'Copy', 1200);
  });
}

// Download combined image
function downloadCombinedImage() {
  const loadingModal = document.getElementById('loadingModal');
  loadingModal.style.display = 'flex';

  setTimeout(() => {
    const canvas = document.createElement('canvas');
    const frame = frameImage;
    const user = userImage.style.display !== 'none' ? userImage : null;
    // Wait for images to load
    Promise.all([
      new Promise(res => { if (frame.complete) res(); else frame.onload = res; }),
      user ? new Promise(res => { if (user.complete) res(); else user.onload = res; }) : Promise.resolve()
    ]).then(() => {
      // Set canvas size to frame's natural size
      canvas.width = frame.naturalWidth;
      canvas.height = frame.naturalHeight;
      const ctx = canvas.getContext('2d');
      // Draw user image center-cropped and scaled to fit the frame
      if (user) {
        const fw = frame.naturalWidth;
        const fh = frame.naturalHeight;
        const uw = user.naturalWidth;
        const uh = user.naturalHeight;
        // Calculate crop for user image to fill the frame area
        const frameAspect = fw / fh;
        const userAspect = uw / uh;
        let sx, sy, sw, sh;
        if (userAspect > frameAspect) {
          // User image is wider than frame: crop width
          sh = uh;
          sw = uh * frameAspect;
          sx = (uw - sw) / 2;
          sy = 0;
        } else {
          // User image is taller than frame: crop height
          sw = uw;
          sh = uw / frameAspect;
          sx = 0;
          sy = (uh - sh) / 2;
        }
        ctx.drawImage(user, sx, sy, sw, sh, 0, 0, fw, fh);
      }
      // Draw frame image as-is
      ctx.drawImage(frame, 0, 0, frame.naturalWidth, frame.naturalHeight);
      // Download
      const link = document.createElement('a');
      link.download = 'framed-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      loadingModal.style.display = 'none';
    });
  }, 5000);
}
downloadBtn.addEventListener('click', downloadCombinedImage);

// Load campaign on page load
loadCampaign();

document.addEventListener('DOMContentLoaded', function() {
  var logoTitle = document.querySelector('.logo h1');
  if (logoTitle) {
    logoTitle.style.cursor = 'pointer';
    logoTitle.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
});
