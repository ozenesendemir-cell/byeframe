(function() {
    const profileSelect = document.getElementById('profileSelect');
    const panicBtn = document.getElementById('panicResetBtn');
    const sliders = ['contrast', 'sharp', 'chroma', 'bright'];
    const opticalCanvas = document.getElementById('opticalCanvas');
    
    let profiles = JSON.parse(localStorage.getItem('byeframe_profiles')) || {
        Deniz: { contrast: 100, sharpness: 0, chromaticOffset: 0, brightness: 100 },
        Ceren: { contrast: 145, sharpness: -2, chromaticOffset: 2, brightness: 110 }
    };
    let currentProfile = localStorage.getItem('active_profile') || 'Deniz';

    function applyFilters() {
        const p = profiles[currentProfile];
        let filter = `contrast(${p.contrast}%) brightness(${p.brightness}%)`;
        
        if (p.sharpness > 0) filter += ` blur(${p.sharpness}px)`;
        else if (p.sharpness < 0) filter += ` contrast(150%) brightness(110%)`; // Basit keskinleştirme simülasyonu
        
        opticalCanvas.style.filter = filter;
        localStorage.setItem('byeframe_profiles', JSON.stringify(profiles));
    }

    function updateUI() {
        const p = profiles[currentProfile];
        document.getElementById('contrastSlider').value = p.contrast;
        document.getElementById('sharpSlider').value = p.sharpness;
        document.getElementById('chromaSlider').value = p.chromaticOffset;
        document.getElementById('brightSlider').value = p.brightness;
        
        ['contrast', 'sharp', 'chroma', 'bright'].forEach(s => {
            document.getElementById(s + 'Val').innerText = p[s === 'sharp' ? 'sharpness' : s === 'chroma' ? 'chromaticOffset' : s];
        });
    }

    // Profil listesini doldur
    Object.keys(profiles).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerText = name;
        if (name === currentProfile) opt.selected = true;
        profileSelect.appendChild(opt);
    });

    profileSelect.onchange = (e) => {
        currentProfile = e.target.value;
        localStorage.setItem('active_profile', currentProfile);
        updateUI();
        applyFilters();
    };

    panicBtn.onclick = () => {
        profiles[currentProfile] = { contrast: 100, sharpness: 0, chromaticOffset: 0, brightness: 100 };
        updateUI();
        applyFilters();
    };

    document.querySelectorAll('input[type=range]').forEach(slider => {
        slider.oninput = (e) => {
            const val = parseFloat(e.target.value);
            const type = e.target.id.replace('Slider', '');
            if (type === 'contrast') profiles[currentProfile].contrast = val;
            if (type === 'sharp') profiles[currentProfile].sharpness = val;
            if (type === 'chroma') profiles[currentProfile].chromaticOffset = val;
            if (type === 'bright') profiles[currentProfile].brightness = val;
            
            updateUI();
            applyFilters();
        };
    });

    updateUI();
    applyFilters();
})();
