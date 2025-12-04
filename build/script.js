// DOM Elements
const getStartedBtn = document.getElementById('getStartedBtn');
const logo = document.querySelector('.logo h1');
const heroSection = document.querySelector('.hero');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add event listeners
    addEventListeners();
    
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add fade-in animation to hero content
    animateHeroContent();
}

function addEventListeners() {
    // Get Started button click handler
    getStartedBtn.addEventListener('click', handleGetStartedClick);
    
    // Logo click handler
    logo.addEventListener('click', handleLogoClick);
    
    // Add keyboard navigation
    getStartedBtn.addEventListener('keydown', handleKeyDown);
    
    // Add window resize handler for responsive adjustments
    window.addEventListener('resize', handleWindowResize);
}

function handleGetStartedClick() {
    // Add click animation
    animateButtonClick(getStartedBtn);
    
  
}

function handleLogoClick() {
    // Add logo click animation
    animateLogoClick();
    
    // Scroll to top if not already there
    if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function handleKeyDown(event) {
    // Handle Enter and Space key for button activation
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleGetStartedClick();
    }
}

function handleWindowResize() {
    // Handle any responsive adjustments if needed
    // This is a placeholder for future responsive JavaScript functionality
    console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);
}

function animateButtonClick(button) {
    // Add temporary class for click animation
    button.classList.add('clicked');
    
    // Remove the class after animation
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 200);
}

function animateLogoClick() {
    // Add temporary pulse animation to logo
    logo.style.transform = 'scale(1.1)';
    
    // Reset transform after animation
    setTimeout(() => {
        logo.style.transform = 'scale(1)';
    }, 200);
}

function animateHeroContent() {
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        
        // Animate in after a short delay
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Modal logic
const modal = document.getElementById('startCampaignModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalCancelBtn = document.getElementById('modalCancelBtn');

function openModal() {
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.focus();
    if (heroSection) heroSection.style.display = 'none';
}

function closeModal() {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (heroSection) heroSection.style.display = '';
}

getStartedBtn.addEventListener('click', openModal);
modalCancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (modal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
        closeModal();
    }
});

// Modal option card interactivity
const modalOptions = document.querySelectorAll('.modal-option');
const modalGetStartedBtn = document.getElementById('modalGetStartedBtn');
let selectedOption = null;

modalOptions.forEach(option => {
    option.addEventListener('mouseenter', function() {
        this.classList.add('hovered');
    });
    option.addEventListener('mouseleave', function() {
        this.classList.remove('hovered');
    });
    option.addEventListener('click', function() {
        modalOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        selectedOption = this;
        modalGetStartedBtn.disabled = false;
        modalGetStartedBtn.classList.add('active');
    });
});

// Optionally, handle Get Started button click for selected option
modalGetStartedBtn.addEventListener('click', function() {
    if (!selectedOption) return;
    // Redirect to frameit.html if FrameIt Now is selected
    if (selectedOption.querySelector('h3') && selectedOption.querySelector('h3').textContent.trim().startsWith('FrameIt Now')) {
        window.location.href = 'frameit.html';
        return;
    }
    // For now, just close the modal for other options
    closeModal();
});

// --- Showcase Section Logic ---
const frameItCarouselImages = [
    "https://i.pinimg.com/736x/8a/f0/c5/8af0c5f573a9d22d4e3e655847bf6160.jpg",
    "https://i.pinimg.com/736x/5b/49/f7/5b49f79b844af96f395b0fc519732e2a.jpg",
    "https://i.pinimg.com/736x/67/81/bc/6781bcd0751259f46b7cf1a8cab289ec.jpg"
];
const frameItSampleImages = [
    "https://i.pinimg.com/736x/7a/ed/99/7aed99fd9fc7735e366fffd192f6bd0d.jpg",
    "https://i.pinimg.com/736x/13/6c/29/136c297ab40e71ac2705aa6ca517c578.jpg",
    "https://i.pinimg.com/736x/27/62/4d/27624d4aa2890a5d584d358b342fb5ad.jpg",
    "https://i.pinimg.com/736x/d7/6b/11/d76b110e0f839835dbe7a5f1673df049.jpg",
    "https://i.pinimg.com/736x/a3/6b/c8/a36bc8cc71be2ec5d3d6661fc8214006.jpg",
    "https://i.pinimg.com/736x/23/ac/ba/23acba7ef2e383c2646fd6d71a58bf3a.jpg"
];
const createItSampleImages = [
    "https://i.pinimg.com/736x/25/b6/c8/25b6c8d1a14730ed6b2bdab6f6e6a756.jpg",
    "https://i.pinimg.com/736x/c5/42/91/c542915027e5bca58dc23cdc49ff3921.jpg",
    "https://i.pinimg.com/736x/48/1b/43/481b435f5ef3da3765505787e65d6b61.jpg",
    "https://i.pinimg.com/736x/6c/f1/54/6cf15409b3cdceafe7a7964b87bb6568.jpg",
    "https://i.pinimg.com/736x/36/f0/d0/36f0d0e0b47e972bbf50e5c8ff6a3681.jpg",
    "https://i.pinimg.com/736x/2f/dd/b3/2fddb3227c8b400508eb8093cb7f9431.jpg",
    "https://i.pinimg.com/736x/49/ec/b6/49ecb6463736702b91e603cfeb3f114d.jpg",
    "https://i.pinimg.com/736x/9b/1b/8b/9b1b8b12420ffaeaa9787a3c12d3037a.jpg",
    "https://i.pinimg.com/736x/55/f3/49/55f349fa173c8c28c840fa67277e8460.jpg"
];

document.addEventListener('DOMContentLoaded', function() {
    // Carousel logic
    const carouselImage = document.getElementById('carouselImage');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    let carouselIndex = 0;
    if (carouselImage && carouselPrev && carouselNext) {
        function updateCarousel() {
            carouselImage.src = frameItCarouselImages[carouselIndex];
        }
        carouselPrev.addEventListener('click', function() {
            carouselIndex = (carouselIndex - 1 + frameItCarouselImages.length) % frameItCarouselImages.length;
            updateCarousel();
        });
        carouselNext.addEventListener('click', function() {
            carouselIndex = (carouselIndex + 1) % frameItCarouselImages.length;
            updateCarousel();
        });
        setInterval(function() {
            carouselIndex = (carouselIndex + 1) % frameItCarouselImages.length;
            updateCarousel();
        }, 3000);
    }
    // FrameIt sample images
    const frameItSamples = document.getElementById('frameItSamples');
    if (frameItSamples) {
        frameItSampleImages.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'FrameIt Sample';
            frameItSamples.appendChild(img);
        });
    }
    // CreateIt sample images
    const createItSamples = document.getElementById('createItSamples');
    if (createItSamples) {
        createItSampleImages.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'CreateIt Sample';
            createItSamples.appendChild(img);
        });
    }
});

// Sample image links for each card (arrays for each card in each group)
const frameItImages = [
    [
        "https://i.pinimg.com/736x/8a/f0/c5/8af0c5f573a9d22d4e3e655847bf6160.jpg",
        "https://i.pinimg.com/736x/5b/49/f7/5b49f79b844af96f395b0fc519732e2a.jpg",
        "https://i.pinimg.com/736x/67/81/bc/6781bcd0751259f46b7cf1a8cab289ec.jpg"
    ],
    [
        "https://i.pinimg.com/736x/7a/ed/99/7aed99fd9fc7735e366fffd192f6bd0d.jpg",
        "https://i.pinimg.com/736x/13/6c/29/136c297ab40e71ac2705aa6ca517c578.jpg",
        "https://i.pinimg.com/736x/27/62/4d/27624d4aa2890a5d584d358b342fb5ad.jpg"
    ],
    [
        "https://i.pinimg.com/736x/d7/6b/11/d76b110e0f839835dbe7a5f1673df049.jpg",
        "https://i.pinimg.com/736x/a3/6b/c8/a36bc8cc71be2ec5d3d6661fc8214006.jpg",
        "https://i.pinimg.com/736x/23/ac/ba/23acba7ef2e383c2646fd6d71a58bf3a.jpg"
    ]
];
const createItImages = [
    [
        "https://i.pinimg.com/736x/25/b6/c8/25b6c8d1a14730ed6b2bdab6f6e6a756.jpg",
        "https://i.pinimg.com/736x/c5/42/91/c542915027e5bca58dc23cdc49ff3921.jpg",
        "https://i.pinimg.com/736x/48/1b/43/481b435f5ef3da3765505787e65d6b61.jpg"
    ],
    [
        "https://i.pinimg.com/736x/6c/f1/54/6cf15409b3cdceafe7a7964b87bb6568.jpg",
        "https://i.pinimg.com/736x/36/f0/d0/36f0d0e0b47e972bbf50e5c8ff6a3681.jpg",
        "https://i.pinimg.com/736x/2f/dd/b3/2fddb3227c8b400508eb8093cb7f9431.jpg"
    ],
    [
        "https://i.pinimg.com/736x/49/ec/b6/49ecb6463736702b91e603cfeb3f114d.jpg",
        "https://i.pinimg.com/736x/9b/1b/8b/9b1b8b12420ffaeaa9787a3c12d3037a.jpg",
        "https://i.pinimg.com/736x/55/f3/49/55f349fa173c8c28c840fa67277e8460.jpg"
    ]
];

function startSampleCardLoop() {
    const frameItCards = document.querySelectorAll('.modal-option:first-child .sample-card img');
    const createItCards = document.querySelectorAll('.modal-option:last-child .sample-card img');
    let frameItIndices = [0, 0, 0];
    let createItIndices = [0, 0, 0];
    setInterval(() => {
        frameItCards.forEach((img, i) => {
            img.src = frameItImages[i][frameItIndices[i] % frameItImages[i].length];
            frameItIndices[i] = (frameItIndices[i] + 1) % frameItImages[i].length;
        });
        createItCards.forEach((img, i) => {
            img.src = createItImages[i][createItIndices[i] % createItImages[i].length];
            createItIndices[i] = (createItIndices[i] + 1) % createItImages[i].length;
        });
    }, 1000);
}

document.addEventListener('DOMContentLoaded', startSampleCardLoop);

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth hover effects
function addHoverEffects() {
    const buttons = document.querySelectorAll('.btn-get-started');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Call hover effects on load
document.addEventListener('DOMContentLoaded', addHoverEffects);

// --- Simple Client-side Routing ---
(function() {
  const routes = {
    '/home': 'index.html',
    '/create': 'frameit.html',
    '/shared': 'publish.html'
  };

  function handleRoute() {
    const path = window.location.pathname;
    const file = routes[path];
    if (file && !window.location.href.endsWith(file)) {
      window.location.replace(file + window.location.search + window.location.hash);
    }
  }

  // On page load
  handleRoute();

  // Intercept navigation (for SPA-like navigation, optional)
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.hasAttribute('data-route')) {
      e.preventDefault();
      const to = e.target.getAttribute('href');
      window.history.pushState({}, '', to);
      handleRoute();
    }
  });

  // Handle browser navigation
  window.addEventListener('popstate', handleRoute);
})();

// Export functions for potential future use
window.FrameItApp = {
    init: initializeApp,
    animateButtonClick,
    animateLogoClick,
    animateHeroContent
};
