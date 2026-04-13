(function() {
    const pSelect = document.getElementById('profileSelect');
    const pBtn = document.getElementById('panicResetBtn');
    const canvas = document.getElementById('opticalCanvas');
    const sliders = ['scale', 'fontWeight', 'contrast', 'sharp', 'chroma', 'bright'];

    let profiles = JSON.parse(localStorage.getItem('byeframe_v2_profiles')) || {
        Deniz: { scale: 130, fontWeight: 600, contrast: 120, sharpness: 50, chromaticOffset: 0, brightness: 100 },
        Ceren: { scale: 100, fontWeight: 400, contrast: 100, sharpness: 0, chromaticOffset: 0, brightness: 100 }
    };
    let active = localStorage.getItem('byeframe_v2_active') || 'Deniz';

    function apply() {
        const p = profiles[active];
        
        // 1. Filtreleri oluştur (Keskinlik için SVG kullanmadan CSS simülasyonu yapalım, daha hızlı)
        let f = `contrast(${p.contrast}%) brightness(${p.brightness}%) saturate(120%)`;
        if (p.sharpness > 0) f += ` contrast(${100 + p.sharpness / 2}%) brightness(${100 + p.sharpness / 5}%)`;
        
        canvas.style.filter = f;
        
        // 2. Büyütme ve Kalınlık
        canvas.style.transform = `scale(${p.scale / 100})`;
        canvas.style.setProperty('--gw', p.fontWeight);
        canvas.querySelectorAll('*').forEach(el => el.style.fontWeight = p.fontWeight);

        // 3. Değerleri güncelle
        sliders.forEach(s => {
            const val = p[s === 'sharp' ? 'sharpness' : s === 'chroma' ? 'chromaticOffset' : s];
            document.getElementById(s + 'Val').innerText = val;
            document.getElementById(s + 'Slider').value = val;
        });

        localStorage.setItem('byeframe_v2_profiles', JSON.stringify(profiles));
    }

    // Profil yönetimi
    Object.keys(profiles).forEach(n => {
        const o = document.createElement('option');
        o.value = o.innerText = n;
        if(n === active) o.selected = true;
        pSelect.appendChild(o);
    });

    pSelect.onchange = (e) => { active = e.target.value; localStorage.setItem('byeframe_v2_active', active); apply(); };
    pBtn.onclick = () => { profiles[active] = { scale: 100, fontWeight: 400, contrast: 100, sharpness: 0, chromaticOffset: 0, brightness: 100 }; apply(); };

    sliders.forEach(s => {
        document.getElementById(s + 'Slider').oninput = (e) => {
            const v = parseFloat(e.target.value);
            const t = e.target.id.replace('Slider', '');
            if(t === 'scale') profiles[active].scale = v;
            if(t === 'fontWeight') profiles[active].fontWeight = v;
            if(t === 'contrast') profiles[active].contrast = v;
            if(t === 'sharp') profiles[active].sharpness = v;
            if(t === 'chroma') profiles[active].chromaticOffset = v;
            if(t === 'bright') profiles[active].brightness = v;
            apply();
        };
    });

    apply();
})();
