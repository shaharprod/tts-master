// Hebrew TTS Application
class HebrewTTS {
    constructor() {
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.isPlaying = false;
        this.isPaused = false;

        this.initElements();
        this.initEventListeners();
        this.loadVoices();
        this.setupVoiceChangeListener();
    }

    initElements() {
        this.textInput = document.getElementById('textInput');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.speedRange = document.getElementById('speedRange');
        this.pitchRange = document.getElementById('pitchRange');
        this.speedValue = document.getElementById('speedValue');
        this.pitchValue = document.getElementById('pitchValue');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.exampleBtns = document.querySelectorAll('.example-btn');
    }

    initEventListeners() {
        // Main buttons
        this.playBtn.addEventListener('click', () => this.playText());
        this.pauseBtn.addEventListener('click', () => this.pauseText());
        this.stopBtn.addEventListener('click', () => this.stopText());
        this.clearBtn.addEventListener('click', () => this.clearText());

        // Range inputs
        this.speedRange.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value;
        });

        this.pitchRange.addEventListener('input', (e) => {
            this.pitchValue.textContent = e.target.value;
        });

        // Example buttons
        this.exampleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.getAttribute('data-text');
                this.textInput.value = text;
                this.textInput.focus();
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.playText();
                        break;
                    case ' ':
                        e.preventDefault();
                        if (this.isPlaying) {
                            this.pauseText();
                        } else {
                            this.playText();
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.stopText();
                        break;
                }
            }
        });

        // Auto-resize textarea
        this.textInput.addEventListener('input', () => {
            this.textInput.style.height = 'auto';
            this.textInput.style.height = this.textInput.scrollHeight + 'px';
        });
    }

    loadVoices() {
        const voices = this.synth.getVoices();
        this.populateVoiceSelect(voices);
    }

    setupVoiceChangeListener() {
        // Some browsers load voices asynchronously
        if ('onvoiceschanged' in this.synth) {
            this.synth.onvoiceschanged = () => {
                const voices = this.synth.getVoices();
                this.populateVoiceSelect(voices);
            };
        }
    }

    populateVoiceSelect(voices) {
        // Clear existing options
        this.voiceSelect.innerHTML = '<option value="">קול ברירת מחדל</option>';

        // Filter Hebrew voices or voices that support Hebrew
        const hebrewVoices = voices.filter(voice =>
            voice.lang.startsWith('he') ||
            voice.lang.startsWith('iw') ||
            voice.name.toLowerCase().includes('hebrew') ||
            voice.name.toLowerCase().includes('he')
        );

        // Add Hebrew voices first
        hebrewVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            this.voiceSelect.appendChild(option);
        });

        // Add other voices that might work with Hebrew
        const otherVoices = voices.filter(voice =>
            !hebrewVoices.includes(voice) &&
            (voice.lang.startsWith('en') || voice.lang.startsWith('ar'))
        );

        if (otherVoices.length > 0) {
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.textContent = '───────────────';
            this.voiceSelect.appendChild(separator);

            otherVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                this.voiceSelect.appendChild(option);
            });
        }
    }

    playText() {
        const text = this.textInput.value.trim();

        if (!text) {
            this.showNotification('אנא הכנס טקסט להמשעה', 'warning');
            this.textInput.focus();
            return;
        }

        // Stop any current speech
        this.synth.cancel();

        // Create new utterance
        this.currentUtterance = new SpeechSynthesisUtterance(text);

        // Set voice
        const selectedVoice = this.voiceSelect.value;
        if (selectedVoice) {
            const voices = this.synth.getVoices();
            const voice = voices.find(v => v.name === selectedVoice);
            if (voice) {
                this.currentUtterance.voice = voice;
            }
        }

        // Set speech parameters
        this.currentUtterance.rate = parseFloat(this.speedRange.value);
        this.currentUtterance.pitch = parseFloat(this.pitchRange.value);
        this.currentUtterance.volume = 1.0;
        this.currentUtterance.lang = 'he-IL'; // Hebrew Israel

        // Event listeners for utterance
        this.currentUtterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            this.updateButtonStates();
            this.showNotification('התחלת השמעה', 'success');
        };

        this.currentUtterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateButtonStates();
        };

        this.currentUtterance.onerror = (event) => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateButtonStates();
            this.showNotification('שגיאה בהשמעה: ' + event.error, 'error');
        };

        this.currentUtterance.onpause = () => {
            this.isPaused = true;
            this.updateButtonStates();
        };

        this.currentUtterance.onresume = () => {
            this.isPaused = false;
            this.updateButtonStates();
        };

        // Speak
        this.synth.speak(this.currentUtterance);
    }

    pauseText() {
        if (this.isPlaying && !this.isPaused) {
            this.synth.pause();
            this.showNotification('השהייה', 'info');
        } else if (this.isPaused) {
            this.synth.resume();
            this.showNotification('המשכת השמעה', 'info');
        }
    }

    stopText() {
        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.updateButtonStates();
        this.showNotification('עצירה', 'info');
    }

    clearText() {
        this.textInput.value = '';
        this.textInput.style.height = 'auto';
        this.textInput.focus();
        this.showNotification('טקסט נוקה', 'info');
    }

    updateButtonStates() {
        this.playBtn.disabled = this.isPlaying && !this.isPaused;
        this.pauseBtn.disabled = !this.isPlaying;
        this.stopBtn.disabled = !this.isPlaying && !this.isPaused;

        // Update button text based on state
        if (this.isPaused) {
            this.pauseBtn.innerHTML = '<span class="btn-icon">▶️</span> המשך';
        } else {
            this.pauseBtn.innerHTML = '<span class="btn-icon">⏸️</span> השהייה';
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            zIndex: '1000',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
        alert('הדפדפן שלך לא תומך בהמרת טקסט לדיבור. אנא השתמש בדפדפן מודרני יותר.');
        return;
    }

    // Initialize the TTS application
    const ttsApp = new HebrewTTS();

    // Add some helpful tips
    console.log('🎤 Hebrew TTS Application Loaded!');
    console.log('💡 Keyboard shortcuts:');
    console.log('   Ctrl/Cmd + Enter: Play text');
    console.log('   Ctrl/Cmd + Space: Play/Pause');
    console.log('   Ctrl/Cmd + Escape: Stop');
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
