import { app, analytics } from './api.js';
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js";

// FrameIt page JS - currently empty, add logic as needed

document.addEventListener('DOMContentLoaded', function() {
    var logoTitle = document.querySelector('.logo h1');
    if (logoTitle) {
        logoTitle.style.cursor = 'pointer';
        logoTitle.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Drag and drop logic
    const dragDropArea = document.getElementById('dragDropArea');
    const fileInput = document.getElementById('frameFileInput');
    const framePreview = document.getElementById('framePreview');
    const dragDropContent = document.getElementById('dragDropContent');
    const removeFrameBtn = document.getElementById('removeFrameBtn');

    function showPreview(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            framePreview.src = e.target.result;
            framePreview.style.display = 'block';
            dragDropContent.style.display = 'none';
            removeFrameBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function hidePreview() {
        framePreview.src = '';
        framePreview.style.display = 'none';
        dragDropContent.style.display = 'block';
        removeFrameBtn.style.display = 'none';
        fileInput.value = '';
    }

    if (removeFrameBtn) {
        removeFrameBtn.addEventListener('click', hidePreview);
    }

    if (dragDropArea && fileInput) {
        dragDropArea.addEventListener('click', function() {
            fileInput.click();
        });

        dragDropArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            dragDropArea.classList.add('dragover');
        });
        dragDropArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            dragDropArea.classList.remove('dragover');
        });
        dragDropArea.addEventListener('drop', function(e) {
            e.preventDefault();
            dragDropArea.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                fileInput.files = e.dataTransfer.files;
                showPreview(e.dataTransfer.files[0]);
            }
        });
        fileInput.addEventListener('change', function() {
            if (fileInput.files && fileInput.files[0]) {
                showPreview(fileInput.files[0]);
            } else {
                hidePreview();
            }
        });
    }
});

// Helper to generate a UID
function generateUID() {
  return Math.random().toString(36).substr(2, 9);
}

const publishBtn = document.getElementById('publishBtn');
const fileInput = document.getElementById('frameFileInput');
const db = getDatabase(app);
const functions = getFunctions(app);

publishBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // Show loading modal
  const loadingModal = document.getElementById('loadingModal');
  const loadingMessage = document.getElementById('loadingMessage');
  loadingMessage.textContent = 'Publish Frame Please wait...';
  loadingModal.style.display = 'flex';

  // Get form values
  const campaignTitle = document.getElementById('campaignTitle').value;
  const campaignDesc = document.getElementById('campaignDesc').value;
  const campaignLink = document.getElementById('campaignLink').value;
  const captionTemplate = document.getElementById('captionTemplate').value;
  const visibility = document.querySelector('input[name="visibility"]:checked').value;

  // Check for file
  if (!fileInput.files[0]) {
    loadingMessage.textContent = 'Publish Failed: upload an image first';
    setTimeout(() => {
      loadingModal.style.display = 'none';
      loadingMessage.textContent = 'Publish Frame Please wait...';
    }, 2000);
    return;
  }

  // Upload to imgbb
  const imgbbApiKey = 'd33c0d69e7cfd7f6c791498ab3c0bf4c';
  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  formData.append('expiration', 2592000); // 30 days in seconds

  let imageUrl = '';
  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!data.success) throw new Error('Image upload failed');
    imageUrl = data.data.url;
  } catch (err) {
    loadingModal.style.display = 'none';
    // Optionally show a message in the modal instead of alert
    return;
  }

  // Generate UID and campaign link
  const uid = generateUID();
  const link = `https://frameit-here.web.app/publish.html?uid=${uid}`;

  // Push to Firebase Realtime Database
  await set(ref(db, 'frameit/' + uid), {
    imagelink: imageUrl,
    CampaignTitle: campaignTitle,
    Description: campaignDesc,
    Link: link,
    captionTemplate: captionTemplate,
    visibility: visibility,
    createdAt: Date.now()
  });

  // Hide modal and redirect
  loadingModal.style.display = 'none';
  window.location.href = `publish.html?uid=${uid}`;
  // Optionally, redirect or reset form here
});

// Cloud Function to delete old entries
exports.deleteOldFrameitEntries = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const db = admin.database();
  const ref = db.ref('frameit');
  const now = Date.now();
  const cutoff = now - 30 * 24 * 60 * 60 * 1000; // 30 days in ms

  const snapshot = await ref.once('value');
  const updates = {};

  snapshot.forEach(child => {
    const data = child.val();
    if (data.createdAt && data.createdAt < cutoff) {
      updates[child.key] = null; // Mark for deletion
    }
  });

  if (Object.keys(updates).length > 0) {
    await ref.update(updates);
    console.log(`Deleted ${Object.keys(updates).length} old frameit entries`);
  } else {
    console.log('No old entries to delete');
  }
  return null;
});
