(function() {
    const canvas = document.getElementById('testCharacter');
    const sample = document.getElementById('sampleText');
    const sliders = ['scale', 'fontWeight', 'contrast', 'sharp', 'chroma', 'bright'];

    let profiles = JSON.parse(localStorage.getItem('byeframe_v3')) || {
        Deniz: { scale: 150, fontWeight: 600, contrast: 130, sharpness: 80, chromaticOffset: 0, brightness: 100 },
        Ceren: { scale: 100, fontWeight: 400, contrast: 100, sharpness: 0, chromaticOffset: 0, brightness: 100 }
    };
    let active = localStorage.getItem('bf_active') || 'Deniz';

    function apply() {
        const p = profiles[active];
        
        // Optik Filtreler
        let f = `contrast(${p.contrast}%) brightness(${p.brightness}%)`;
        if (p.sharpness > 0) f += ` contrast(${100 + p.sharpness/2}%) saturate(110%)`;
        
        // Karakter ve Metin Dönüşümü (Taşmayı önlemek için ayrı ayrı)
        canvas.style.filter = f;
        canvas.style.transform = `scale(${p.scale / 100})`;
        canvas.style.fontWeight = p.fontWeight;
        
        sample.style.filter = f;
        sample.style.fontWeight = p.fontWeight;

        // UI Güncelleme
        sliders.forEach(s => {
            const val = p[s === 'sharp' ? 'sharpness' : s === 'chroma' ? 'chromaticOffset' : s];
            document.getElementById(s + 'Val').innerText = val;
            if(document.getElementById(s + 'ValLive')) document.getElementById(s + 'ValLive').innerText = val;
            document.getElementById(s + 'Slider').value = val;
        });

        localStorage.setItem('byeframe_v3', JSON.stringify(profiles));
    }

    // Profil Kurulumu
    const select = document.getElementById('profileSelect');
    Object.keys(profiles).forEach(n => {
        const o = document.createElement('option');
        o.value = n; o.innerText = n;
        if(n === active) o.selected = true;
        select.appendChild(o);
    });

    select.onchange = (e) => { active = e.target.value; localStorage.setItem('bf_active', active); apply(); };
    document.getElementById('panicResetBtn').onclick = () => { profiles[active] = { scale: 100, fontWeight: 400, contrast: 100, sharpness: 0, chromaticOffset: 0, brightness: 100 }; apply(); };

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
