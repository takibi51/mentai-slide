/**
 * MENTAI ToB LP - Main JavaScript
 * Micro-interactions & Scroll Animations (Light Mode)
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
    initHamburgerMenu();
});

/**
 * Hamburger Menu for Mobile
 */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('headerMenu');
    if (!hamburger || !menu) return;

    // オーバーレイ要素を動的に作成
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        hamburger.classList.add('active');
        menu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        menu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ハンバーガーボタンのトグル
    hamburger.addEventListener('click', () => {
        if (menu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // オーバーレイクリックで閉じる
    overlay.addEventListener('click', closeMenu);

    // メニュー内リンクをクリックしたら閉じる
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // 外部リンクの場合はそのまま遷移させる
            if (!link.getAttribute('href').startsWith('#')) return;
            closeMenu();
        });
    });

    // ウィンドウリサイズでPC表示に戻った場合にメニューをリセット
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

/**
 * Scroll-triggered Fade In Animations
 * Using Intersection Observer for performance
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Contact Form - mailto submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const lastName = document.getElementById('lastName')?.value || '';
        const firstName = document.getElementById('firstName')?.value || '';
        const company = document.getElementById('company')?.value || '';
        const department = document.getElementById('department')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const interest = document.getElementById('interest')?.value || '';
        const message = document.getElementById('message')?.value || '';

        // Map interest to readable text
        const interestMap = {
            'service': 'サービス内容について',
            'pricing': '料金プランについて',
            'demo': 'デモ・トライアルについて',
            'integration': '導入方法について',
            'other': 'その他'
        };
        const interestText = interestMap[interest] || interest;

        // Build email subject and body
        const subject = `【MENTAI】${interestText} - ${company} ${lastName}様`;

        const body = `
【お問い合わせ内容】

■ お名前: ${lastName} ${firstName}
■ 企業様名: ${company}
■ 所属 / 役職: ${department}
■ Email: ${email}
■ 電話番号: ${phone || '(未入力)'}
■ 気になる点: ${interestText}

■ 問い合わせ内容:
${message || '(未入力)'}

---
※ このメールはMENTAI LPのお問い合わせフォームから送信されました。
`.trim();

        // Create mailto link
        const mailtoLink = `mailto:info@mentai.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open email client
        window.location.href = mailtoLink;
    });
}

/**
 * Button Ripple Effect on Click
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(79, 70, 229, 0.2);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Header Background on Scroll (Light Mode)
 */
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(254, 252, 249, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.background = 'rgba(254, 252, 249, 0.9)';
            header.style.boxShadow = 'none';
        }
    });
}

/**
 * Privacy Policy Modal
 */
function initPrivacyModal() {
    const privacyBtn = document.getElementById('privacy-policy-btn');
    const privacyModal = document.getElementById('privacy-modal');
    const privacyClose = document.getElementById('privacy-modal-close');

    if (!privacyBtn || !privacyModal) return;

    // Open modal
    privacyBtn.addEventListener('click', () => {
        privacyModal.style.display = 'flex';
        setTimeout(() => {
            privacyModal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    });

    // Close modal - close button
    if (privacyClose) {
        privacyClose.addEventListener('click', () => {
            closePrivacyModal();
        });
    }

    // Close modal - outside click
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            closePrivacyModal();
        }
    });

    // Close modal - ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && privacyModal.classList.contains('active')) {
            closePrivacyModal();
        }
    });

    function closePrivacyModal() {
        privacyModal.classList.remove('active');
        setTimeout(() => {
            privacyModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }
}

// Initialize privacy modal
document.addEventListener('DOMContentLoaded', initPrivacyModal);
