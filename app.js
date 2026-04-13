(function() {
    const char = document.getElementById('testCharacter');
    const sample = document.getElementById('sampleText');
    const sliders = ['scale', 'fontWeight', 'letterSpacing', 'textStroke'];

    let profiles = JSON.parse(localStorage.getItem('bf_v4')) || {
        Deniz: { scale: 160, fontWeight: 600, letterSpacing: 5, textStroke: 0.8, colorMode: 'default' }
    };
    let active = localStorage.getItem('bf_active') || 'Deniz';

    function apply() {
        const p = profiles[active];
        
        // Anti-Bleed Mekanizması
        char.style.transform = `scale(${p.scale / 100})`;
        char.style.fontWeight = p.fontWeight;
        char.style.letterSpacing = p.letterSpacing + 'px';
        char.style.webkitTextStroke = p.textStroke > 0 ? `${p.textStroke}px currentColor` : '0px';

        sample.style.fontWeight = p.fontWeight;
        sample.style.letterSpacing = p.letterSpacing + 'px';

        // Renk Modu Uygulama
        document.body.className = p.colorMode !== 'default' ? 'color-mode-' + p.colorMode : '';

        // UI Güncelleme
        sliders.forEach(s => {
            const val = p[s];
            document.getElementById(s + 'Val').innerText = val;
            if(document.getElementById(s + 'ValLive')) document.getElementById(s + 'ValLive').innerText = val;
            document.getElementById(s + 'Slider').value = val;
        });

        localStorage.setItem('bf_v4', JSON.stringify(profiles));
    }

    // Renk Butonları
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.onclick = (e) => {
            profiles[active].colorMode = e.target.dataset.color;
            apply();
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        };
    });

    // Sürgü Dinleyicileri
    sliders.forEach(s => {
        document.getElementById(s + 'Slider').oninput = (e) => {
            profiles[active][s] = parseFloat(e.target.value);
            apply();
        };
    });

    // Profil Seçimi
    const sel = document.getElementById('profileSelect');
    Object.keys(profiles).forEach(n => {
        const o = document.createElement('option');
        o.value = o.innerText = n;
        if(n === active) o.selected = true;
        sel.appendChild(o);
    });

    apply();
})();
