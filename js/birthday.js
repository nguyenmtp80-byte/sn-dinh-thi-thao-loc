// JavaScript Website Sinh Nhật
document.addEventListener('DOMContentLoaded', function() {
    // Các phần tử DOM
    const giftBox = document.getElementById('giftBox');
    const birthdayMessage = document.getElementById('birthdayMessage');
    const confettiContainer = document.getElementById('confettiContainer');
    const heartsContainer = document.getElementById('heartsContainer');
    const musicToggle = document.getElementById('musicToggle');
    const birthdayMusic = document.getElementById('birthdayMusic');
    const nameModal = document.getElementById('nameModal');
    const nameInput = document.getElementById('nameInput');
    const submitName = document.getElementById('submitName');
    const birthdayName = document.getElementById('birthdayName');

    // Biến trạng thái
    let isGiftOpened = false;
    let isMusicPlaying = false;
    let candlesBlown = false;

    // Tiếp tục nhạc từ trang đăng nhập với nhiều lần thử
    const initializeMusic = () => {
        if (birthdayMusic) {
            // Kiểm tra xem nhạc có đang phát từ trang đăng nhập không
            const wasMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
            const wasStarted = localStorage.getItem('musicWasStarted') === 'true';
            const shouldContinue = localStorage.getItem('musicShouldContinue') === 'true';
            const savedTime = parseFloat(localStorage.getItem('musicCurrentTime')) || 0;
            const savedVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.7;
            
            // Đặt âm lượng và thời gian hiện tại
            birthdayMusic.volume = savedVolume;
            if (savedTime > 0) {
                birthdayMusic.currentTime = savedTime;
            }
            
            // Bắt đầu nhạc nếu nó đang phát hoặc đã được khởi động trước đó
            if (wasMusicPlaying || wasStarted || shouldContinue) {
                const playPromise = birthdayMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isMusicPlaying = true;
                        musicStarted = true;
                        updateMusicButton();
                        console.log('🎵 Nhạc tiếp tục thành công từ trang đăng nhập!');
                    }).catch(() => {
                        console.log('🎵 Autoplay bị chặn, sẽ bắt đầu khi người dùng tương tác');
                        // Thiết lập dự phòng cho tương tác người dùng
                        setupMusicFallback();
                    });
                }
            } else {
                // Ngay cả khi nhạc không phát, hãy thử bắt đầu cho trang sinh nhật
                setupMusicFallback();
            }
            
            // Xóa localStorage sau khi sử dụng
            localStorage.removeItem('musicPlaying');
            localStorage.removeItem('musicCurrentTime');
            localStorage.removeItem('musicVolume');
            localStorage.removeItem('musicWasStarted');
            localStorage.removeItem('musicShouldContinue');
        }
    };

    // Thiết lập dự phòng bắt đầu nhạc khi người dùng tương tác
    const setupMusicFallback = () => {
        if (musicStarted) return;
        
        const startMusic = () => {
            if (birthdayMusic && !musicStarted) {
                birthdayMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicStarted = true;
                    updateMusicButton();
                    console.log('🎵 Nhạc đã bắt đầu sau tương tác trên trang sinh nhật!');
                }).catch(() => {});
            }
        };

        // Lắng nghe các tương tác khác nhau của người dùng
        ['click', 'touchstart', 'touchend', 'keydown'].forEach(event => {
            document.addEventListener(event, startMusic, { once: true });
        });
    };

    // Khởi tạo nhạc ngay lập tức và với dự phòng
    let musicStarted = false;
    initializeMusic();
    setTimeout(initializeMusic, 100);
    setTimeout(initializeMusic, 500); // Nhiều lần thử để đảm bảo độ tin cậy

    // Sự kiện click hộp quà
    if (giftBox) {
        giftBox.addEventListener('click', function() {
            // Đảm bảo nhạc phát khi tương tác đầu tiên
            if (birthdayMusic && (!isMusicPlaying || birthdayMusic.paused)) {
                birthdayMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicStarted = true;
                    updateMusicButton();
                }).catch(() => {});
            }
            
            if (!isGiftOpened) {
                openGift();
            }
        });
    }

    // Sự kiện click bánh để thổi nến
    const cakeSection = document.querySelector('.cake-section');
    const birthdayCake = document.querySelector('.birthday-cake');
    
    if (cakeSection && birthdayCake) {
        // Xử lý click trên bánh kem
        birthdayCake.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn event bubbling
            
            // Thêm class animation click
            birthdayCake.classList.add('clicked');
            
            // Xóa class sau khi animation hoàn thành
            setTimeout(() => {
                birthdayCake.classList.remove('clicked');
            }, 600);
            
            // Đảm bảo nhạc phát khi người dùng tương tác
            if (birthdayMusic && (!isMusicPlaying || birthdayMusic.paused)) {
                birthdayMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicStarted = true;
                    updateMusicButton();
                }).catch(() => {});
            }
            
            if (!candlesBlown) {
                blowCandles();
            }
        });
        
        // Xử lý click trên section (backup)
        cakeSection.addEventListener('click', function(e) {
            // Đảm bảo nhạc phát khi người dùng tương tác
            if (birthdayMusic && (!isMusicPlaying || birthdayMusic.paused)) {
                birthdayMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicStarted = true;
                    updateMusicButton();
                }).catch(() => {});
            }
            
            if (!candlesBlown && e.target === cakeSection) {
                blowCandles();
            }
        });
    }

    // Thêm listener click vào document để dự phòng nhạc
    document.addEventListener('click', function() {
        if (birthdayMusic && (!isMusicPlaying || birthdayMusic.paused)) {
            birthdayMusic.play().then(() => {
                isMusicPlaying = true;
                musicStarted = true;
                updateMusicButton();
            }).catch(() => {});
        }
    }, { once: true }); // Chỉ kích hoạt một lần

    // Open gift function
    function openGift() {
        if (isGiftOpened) return;
        
        isGiftOpened = true;
        giftBox.classList.add('opened');
        
        // Hide click instruction
        const clickInstruction = document.querySelector('.click-instruction');
        if (clickInstruction) {
            clickInstruction.style.opacity = '0';
            setTimeout(() => {
                clickInstruction.style.display = 'none';
            }, 500);
        }

        // Show birthday message after gift animation
        setTimeout(() => {
            if (birthdayMessage) {
                birthdayMessage.classList.remove('hidden');
                birthdayMessage.style.display = 'flex';
                
                // Start effects
                createConfetti();
                startFloatingHearts();
                
                // Hide background elements for focus on card
                hideBackgroundElements();
            }
        }, 1500);
    }

    // Hide background elements
    function hideBackgroundElements() {
        const elements = document.querySelectorAll('.background-elements, .balloons-container, .gift-container');
        elements.forEach(element => {
            element.style.transition = 'opacity 1s ease';
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.display = 'none';
            }, 1000);
        });
    }

    // Music toggle
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    function toggleMusic() {
        if (isMusicPlaying) {
            birthdayMusic.pause();
            isMusicPlaying = false;
        } else {
            birthdayMusic.play().catch(() => {});
            isMusicPlaying = true;
        }
        updateMusicButton();
    }

    function updateMusicButton() {
        if (musicToggle) {
            const icon = musicToggle.querySelector('i');
            if (icon) {
                icon.className = isMusicPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            }
        }
    }

    // Create confetti
    function createConfetti() {
        if (!confettiContainer) return;
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confettiContainer.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }

    // Start floating hearts
    function startFloatingHearts() {
        if (!heartsContainer) return;
        
        setInterval(() => {
            createFloatingHeart();
        }, 800);
    }

    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        heartsContainer.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 5000);
    }

    // Initialize photo interactions
    function initializePhotoInteractions() {
        const photos = document.querySelectorAll('.memory-photo, .carousel-photo');
        photos.forEach(photo => {
            photo.addEventListener('click', function() {
                createPhotoModal(this.src, this.alt);
            });
        });
    }

    // Create photo modal
    function createPhotoModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="photo-modal-content">
                <span class="close-modal">&times;</span>
                <img src="${src}" alt="${alt}" class="modal-photo">
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Initialize after page load
    setTimeout(() => {
        initializePhotoInteractions();
    }, 2000);

    // Blow candles function
    function blowCandles() {
        if (candlesBlown) return;
        
        candlesBlown = true;
        const flames = document.querySelectorAll('.flame');
        const candles = document.querySelectorAll('.candle');
        const cakeSection = document.querySelector('.cake-section');
        
        // Add celebration class to cake
        if (cakeSection) {
            cakeSection.classList.add('celebrated');
        }
        
        // Blow out each flame with delay
        flames.forEach((flame, index) => {
            setTimeout(() => {
                // Add blowing animation
                flame.classList.add('blowing');
                
                // Create smoke effect
                const smoke = document.createElement('div');
                smoke.className = 'smoke';
                candles[index].appendChild(smoke);
                
                // Remove smoke after animation
                setTimeout(() => {
                    if (candles[index].contains(smoke)) {
                        candles[index].removeChild(smoke);
                    }
                }, 2000);
                
                // Add blown-out class after animation
                setTimeout(() => {
                    flame.classList.add('blown-out');
                }, 800);
                
            }, index * 200); // Stagger the blowing
        });
        
        // Create extra confetti for celebration
        setTimeout(() => {
            createExtraConfetti();
            updateCakeMessage();
        }, 1000);
    }
    
    // Create extra confetti for cake celebration
    function createExtraConfetti() {
        if (!confettiContainer) return;
        
        const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 1 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
            confetti.style.width = '12px';
            confetti.style.height = '12px';
            confetti.style.borderRadius = '50%';
            
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                if (confettiContainer.contains(confetti)) {
                    confettiContainer.removeChild(confetti);
                }
            }, 3000);
        }
    }
    
    // Update cake message after blowing candles
    function updateCakeMessage() {
        const cakeMessage = document.querySelector('.cake-message');
        if (cakeMessage) {
            cakeMessage.innerHTML = '🎉 Ước mơ của em sẽ thành hiện thực! 🎉';
            cakeMessage.style.color = '#e74c3c';
            cakeMessage.style.fontSize = '1.3rem';
            cakeMessage.style.animation = 'bounce 1s ease-in-out';
        }
    }

    // Handle music ended event (loop)
    if (birthdayMusic) {
        birthdayMusic.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play().catch(() => {});
        });
    }

    // Auto-scroll photos carousel (Infinite loop)
    const photosCarousel = document.querySelector('.photos-carousel');
    const carouselTrack = document.getElementById('photosCarousel');

    if (photosCarousel && carouselTrack) {
        const items = [...carouselTrack.children];
        
        // Clone các ảnh gốc và thêm vào cuối để tạo vòng lặp vô tận
        items.forEach(item => {
            const clone = item.cloneNode(true);
            carouselTrack.appendChild(clone);
        });

        let isHovered = false;
        let scrollSpeed = 0.5; // Tốc độ di chuyển chậm chậm
        let scrollPos = 0;

        // Tạm dừng khi người dùng chạm hoặc di chuột vào
        photosCarousel.addEventListener('mouseenter', () => isHovered = true);
        photosCarousel.addEventListener('mouseleave', () => isHovered = false);
        photosCarousel.addEventListener('touchstart', () => isHovered = true, {passive: true});
        photosCarousel.addEventListener('touchend', () => isHovered = false);

        function autoScroll() {
            // Lấy khoảng cách từ ảnh gốc đầu tiên đến ảnh clone đầu tiên
            const jumpPoint = carouselTrack.children[items.length].offsetLeft - carouselTrack.children[0].offsetLeft;

            if (jumpPoint > 0) {
                if (!isHovered) {
                    scrollPos += scrollSpeed;
                    
                    // Nếu cuộn qua 1 chu kỳ, quay lại vị trí tương ứng ở chu kỳ trước
                    if (scrollPos >= jumpPoint) {
                        scrollPos -= jumpPoint;
                    }
                    photosCarousel.scrollLeft = scrollPos;
                } else {
                    // Cập nhật scrollPos bằng với vị trí người dùng đang cuộn
                    scrollPos = photosCarousel.scrollLeft;
                    
                    // Cho phép lướt tay vô tận
                    if (scrollPos >= jumpPoint) {
                        photosCarousel.scrollLeft = scrollPos - jumpPoint;
                        scrollPos = photosCarousel.scrollLeft;
                    }
                }
            }
            requestAnimationFrame(autoScroll);
        }
        
        // Đợi một chút rồi mới bắt đầu tự động cuộn
        setTimeout(() => {
            requestAnimationFrame(autoScroll);
        }, 1000);
    }

    console.log('🎉 Birthday website loaded successfully! 🎉');
});
