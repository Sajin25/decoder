document.addEventListener('DOMContentLoaded', function() {
    // Existing variables
    const originalText = document.getElementById('originalText');
    const resultText = document.getElementById('resultText');
    const keyInput = document.getElementById('key');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // ===== PARTICLE EFFECTS =====
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 80;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size (small)
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random color
        const colors = ['rgba(52, 152, 219, 0.3)', 'rgba(155, 89, 182, 0.3)', 'rgba(46, 204, 113, 0.3)'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Initial position
        resetParticle(particle);
        
        particlesContainer.appendChild(particle);
        
        // Animate
        animateParticle(particle);
    }
    
    function resetParticle(particle) {
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = '0';
        
        return {
            x: posX,
            y: posY
        };
    }
    
    function animateParticle(particle) {
        // Initial position
        const pos = resetParticle(particle);
        
        // Random animation properties
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        // Animate with GSAP-like timing
        setTimeout(() => {
            particle.style.transition = `all ${duration}s linear`;
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            
            // Move in a slight direction
            const moveX = pos.x + (Math.random() * 20 - 10);
            const moveY = pos.y - Math.random() * 30; // Move upwards
            
            particle.style.left = `${moveX}%`;
            particle.style.top = `${moveY}%`;
            
            // Reset after animation completes
            setTimeout(() => {
                animateParticle(particle);
            }, duration * 1000);
        }, delay * 1000);
    }
    
    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
        // Create particles at mouse position
        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;
        
        // Create temporary particle
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Small size
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position at mouse
        particle.style.left = `${mouseX}%`;
        particle.style.top = `${mouseY}%`;
        particle.style.opacity = '0.6';
        
        particlesContainer.appendChild(particle);
        
        // Animate outward
        setTimeout(() => {
            particle.style.transition = 'all 2s ease-out';
            particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
            particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
            particle.style.opacity = '0';
            
            // Remove after animation
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }, 10);
    });

    // ===== ENCODE/DECODE FUNCTIONS =====
    function encode(text, key) {
        if (!text) {
            originalText.classList.add('pulse');
            setTimeout(() => originalText.classList.remove('pulse'), 1000);
            return '';
        }
        if (!key) {
            keyInput.classList.add('pulse');
            setTimeout(() => keyInput.classList.remove('pulse'), 1000);
            return '';
        }
        
        encodeBtn.classList.add('processing');
        
        return new Promise(resolve => {
            setTimeout(() => {
                let encoded = '';
                for (let i = 0; i < text.length; i++) {
                    const charCode = text.charCodeAt(i);
                    const keyChar = key.charCodeAt(i % key.length);
                    const encodedChar = charCode + keyChar;
                    encoded += String.fromCharCode(encodedChar);
                }
                
                encodeBtn.classList.remove('processing');
                encodeBtn.classList.add('success');
                setTimeout(() => encodeBtn.classList.remove('success'), 1000);
                
                resolve(btoa(encoded));
            }, 800);
        });
    }

    function decode(encodedText, key) {
        if (!encodedText) {
            originalText.classList.add('pulse');
            setTimeout(() => originalText.classList.remove('pulse'), 1000);
            return '';
        }
        if (!key) {
            keyInput.classList.add('pulse');
            setTimeout(() => keyInput.classList.remove('pulse'), 1000);
            return '';
        }
        
        decodeBtn.classList.add('processing');
        
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
                    
                    decodeBtn.classList.remove('processing');
                    decodeBtn.classList.add('success');
                    setTimeout(() => decodeBtn.classList.remove('success'), 1000);
                    
                    resolve(decoded);
                } catch (e) {
                    decodeBtn.classList.remove('processing');
                    decodeBtn.classList.add('error');
                    setTimeout(() => decodeBtn.classList.remove('error'), 1000);
                    
                    resolve('Invalid encoded text or wrong key!');
                }
            }, 800);
        });
    }

    // Event listeners
    encodeBtn.addEventListener('click', async function() {
        const encoded = await encode(originalText.value, keyInput.value);
        resultText.value = encoded;
    });

    decodeBtn.addEventListener('click', async function() {
        const decoded = await decode(originalText.value, keyInput.value);
        resultText.value = decoded;
    });

    clearBtn.addEventListener('click', function() {
        clearBtn.classList.add('clearing');
        setTimeout(() => {
            originalText.value = '';
            resultText.value = '';
            keyInput.value = '';
            clearBtn.classList.remove('clearing');
        }, 300);
    });

    copyBtn.addEventListener('click', function() {
        if (!resultText.value) {
            copyBtn.classList.add('pulse');
            setTimeout(() => copyBtn.classList.remove('pulse'), 1000);
            return;
        }
        
        resultText.select();
        document.execCommand('copy');
        
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 500);
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    // Keyboard shortcuts
    originalText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            encodeBtn.click();
            e.preventDefault();
        } else if (e.shiftKey && e.key === 'Enter') {
            decodeBtn.click();
            e.preventDefault();
        }
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
