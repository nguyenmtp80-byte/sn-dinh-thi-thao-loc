// Hệ thống đăng nhập JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Các phần tử DOM
    const passwordInput = document.getElementById('passwordInput');
    const confirmBtn = document.getElementById('confirmBtn');
    const clearBtn = document.getElementById('clearBtn');
    const numberBtns = document.querySelectorAll('.number');
    const birthdayMusic = document.getElementById('birthdayMusic');
    const musicToggleLogin = document.getElementById('musicToggleLogin');

    // Cài đặt
    const correctPassword = '26052007'; // Mật khẩu sinh nhật
    let currentPassword = '';
    let isMusicPlaying = false;

    // Bắt đầu nhạc tự động với nhiều phương pháp dự phòng
    const startMusic = () => {
        if (birthdayMusic) {
            // Bỏ tắt tiếng trước (vì đã thêm thuộc tính muted để autoplay)
            birthdayMusic.muted = false;
            birthdayMusic.volume = 0.7;
            birthdayMusic.play().then(() => {
                isMusicPlaying = true;
                updateMusicButton();
                console.log('🎵 Nhạc đã bắt đầu tự động!');
            }).catch(() => {
                console.log('🎵 Autoplay bị chặn, sẽ phát nhạc khi người dùng tương tác');
                // Thiết lập dự phòng cho tương tác người dùng
                setupMusicFallback();
            });

            // Lưu thời gian nhạc mỗi 2 giây để chuyển trang mượt mà
            setInterval(() => {
                if (birthdayMusic && !birthdayMusic.paused) {
                    localStorage.setItem('musicCurrentTime', birthdayMusic.currentTime);
                    localStorage.setItem('musicPlaying', 'true');
                    localStorage.setItem('musicVolume', birthdayMusic.volume);
                }
            }, 100); // Giảm xuống 100ms để chuyển trang mượt hơn
        }
    };

    // Nhiều lần thử để bắt đầu nhạc
    setTimeout(startMusic, 100);
    setTimeout(startMusic, 500);
    setTimeout(startMusic, 1000);

    // Dự phòng: bắt đầu nhạc khi người dùng tương tác
    const setupMusicFallback = () => {
        const startOnInteraction = () => {
            if (birthdayMusic && birthdayMusic.paused) {
                birthdayMusic.muted = false; // Bỏ tắt tiếng khi tương tác
                birthdayMusic.volume = 0.7;
                birthdayMusic.play().then(() => {
                    isMusicPlaying = true;
                    updateMusicButton();
                    console.log('🎵 Nhạc đã bắt đầu sau tương tác!');
                }).catch(() => { });
            }
        };

        // Lắng nghe các tương tác khác nhau của người dùng
        ['click', 'touchstart', 'keydown', 'mousemove'].forEach(event => {
            document.addEventListener(event, startOnInteraction, { once: true });
        });
    };

    // Thiết lập dự phòng ngay lập tức
    setupMusicFallback();

    // Xử lý các nút số với kích hoạt nhạc
    numberBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Thử bắt đầu nhạc khi tương tác đầu tiên
            if (birthdayMusic && birthdayMusic.paused) {
                birthdayMusic.play().then(() => {
                    isMusicPlaying = true;
                    updateMusicButton();
                }).catch(() => { });
            }

            if (currentPassword.length < 8) {
                currentPassword += this.dataset.number;
                updatePasswordDisplay();
                playClickSound();
            }
        });
    });

    // Nút xóa
    clearBtn.addEventListener('click', function () {
        currentPassword = '';
        updatePasswordDisplay();
        playClickSound();
    });

    // Nút xác nhận
    confirmBtn.addEventListener('click', function () {
        if (currentPassword === correctPassword) {
            loginSuccess();
        } else {
            loginError();
        }
    });

    // Hỗ trợ phím Enter
    document.addEventListener('keydown', function (e) {
        if (e.key >= '0' && e.key <= '9' && currentPassword.length < 8) {
            currentPassword += e.key;
            updatePasswordDisplay();
            playClickSound();
        } else if (e.key === 'Enter') {
            confirmBtn.click();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            currentPassword = currentPassword.slice(0, -1);
            updatePasswordDisplay();
            playClickSound();
        }
    });

    function updatePasswordDisplay() {
        if (currentPassword.length === 0) {
            passwordInput.value = '';
            passwordInput.placeholder = '••••••••';
        } else {
            passwordInput.value = currentPassword;
            passwordInput.placeholder = '';
        }
    }

    function loginSuccess() {
        playSuccessSound();

        // Lưu trạng thái nhạc và thời gian hiện tại cho trang sinh nhật
        if (birthdayMusic) {
            localStorage.setItem('musicPlaying', 'true');
            localStorage.setItem('musicCurrentTime', birthdayMusic.currentTime);
            localStorage.setItem('musicVolume', birthdayMusic.volume);
            localStorage.setItem('musicWasStarted', 'true');

            // Đảm bảo nhạc vẫn phát khi chuyển trang
            localStorage.setItem('musicShouldContinue', 'true');
        }

        // Hiệu ứng thành công
        const loginScreen = document.querySelector('.login-screen');
        loginScreen.style.transition = 'all 1s ease';
        loginScreen.style.transform = 'scale(0.8)';
        loginScreen.style.opacity = '0';

        // Chuyển hướng đến trang sinh nhật sau hiệu ứng
        setTimeout(() => {
            window.location.href = 'birthday.html';
        }, 1000);
    }

    function loginError() {
        currentPassword = '';
        updatePasswordDisplay();
        playErrorSound();

        // Shake animation
        const container = document.querySelector('.login-container');
        container.style.animation = 'shake 0.5s ease-in-out';

        // Change colors temporarily
        passwordInput.style.borderColor = '#FF4444';
        passwordInput.style.backgroundColor = '#FFE8E8';

        setTimeout(() => {
            container.style.animation = '';
            passwordInput.style.borderColor = '';
            passwordInput.style.backgroundColor = '';
        }, 500);
    }

    // Điều khiển nhạc
    if (musicToggleLogin) {
        musicToggleLogin.addEventListener('click', toggleMusic);
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            birthdayMusic.pause();
            isMusicPlaying = false;
        } else {
            birthdayMusic.play().catch(() => { });
            isMusicPlaying = true;
        }
        updateMusicButton();
    }

    function updateMusicButton() {
        if (musicToggleLogin) {
            const icon = musicToggleLogin.querySelector('i');
            if (icon) {
                icon.className = isMusicPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            }
        }
    }

    // Hiệu ứng âm thanh
    function playClickSound() {
        createBeep(800, 0.1, 0.3);
    }

    function playSuccessSound() {
        createBeep(600, 0.2, 0.5);
        setTimeout(() => createBeep(800, 0.2, 0.5), 200);
        setTimeout(() => createBeep(1000, 0.3, 0.5), 400);
    }

    function playErrorSound() {
        createBeep(300, 0.3, 0.5);
        setTimeout(() => createBeep(250, 0.3, 0.5), 200);
    }

    function createBeep(frequency, duration, volume) {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.log('Audio context không khả dụng');
            }
        }
    }

    // Khởi tạo
    updatePasswordDisplay();

    console.log(`
        🎉🎂 HỆ THỐNG ĐĂNG NHẬP SINH NHẬT! 🎂🎉
        
        🔐 Mật khẩu hiện tại: ${correctPassword}
        💡 Thay đổi mật khẩu trong js/script.js dòng 12
        
        ✨ Tính năng mới:
        📱 Tối ưu hóa cho cả web và mobile
        🎵 Nhạc phát liên tục không delay khi chuyển trang
        🎯 Touch-friendly interface
        
        Được tạo với ❤️ cho một ngày sinh nhật đặc biệt! ✨
    `);
});
