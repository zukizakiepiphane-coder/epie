// Quotes array - Citations inspirantes
const quotes = [
    {
        text: "Chaque moment est une opportunité de briller.",
        author: "Sagesse de vie"
    },
    {
        text: "La vie est belle quand on sait l'apprécier.",
        author: "Pensée positive"
    },
    {
        text: "Les rêves deviennent réalité quand on les poursuit.",
        author: "Motivation"
    },
    {
        text: "Soyez vous-même, c'est votre plus grande force.",
        author: "Authenticité"
    },
    {
        text: "Le bonheur se trouve dans les petites choses.",
        author: "Gratitude"
    },
    {
        text: "Vous êtes capable de réaliser l'impossible.",
        author: "Confiance en soi"
    },
    {
        text: "Chaque jour est un nouveau départ.",
        author: "Espoir"
    },
    {
        text: "L'amour et la bienveillance transforment le monde.",
        author: "Humanité"
    }
];

let currentPhotoIndex = 0;
let currentQuoteIndex = 0;
let isMusicPlaying = false;
let touchStartX = 0;
let photoTimer = null;
let quoteTimer = null;
const photoInterval = 4000; // ms
const quoteInterval = 6000; // ms

// Get elements
const giftBtn = document.getElementById('giftBtn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');
const carousel = document.getElementById('carousel');
const dots = document.querySelectorAll('.dot');
const nextQuoteBtn = document.getElementById('nextQuoteBtn');
const quoteElement = document.getElementById('quote');
const quoteAuthorElement = document.getElementById('quoteAuthor');
const bgMusic = document.getElementById('bgMusic');

// Open Modal
giftBtn.addEventListener('click', function() {
    modal.classList.add('show');
    showPhoto(0);
    displayQuote(0);
    startAutoPlay();
    playMusic();
});

// Close Modal
closeBtn.addEventListener('click', function() {
    modal.classList.remove('show');
    stopMusic();
    stopAutoPlay();
});

// Close when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('show');
        stopMusic();
        stopAutoPlay();
    }
});

// Photo carousel - Dot navigation
dots.forEach(dot => {
    dot.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        showPhoto(index);
    });
});

// Show specific photo
function showPhoto(index) {
    const items = carousel.querySelectorAll('.carousel-item');
    
    // Remove active class from all items and dots
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current item and dot
    items[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentPhotoIndex = index;
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (modal.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
            const newIndex = (currentPhotoIndex - 1 + dots.length) % dots.length;
            showPhoto(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = (currentPhotoIndex + 1) % dots.length;
            showPhoto(newIndex);
        }
    }
});

// Touch support for carousel
carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
}, false);

carousel.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    handleSwipe(touchStartX, touchEndX);
}, false);

// Mouse drag support
let isDragging = false;
let dragStartX = 0;

carousel.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragStartX = e.clientX;
});

carousel.addEventListener('mouseup', function(e) {
    if (isDragging) {
        handleSwipe(dragStartX, e.clientX);
        isDragging = false;
    }
});

// Handle swipe/drag
function handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swiped left - show next photo
            const newIndex = (currentPhotoIndex + 1) % dots.length;
            showPhoto(newIndex);
        } else {
            // Swiped right - show previous photo
            const newIndex = (currentPhotoIndex - 1 + dots.length) % dots.length;
            showPhoto(newIndex);
        }
    }
}

// Display specific quote
function displayQuote(index) {
    const quote = quotes[index];
    quoteElement.textContent = quote.text;
    quoteAuthorElement.textContent = `— ${quote.author}`;
    currentQuoteIndex = index;
}

// Next quote button
nextQuoteBtn.addEventListener('click', function() {
    const newIndex = (currentQuoteIndex + 1) % quotes.length;
    displayQuote(newIndex);
});

// No visible sound button: music is started automatically on gift open

function playMusic() {
    bgMusic.play().catch(error => {
        console.log('Erreur lors de la lecture audio:', error);
        // Autoplay may be bloqué par le navigateur. On propose à l'utilisateur d'activer le son manuellement.
        console.log('Autoplay bloqué, l\'utilisateur devra activer le son manuellement.');
    });
    isMusicPlaying = true;
    const btn = document.getElementById('soundBtn');
    if (btn) {
        btn.classList.add('playing');
        btn.textContent = '🔊 Musique (en cours...)';
    }
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    isMusicPlaying = false;
    const btn = document.getElementById('soundBtn');
    if (btn) {
        btn.classList.remove('playing');
        btn.textContent = '🔊 Musique';
    }
}

// Auto-play music when modal opens (optional)
// Uncomment to enable auto-play
// const originalShow = giftBtn.onclick;
// giftBtn.onclick = function() {
//     originalShow();
//     playMusic();
// };

// Start automatic photo and quote rotation
function startAutoPlay() {
    // clear existing timers if any
    stopAutoPlay();
    photoTimer = setInterval(function() {
        const newIndex = (currentPhotoIndex + 1) % dots.length;
        showPhoto(newIndex);
    }, photoInterval);

    quoteTimer = setInterval(function() {
        const newIndex = (currentQuoteIndex + 1) % quotes.length;
        displayQuote(newIndex);
    }, quoteInterval);
}

function stopAutoPlay() {
    if (photoTimer) {
        clearInterval(photoTimer);
        photoTimer = null;
    }
    if (quoteTimer) {
        clearInterval(quoteTimer);
        quoteTimer = null;
    }
}

// Note: modal is opened when the user clicks the gift button; music and autoplay start there.
