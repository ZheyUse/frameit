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
const uploadServerSelect = document.getElementById('uploadServerSelect');
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

  // Determine selected upload server
  const selectedServer = uploadServerSelect ? uploadServerSelect.value : 'imgbb';

  let imageUrl = '';

  if (selectedServer === 'freeimage') {
    // Upload to Freeimage.host via PHP proxy (requires Apache running)
    const freeimageApiKey = '6d207e02198a847aa98d0a2a901485a5';
    
    console.log('[DEBUG] Starting Freeimage upload via PHP proxy...');
    
    try {
      // Convert file to base64
      console.log('[DEBUG] Converting image to base64...');
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
          console.log('[DEBUG] Base64 conversion complete, length:', base64.length);
          resolve(base64);
        };
        reader.onerror = (err) => {
          console.error('[DEBUG] FileReader error:', err);
          reject(err);
        };
        reader.readAsDataURL(fileInput.files[0]);
      });

      // Use Netlify serverless function as proxy (works without XAMPP)
      const proxyUrl = '/.netlify/functions/freeimage-upload';
      
      console.log('[DEBUG] Using Netlify Function proxy');
      console.log('[DEBUG] Sending request to Netlify Function...');
      
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          base64Image: base64Image,
          apiKey: freeimageApiKey
        })
      });
      
      console.log('[DEBUG] Response status:', res.status);
      const data = await res.json();
      console.log('[DEBUG] Response data:', data);
      
      if (data.status_code !== 200 || !data.image || !data.image.url) {
        throw new Error('Freeimage upload failed: ' + (data.error?.message || JSON.stringify(data.error || 'Unknown error')));
      }
      imageUrl = data.image.url;
      console.log('[DEBUG] Upload successful! Image URL:', imageUrl);
    } catch (err) {
      console.error('[DEBUG] Freeimage error:', err);
      loadingModal.style.display = 'none';
      loadingMessage.textContent = 'Publish Failed: Start Apache in XAMPP or use ImgBB Server.';
      setTimeout(() => {
        loadingMessage.textContent = 'Publish Frame Please wait...';
      }, 3000);
      return;
    }
  } else {
    // Upload to imgbb (default)
    const imgbbApiKey = 'd33c0d69e7cfd7f6c791498ab3c0bf4c';
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('expiration', 2592000); // 30 days in seconds

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
      loadingMessage.textContent = 'Publish Failed: ImgBB upload error';
      setTimeout(() => {
        loadingMessage.textContent = 'Publish Frame Please wait...';
      }, 1800);
      return;
    }
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

// Note: Cloud Function code (exports.deleteOldFrameitEntries) should be in a separate 
// Firebase Functions file, not in browser JavaScript. Deploy it to Firebase Functions separately.
