const slides = document.querySelectorAll('.carousel-slide')
const dotsContainer = document.querySelector('.carousel-dots');
const carouselContainer = document.querySelector('.carousel-slide').parentElement;
let currentSlideIndex = 0;
let autoSlideInterval;
let dots
let totalSlides
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50; // Minimum distance for a swipe to be registered


function createSlides() {
    // assign background images 
    slides.forEach(slide => {
        const bgImage = slide.getAttribute('data-bg-image');
        if (bgImage) {
            slide.style.backgroundImage = `url(${bgImage})`;
        }
    });

    // Create dots equal to the number of slides
    slides.forEach((slide, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.setAttribute('data-slide', index);
        
        // Make first dot active
        if (index === 0) {
            dot.classList.add('active');
        }
        
        // Add click event listener immediately when creating the dot
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            stopAutoSlide();
            currentSlideIndex = slideIndex;
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            document.querySelectorAll('.dot').forEach(d => {
                d.classList.remove('active');
            });
            slides[slideIndex].classList.add('active');
            this.classList.add('active');
        });
        
        dotsContainer.appendChild(dot);
    });
    dots = document.querySelectorAll('.dot')
    totalSlides = slides.length;


}



function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        // Move to next slide
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(d => {
            d.classList.remove('active');
        });
        
        // Add active class to current slide and dot
        slides[currentSlideIndex].classList.add('active');
        document.querySelectorAll('.dot')[currentSlideIndex].classList.add('active');
    }, 4500);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}


function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) < minSwipeDistance) {
        return; // Not enough distance for a swipe
    }
    
    stopAutoSlide();
    
    if (swipeDistance > 0) { // swipe right = previous
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    } else { // swipe left = next
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    }
    
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    dots.forEach(d => {
        d.classList.remove('active');
    });
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

// Add touch event listeners to the carousel container
function addSwipeGestures() {
    carouselContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}


createSlides()
startAutoSlide()
addSwipeGestures()