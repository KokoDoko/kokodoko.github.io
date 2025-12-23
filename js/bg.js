class CanvasBG {
    constructor(canvasId = 'backgroundCanvas', options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.size = options.size || 80;
        this.lastDrawTime = 0;
        this.drawInterval = options.drawInterval || 800;
        this.duration = options.duration || 150;
        this.lineLength = options.lineLength || { min: 160, max: 320 };
        this.animationRunning = false;
        this.lineCount = 0;
        this.fadeThreshold = 50;

        this.selectedAngles = [
            -Math.PI / 6,         // -30° - up 30 degrees
            Math.PI / 2,          // 90° - straight down
            Math.PI / 6           // 30° - down 30 degrees
        ];

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Also listen for scroll events in case content changes
        // window.addEventListener('scroll', () => this.resizeCanvas());

        // Use a ResizeObserver to detect when document size changes
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => this.resizeCanvas());
            resizeObserver.observe(document.body);
        }

        this.start();
    }

    resizeCanvas() {
        const fullWidth = document.documentElement.clientWidth;
        const fullHeight = window.innerHeight;
    
        // Only resize if dimensions have changed to avoid unnecessary redraws
        if (this.canvas.width !== fullWidth || this.canvas.height !== fullHeight) {
            this.canvas.width = fullWidth;
            this.canvas.height = fullHeight;
        }
    }


    drawRandomLine() {
        // Apply fade effect if we've drawn more than n lines
        if (this.lineCount >= this.fadeThreshold) {
            this.applyFadeEffect();
        }

        // random start point with X as multiple of size
        const gridX = Math.floor(Math.random() * (this.canvas.width / this.size)) * this.size;
        const startX = gridX;
        const startY = Math.random() * this.canvas.height;

        // random length and direction
        const length = Math.random() * (this.lineLength.max - this.lineLength.min) + this.lineLength.min;
        const randomAngleIndex = Math.floor(Math.random() * this.selectedAngles.length);
        const angle = this.selectedAngles[randomAngleIndex];
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;

        const randomColors = [
            { start: 'rgba(243, 28, 207, 0.2)', end: 'rgba(243, 28, 207, 0)' },
            { start: 'rgba(121, 28, 243, 0.2)', end: 'rgba(121, 28, 243, 0)' },
            { start: 'rgba(28, 75, 243, 0.2)', end: 'rgba(28, 75, 243, 0)' },
        ]
        const colorSet = randomColors[Math.floor(Math.random() * randomColors.length)];
        const gradient = this.ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, colorSet.start);
        gradient.addColorStop(1, colorSet.end);

        let progress = 0;
        const startTime = Date.now();

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = gradient;

        const animateLine = () => {
            const currentTime = Date.now();
            progress = Math.min((currentTime - startTime) / this.duration, 1);

            // Calculate current end position based on progress
            const currentEndX = startX + (endX - startX) * progress;
            const currentEndY = startY + (endY - startY) * progress;

            // Draw the line up to current progress
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(currentEndX, currentEndY);
            this.ctx.stroke();

            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(animateLine);
            } else {
                // Increment line count when animation is complete
                this.lineCount++;
            }
        };

        // Start the animation
        animateLine();
    }

    applyFadeEffect() {
        // Create a semi-transparent overlay to fade existing content
        this.ctx.fillStyle = 'rgba(39, 6, 67, 0.02)'; // Very subtle fade using background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMultipleLines() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.drawRandomLine(), i * 100); // Stagger by 100ms
        }
    }

    animationLoop(currentTime) {
        if (!this.animationRunning) return;

        if (currentTime - this.lastDrawTime >= this.drawInterval) {
            this.drawMultipleLines();
            this.lastDrawTime = currentTime;
        }
        requestAnimationFrame((time) => this.animationLoop(time));
    }

    start() {
        this.animationRunning = true;
        requestAnimationFrame((time) => this.animationLoop(time));
    }

    stop() {
        this.animationRunning = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const bg = new CanvasBG();    

/*
// Only initialize CanvasBG on desktop devices
function isDesktop() {
    return !/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isDesktop()) {
    const bg = new CanvasBG();    
}
*/

/**
 * const bg = new CanvasBG('myCanvasId', {
size: 80,              // Grid size
drawInterval: 1000,    // Time between line batches (ms)
duration: 200,         // Animation duration per line (ms)
lineLength: { min: 80, max: 200 }  // Line length range
})
*/