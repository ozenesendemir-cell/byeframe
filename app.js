(function() {
    const char = document.getElementById('testCharacter');
    const sample = document.getElementById('sampleText');
    const shimmerBtn = document.getElementById('shimmerToggleBtn');
    
    let isShimmerActive = false;
    let profiles = JSON.parse(localStorage.getItem('bf_v5')) || {
        Deniz: { shimmerFreq: 24, scale: 160, fontWeight: 600, letterSpacing: 5, textStroke: 0.8, colorMode: 'default' }
    };
    let active = localStorage.getItem('bf_active') || 'Deniz';

    function apply() {
        const p = profiles[active];
        
        // Anti-Bleed & Optical
        char.style.fontWeight = p.fontWeight;
        char.style.letterSpacing = p.letterSpacing + 'px';
        char.style.webkitTextStroke = p.textStroke > 0 ? `${p.textStroke}px currentColor` : '0px';
        char.style.filter = `contrast(${p.contrast || 100}%) brightness(${p.brightness || 100}%)`;

        document.body.className = p.colorMode !== 'default' ? 'color-mode-' + p.colorMode : '';
        
        // UI Sync
        document.getElementById('shimmerFreqVal').innerText = p.shimmerFreq;
        document.getElementById('shimmerFreqLive').innerText = p.shimmerFreq;
        document.getElementById('shimmerFreqSlider').value = p.shimmerFreq;
        
        shimmerBtn.innerText = isShimmerActive ? '⏹ DURDUR' : '✨ TİTREŞİMİ AÇ';
        shimmerBtn.style.background = isShimmerActive ? '#dc2626' : '#3b82f6';
        
        localStorage.setItem('bf_v5', JSON.stringify(profiles));
    }

    // --- ŞİMMER MOTORU ---
    function doShimmer() {
        if (!isShimmerActive) {
            char.style.transform = `scale(${profiles[active].scale / 100})`;
            sample.style.transform = `scale(1)`;
            return;
        }
        
        const freq = profiles[active].shimmerFreq;
        if (freq > 0) {
            const jitter = 0.8; // Titreme şiddeti (pixel)
            const x = (Math.random() - 0.5) * jitter;
            const y = (Math.random() - 0.5) * jitter;
            const scale = profiles[active].scale / 100;
            
            char.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            sample.style.transform = `translate(${x/2}px, ${y/2}px)`;
        }
        
        setTimeout(() => requestAnimationFrame(doShimmer), 1000 / profiles[active].shimmerFreq);
    }

    shimmerBtn.onclick = () => { isShimmerActive = !isShimmerActive; doShimmer(); apply(); };

    // Sürgülerin kontrolü ve diğer rutin kodlar...
    document.querySelectorAll('input[type=range]').forEach(s => {
        s.oninput = (e) => {
            const t = e.target.id.replace('Slider', '');
            profiles[active][t] = parseFloat(e.target.value);
            apply();
        };
    });

    apply();
})();
