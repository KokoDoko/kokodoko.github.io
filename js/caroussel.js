const slides = document.querySelectorAll('.carousel-slide')
const dotsContainer = document.querySelector('.carousel-dots');

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
        
        // Remove active class from all slides and dots
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        document.querySelectorAll('.dot').forEach(d => {
            d.classList.remove('active');
        });
        
        // Add active class to target slide and dot
        slides[slideIndex].classList.add('active');
        this.classList.add('active');
    });
    
    dotsContainer.appendChild(dot);
});