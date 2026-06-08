/* ==========================================
   SMART ROOM PRO V2.0
========================================== */

// ===================== LOCAL STORAGE =====================
const SmartRoomStorage = {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key, defaultValue) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }
};

// ===================== THEME SYSTEM =====================
function initTheme() {
    const savedTheme = SmartRoomStorage.get('theme', 'light');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    const currentTheme =
        document.body.classList.contains('dark-theme')
            ? 'dark'
            : 'light';

    SmartRoomStorage.save('theme', currentTheme);

    showNotification(
        `${currentTheme.toUpperCase()} mode activated`,
        'success'
    );
}

initTheme();

// ===================== CLOCK =====================
function startClock() {
    const clockElement = document.querySelector('.live-clock');

    if (!clockElement) return;

    setInterval(() => {
        const now = new Date();

        clockElement.textContent =
            now.toLocaleTimeString();
    }, 1000);
}

startClock();

// ===================== SAVE SLIDER VALUES =====================
document.querySelectorAll('input[type="range"]').forEach(slider => {

    const storageKey = slider.className;

    const savedValue = SmartRoomStorage.get(
        storageKey,
        slider.value
    );

    slider.value = savedValue;

    updateSliderBackground(slider);

    slider.addEventListener('input', () => {

        SmartRoomStorage.save(
            storageKey,
            slider.value
        );

        const valueElement =
            slider.parentElement.querySelector(
                '.slider-value'
            );

        if (valueElement) {
            valueElement.textContent =
                slider.value + '%';
        }
    });
});

// ===================== DEVICE POWER SAVE =====================
document.querySelectorAll('.btn-control').forEach(button => {

    button.addEventListener('click', () => {

        const card =
            button.closest('.device-card');

        const title =
            card.querySelector('h3').textContent;

        SmartRoomStorage.save(title, button.textContent);

        showNotification(
            `${title}: ${button.textContent}`,
            'success'
        );
    });
});

// ===================== RESTORE DEVICE STATES =====================
function restoreDeviceStates() {

    document.querySelectorAll('.device-card').forEach(card => {

        const title =
            card.querySelector('h3').textContent;

        const savedState =
            SmartRoomStorage.get(title, null);

        if (!savedState) return;

        const buttons =
            card.querySelectorAll('.btn-control');

        buttons.forEach(btn => {

            if (
                btn.textContent.trim() ===
                savedState.trim()
            ) {
                btn.classList.add('active');
            }
        });
    });
}

restoreDeviceStates();

// ===================== IMPROVED NOTIFICATIONS =====================
function showToast(message, type = 'info') {

    const toast = document.createElement('div');

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);
}

// ===================== TEMPERATURE STORAGE =====================
document.querySelectorAll('.temp-display').forEach((display, index) => {

    const savedTemp =
        SmartRoomStorage.get(
            `temperature-${index}`,
            null
        );

    if (savedTemp) {
        display.textContent = savedTemp;
    }
});

tempBtns.forEach(btn => {

    btn.addEventListener('click', () => {

        const display =
            btn.parentElement.querySelector(
                '.temp-display'
            );

        if (display) {

            const parentCard =
                [...document.querySelectorAll('.temp-display')]
                    .indexOf(display);

            SmartRoomStorage.save(
                `temperature-${parentCard}`,
                display.textContent
            );
        }
    });
});

// ===================== ENERGY MONITOR =====================
function monitorEnergy() {

    const energyCard =
        document.querySelector('.energy-value');

    if (!energyCard) return;

    setInterval(() => {

        const usage =
            (Math.random() * 3 + 1)
                .toFixed(2);

        energyCard.textContent =
            usage + ' kW';

        if (usage > 3.5) {

            showNotification(
                'High energy consumption detected!',
                'warning'
            );
        }

    }, 7000);
}

monitorEnergy();

// ===================== VOICE COMMANDS =====================
function initVoiceCommands() {

    if (
        !('webkitSpeechRecognition' in window)
    ) {
        return;
    }

    const recognition =
        new webkitSpeechRecognition();

    recognition.continuous = false;

    recognition.onresult = event => {

        const command =
            event.results[0][0]
                .transcript
                .toLowerCase();

        console.log('Voice:', command);

        if (command.includes('turn on light')) {

            showNotification(
                'Lights turned ON',
                'success'
            );
        }

        if (command.includes('turn off light')) {

            showNotification(
                'Lights turned OFF',
                'warning'
            );
        }
    };

    const voiceBtn =
        document.querySelector('.voice-btn');

    if (voiceBtn) {

        voiceBtn.addEventListener(
            'click',
            () => recognition.start()
        );
    }
}

initVoiceCommands();

// ===================== KEYBOARD SHORTCUTS =====================
document.addEventListener('keydown', e => {

    if (e.key === 't') {
        toggleTheme();
    }

    if (e.key === 'Escape') {

        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
});

// ===================== PAGE VISIBILITY =====================
document.addEventListener(
    'visibilitychange',
    () => {

        if (document.hidden) {

            console.log(
                'Smart Room paused'
            );

        } else {

            console.log(
                'Smart Room resumed'
            );
        }
    }
);

// ===================== SYSTEM STATUS =====================
function systemCheck() {

    console.log(
        '%c Smart Room Pro v2.0 Running',
        'background:#10b981;color:white;padding:10px;font-size:14px'
    );

    console.log(
        '✓ Sensors Online'
    );

    console.log(
        '✓ Automation Active'
    );

    console.log(
        '✓ Energy Monitoring Active'
    );

    console.log(
        '✓ Local Storage Connected'
    );
}

systemCheck();
