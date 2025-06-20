document.addEventListener('DOMContentLoaded', function() {
    const originalText = document.getElementById('originalText');
    const resultText = document.getElementById('resultText');
    const keyInput = document.getElementById('key');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Encode function
    function encode(text, key) {
        if (!text) return '';
        if (!key) {
            alert('Please enter a key for encoding');
            return '';
        }
        
        let encoded = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            const encodedChar = charCode + keyChar;
            encoded += String.fromCharCode(encodedChar);
        }
        
        // Convert to base64 to make it more readable
        return btoa(encoded);
    }

    // Decode function
    function decode(encodedText, key) {
        if (!encodedText) return '';
        if (!key) {
            alert('Please enter the key for decoding');
            return '';
        }
        
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
            
            return decoded;
        } catch (e) {
            alert('Invalid encoded text or wrong key!');
            return '';
        }
    }

    // Event listeners
    encodeBtn.addEventListener('click', function() {
        resultText.value = encode(originalText.value, keyInput.value);
    });

    decodeBtn.addEventListener('click', function() {
        resultText.value = decode(originalText.value, keyInput.value);
    });

    clearBtn.addEventListener('click', function() {
        originalText.value = '';
        resultText.value = '';
        keyInput.value = '';
    });

    copyBtn.addEventListener('click', function() {
        if (!resultText.value) {
            alert('No result to copy!');
            return;
        }
        
        resultText.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
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
});
