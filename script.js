document.addEventListener('DOMContentLoaded', function() {
    const originalText = document.getElementById('originalText');
    const resultText = document.getElementById('resultText');
    const keyInput = document.getElementById('key');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Add animation class to textareas on focus
    originalText.addEventListener('focus', function() {
        this.classList.add('text-area-animate');
    });
    
    resultText.addEventListener('focus', function() {
        this.classList.add('text-area-animate');
    });

    // Encode function
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
        
        // Add processing animation
        encodeBtn.classList.add('processing');
        
        // Simulate processing delay for animation
        return new Promise(resolve => {
            setTimeout(() => {
                let encoded = '';
                for (let i = 0; i < text.length; i++) {
                    const charCode = text.charCodeAt(i);
                    const keyChar = key.charCodeAt(i % key.length);
                    const encodedChar = charCode + keyChar;
                    encoded += String.fromCharCode(encodedChar);
                }
                
                // Remove processing class
                encodeBtn.classList.remove('processing');
                
                // Add success animation
                encodeBtn.classList.add('success');
                setTimeout(() => encodeBtn.classList.remove('success'), 1000);
                
                // Convert to base64 to make it more readable
                resolve(btoa(encoded));
            }, 800); // Processing delay for animation
        });
    }

    // Decode function
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
        
        // Add processing animation
        decodeBtn.classList.add('processing');
        
        // Simulate processing delay for animation
        return new Promise(resolve => {
            setTimeout(() => {
                try {
                    // Decode from base64 first
                    const base64Decoded = atob(encodedText);
                    
                    let decoded = '';
                    for (let i = 0; i < base64Decoded.length; i++) {
                        const charCode = base64Decoded.charCodeAt(i);
                        const keyChar = key.charCodeAt(i % key.length);
                        const decodedChar = charCode - keyChar;
                        decoded += String.fromCharCode(decodedChar);
                    }
                    
                    // Remove processing class
                    decodeBtn.classList.remove('processing');
                    
                    // Add success animation
                    decodeBtn.classList.add('success');
                    setTimeout(() => decodeBtn.classList.remove('success'), 1000);
                    
                    resolve(decoded);
                } catch (e) {
                    // Add error animation
                    decodeBtn.classList.remove('processing');
                    decodeBtn.classList.add('error');
                    setTimeout(() => decodeBtn.classList.remove('error'), 1000);
                    
                    resolve('Invalid encoded text or wrong key!');
                }
            }, 800); // Processing delay for animation
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
        // Add clear animation
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
        
        // Visual feedback
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 500);
        
        // Change text temporarily
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    // Allow Ctrl+Enter to encode and Shift+Enter to decode
    originalText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            encodeBtn.click();
            e.preventDefault();
        } else if (e.shiftKey && e.key === 'Enter') {
            decodeBtn.click();
            e.preventDefault();
        }
    });

    // Add hover effect to buttons
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
