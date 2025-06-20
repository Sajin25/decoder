document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const originalText = document.getElementById('originalText');
    const resultText = document.getElementById('resultText');
    const keyInput = document.getElementById('key');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const particlesContainer = document.getElementById('particles-container');

    // Color Palette
    const colors = [
        'rgba(138, 43, 226, 0.7)',    // Blue Violet
        'rgba(0, 255, 255, 0.7)',     // Cyan
        'rgba(255, 0, 255, 0.7)',     // Magenta
        'rgba(100, 255, 200, 0.7)',   // Mint
        'rgba(255, 100, 200, 0.7)'    // Pink
    ];

    // ===== PARTICLE SYSTEM =====
    const particleCount = 150;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${initialX}%`;
        particle.style.top = `${initialY}%`;
        particle.style.opacity = '0';
        
        // Animation properties
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        particlesContainer.appendChild(particle);
        
        // Animate particle
        animateParticle(particle, duration, delay);
    }
    
    function animateParticle(particle, duration, delay) {
        setTimeout(() => {
            // Random movement
            const moveX = (Math.random() * 100);
            const moveY = (Math.random() * 100);
            
            // Apply animation
            particle.style.transition = `all ${duration}s cubic-bezier(0.1, 0.8, 0.2, 1)`;
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            particle.style.left = `${moveX}%`;
            particle.style.top = `${moveY}%`;
            
            // Restart animation when complete
            setTimeout(() => {
                animateParticle(particle, duration, delay);
            }, duration * 1000);
        }, delay * 1000);
    }
    
    // Mouse interaction particles
    document.addEventListener('mousemove', (e) => {
        // Create sparkle particles
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Position at mouse with slight offset
            const offsetX = (Math.random() * 20 - 10);
            const offsetY = (Math.random() * 20 - 10);
            const mouseX = (e.clientX / window.innerWidth) * 100 + offsetX;
            const mouseY = (e.clientY / window.innerHeight) * 100 + offsetY;
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.left = `${mouseX}%`;
            particle.style.top = `${mouseY}%`;
            particle.style.opacity = '0.8';
            particle.style.boxShadow = `0 0 ${size*2}px ${size}px ${color}`;
            
            particlesContainer.appendChild(particle);
            
            // Animate outward
            setTimeout(() => {
                particle.style.transition = 'all 1s ease-out';
                particle.style.opacity = '0';
                particle.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0.5)`;
                
                // Remove after animation
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }, 10);
        }
    });

    // ===== ENCODE/DECODE FUNCTIONS =====
    function encode(text, key) {
        if (!text) {
            animateError(originalText);
            return '';
        }
        if (!key) {
            animateError(keyInput);
            return '';
        }
        
        animateProcessing(encodeBtn);
        
        return new Promise(resolve => {
            setTimeout(() => {
                let encoded = '';
                for (let i = 0; i < text.length; i++) {
                    const charCode = text.charCodeAt(i);
                    const keyChar = key.charCodeAt(i % key.length);
                    const encodedChar = charCode + keyChar;
                    encoded += String.fromCharCode(encodedChar);
                }
                
                animateSuccess(encodeBtn);
                resolve(btoa(encoded));
            }, 800);
        });
    }

    function decode(encodedText, key) {
        if (!encodedText) {
            animateError(originalText);
            return '';
        }
        if (!key) {
            animateError(keyInput);
            return '';
        }
        
        animateProcessing(decodeBtn);
        
        return new Promise(resolve => {
            setTimeout(() => {
                try {
                    const base64Decoded = atob(encodedText);
                    
                    let decoded = '';
                    for (let i = 0; i < base64Decoded.length; i++) {
                        const charCode = base64Decoded.charCodeAt(i);
                        const keyChar = key.charCodeAt(i % key.length);
                        const decodedChar = charCode - keyChar;
                        decoded += String.fromCharCode(decodedChar);
                    }
                    
                    animateSuccess(decodeBtn);
                    resolve(decoded);
                } catch (e) {
                    animateError(decodeBtn);
                    resolve('Invalid encoded text or wrong key!');
                }
            }, 800);
        });
    }

    // Animation Helpers
    function animateProcessing(element) {
        element.classList.add('processing');
        element.innerHTML = `<span class="spinner"></span>${element.textContent}`;
    }

    function animateSuccess(element) {
        element.classList.remove('processing');
        element.innerHTML = element.textContent.replace('spinner', '');
        element.classList.add('success');
        
        // Create success particles
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            createConfetti(rect.left + rect.width/2, rect.top);
        }
        
        setTimeout(() => {
            element.classList.remove('success');
        }, 1000);
    }

    function animateError(element) {
        element.classList.add('error-pulse');
        setTimeout(() => {
            element.classList.remove('error-pulse');
        }, 1000);
    }

    function createConfetti(x, y) {
        const confetti = document.createElement('div');
        confetti.className = 'particle';
        
        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${(x/window.innerWidth)*100}%`;
        confetti.style.top = `${(y/window.innerHeight)*100}%`;
        confetti.style.opacity = '1';
        confetti.style.boxShadow = `0 0 ${size*2}px ${size}px ${color}`;
        
        particlesContainer.appendChild(confetti);
        
        // Animate
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 10 + 5;
        const rotation = Math.random() * 360;
        
        let posX = (x/window.innerWidth)*100;
        let posY = (y/window.innerHeight)*100;
        let frame = 0;
        
        const animate = () => {
            frame++;
            posX += Math.cos(angle) * 0.2;
            posY += Math.sin(angle) * 0.2 + frame * 0.1;
            
            confetti.style.left = `${posX}%`;
            confetti.style.top = `${posY}%`;
            confetti.style.transform = `rotate(${rotation + frame*2}deg)`;
            confetti.style.opacity = `${1 - frame/60}`;
            
            if (frame < 60) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Event Listeners
    encodeBtn.addEventListener('click', async function() {
        const encoded = await encode(originalText.value, keyInput.value);
        resultText.value = encoded;
    });

    decodeBtn.addEventListener('click', async function() {
        const decoded = await decode(originalText.value, keyInput.value);
        resultText.value = decoded;
    });

    clearBtn.addEventListener('click', function() {
        animateProcessing(clearBtn);
        setTimeout(() => {
            originalText.value = '';
            resultText.value = '';
            keyInput.value = '';
            animateSuccess(clearBtn);
        }, 300);
    });

    copyBtn.addEventListener('click', function() {
        if (!resultText.value) {
            animateError(copyBtn);
            return;
        }
        
        resultText.select();
        document.execCommand('copy');
        
        animateSuccess(copyBtn);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    // Keyboard Shortcuts
    originalText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            encodeBtn.click();
            e.preventDefault();
        } else if (e.shiftKey && e.key === 'Enter') {
            decodeBtn.click();
            e.preventDefault();
        }
    });

    // Button Hover Effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = `0 6px 25px ${this.style.backgroundColor}`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
    });
});
