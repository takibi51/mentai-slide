/* ============================================
   MENTAI Slide Presentation — slides.js
   ============================================ */

(function () {
    'use strict';

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-nav-dot');
    const prevBtn = document.getElementById('arrow-prev');
    const nextBtn = document.getElementById('arrow-next');
    const counter = document.getElementById('slide-counter');
    const progressBar = document.getElementById('progress-bar');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isAnimating = false;

    /* ---------- helpers ---------- */
    function updateUI() {
        // progress
        const pct = ((currentIndex + 1) / totalSlides) * 100;
        progressBar.style.width = pct + '%';

        // counter
        counter.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');

        // arrows
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;

        // dots
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    function goTo(index) {
        if (isAnimating || index === currentIndex || index < 0 || index >= totalSlides) return;
        isAnimating = true;

        const current = slides[currentIndex];
        const next = slides[index];

        current.classList.remove('active');
        current.classList.add('exiting');

        next.classList.add('active');

        setTimeout(function () {
            current.classList.remove('exiting');
            isAnimating = false;
        }, 750);

        currentIndex = index;
        updateUI();
    }

    function goNext() {
        goTo(currentIndex + 1);
    }
    function goPrev() {
        goTo(currentIndex - 1);
    }

    /* ---------- events ---------- */
    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            goTo(i);
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            goNext();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            goNext();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            goPrev();
        }
    });

    // Touch / swipe support
    let touchStartY = 0;
    let touchStartX = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx < 40 && absDy < 40) return; // ignore tap

        if (absDx > absDy) {
            // horizontal swipe
            if (dx < -40) goNext();
            else if (dx > 40) goPrev();
        } else {
            // vertical swipe
            if (dy < -40) goNext();
            else if (dy > 40) goPrev();
        }
    }, { passive: true });

    // Mouse wheel
    let wheelTimeout = null;
    document.addEventListener('wheel', function (e) {
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(function () {
            wheelTimeout = null;
        }, 1000);
        if (e.deltaY > 30) goNext();
        else if (e.deltaY < -30) goPrev();
    }, { passive: true });

    /* ---------- init ---------- */
    slides[0].classList.add('active');
    updateUI();

    /* ---------- Radar Chart (canvas) for evaluation slide ---------- */
    var radarCanvas = document.getElementById('radar-chart');
    if (radarCanvas) {
        drawRadarChart(radarCanvas);
    }

    function drawRadarChart(canvas) {
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        var cx = w / 2;
        var cy = h / 2;
        var r = Math.min(w, h) / 2 - 30;

        var labels = ['思考力', '主体性', '協調性', 'ストレス耐性', '成長意欲'];
        var values = [0.85, 0.78, 0.72, 0.80, 0.90];
        var n = labels.length;

        function angleFor(i) {
            return (Math.PI * 2 * i) / n - Math.PI / 2;
        }

        // grid
        ctx.strokeStyle = 'rgba(74,124,255,0.12)';
        ctx.lineWidth = 1;
        for (var level = 1; level <= 5; level++) {
            var lr = (r * level) / 5;
            ctx.beginPath();
            for (var i = 0; i <= n; i++) {
                var a = angleFor(i % n);
                var px = cx + lr * Math.cos(a);
                var py = cy + lr * Math.sin(a);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // axes
        ctx.strokeStyle = 'rgba(74,124,255,0.08)';
        for (var i = 0; i < n; i++) {
            var a = angleFor(i);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
            ctx.stroke();
        }

        // filled area
        var grd = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
        grd.addColorStop(0, 'rgba(74,124,255,0.25)');
        grd.addColorStop(1, 'rgba(46,196,182,0.2)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        for (var i = 0; i < n; i++) {
            var a = angleFor(i);
            var vr = r * values[i];
            var px = cx + vr * Math.cos(a);
            var py = cy + vr * Math.sin(a);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // outline
        ctx.strokeStyle = 'rgba(74,124,255,0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
            var idx = i % n;
            var a = angleFor(idx);
            var vr = r * values[idx];
            var px = cx + vr * Math.cos(a);
            var py = cy + vr * Math.sin(a);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // dots
        for (var i = 0; i < n; i++) {
            var a = angleFor(i);
            var vr = r * values[i];
            var px = cx + vr * Math.cos(a);
            var py = cy + vr * Math.sin(a);
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#4A7CFF';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // labels
        ctx.fillStyle = 'rgba(26,42,74,0.65)';
        ctx.font = '12px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (var i = 0; i < n; i++) {
            var a = angleFor(i);
            var lr2 = r + 22;
            var lx = cx + lr2 * Math.cos(a);
            var ly = cy + lr2 * Math.sin(a);
            ctx.fillText(labels[i], lx, ly);
        }
    }

    /* ---------- Phone radar mini chart ---------- */
    var phoneRadar = document.getElementById('phone-radar');
    if (phoneRadar) {
        drawMiniRadar(phoneRadar);
    }

    function drawMiniRadar(canvas) {
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        var cx = w / 2;
        var cy = h / 2;
        var r = Math.min(w, h) / 2 - 20;

        var labels = ['思考力', '主体性', '協調性', 'ストレス耐性', '成長意欲'];
        var values = [0.82, 0.75, 0.88, 0.7, 0.85];
        var n = labels.length;

        function angleFor(i) {
            return (Math.PI * 2 * i) / n - Math.PI / 2;
        }

        // grid
        ctx.strokeStyle = 'rgba(74,124,255,0.12)';
        ctx.lineWidth = 0.5;
        for (var level = 1; level <= 4; level++) {
            var lr = (r * level) / 4;
            ctx.beginPath();
            for (var i = 0; i <= n; i++) {
                var a = angleFor(i % n);
                var px = cx + lr * Math.cos(a);
                var py = cy + lr * Math.sin(a);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // filled area
        var grd = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
        grd.addColorStop(0, 'rgba(46,196,182,0.25)');
        grd.addColorStop(1, 'rgba(74,124,255,0.2)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        for (var i = 0; i < n; i++) {
            var a = angleFor(i);
            var vr = r * values[i];
            if (i === 0) ctx.moveTo(cx + vr * Math.cos(a), cy + vr * Math.sin(a));
            else ctx.lineTo(cx + vr * Math.cos(a), cy + vr * Math.sin(a));
        }
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(46,196,182,0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
            var idx = i % n;
            var a = angleFor(idx);
            var vr = r * values[idx];
            if (i === 0) ctx.moveTo(cx + vr * Math.cos(a), cy + vr * Math.sin(a));
            else ctx.lineTo(cx + vr * Math.cos(a), cy + vr * Math.sin(a));
        }
        ctx.closePath();
        ctx.stroke();

        // labels
        ctx.fillStyle = 'rgba(26,42,74,0.55)';
        ctx.font = '9px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'center';
        for (var i = 0; i < n; i++) {
            var a = angleFor(i);
            var lx = cx + (r + 16) * Math.cos(a);
            var ly = cy + (r + 16) * Math.sin(a);
            ctx.fillText(labels[i], lx, ly);
        }
    }

    /* ---------- Animated evaluation bars ---------- */
    var evalObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var bars = entry.target.querySelectorAll('.eval-axis-fill');
                bars.forEach(function (bar) {
                    bar.style.width = bar.dataset.width;
                });
            }
        });
    }, { threshold: 0.3 });

    var evalSlide = document.getElementById('slide-evaluation');
    if (evalSlide) {
        evalObserver.observe(evalSlide);
    }

    // Also trigger when active
    var origGoTo = goTo;
    // Re-check eval bars on slide change
    var evalInterval = setInterval(function () {
        if (slides[currentIndex] && slides[currentIndex].id === 'slide-evaluation') {
            var bars = slides[currentIndex].querySelectorAll('.eval-axis-fill');
            bars.forEach(function (bar) {
                bar.style.width = bar.dataset.width;
            });
            clearInterval(evalInterval);
        }
    }, 500);

})();
