(function() {
    const char = document.getElementById('testCharacter');
    const sample = document.getElementById('sampleText');
    const canvas = document.getElementById('distortionCanvas');

    const STORAGE_KEY = 'byeframe_v6_3_recovery';
    const defaultProfiles = {
        presbyopia: { deconv: 100, scale: 160, textStroke: 0.5, contrast: 150 },
        myopia: { deconv: 50, scale: 120, textStroke: 0.2, contrast: 130 },
        astigmatism: { deconv: 80, scale: 140, textStroke: 0.5, contrast: 140 }
    };

    let profiles = JSON.parse(localStorage.getItem(STORAGE_KEY)) || JSON.parse(JSON.stringify(defaultProfiles));
    let currentCondition = 'presbyopia';

    function buildFilters() {
        const p = profiles[currentCondition];
        const old = document.getElementById('svg-engine');
        if (old) old.remove();

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "svg-engine";
        svg.setAttribute("style", "position:absolute;width:0;height:0");
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

        // Gelişmiş ama Dengeli De-convolution Matrisi
        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter.id = "inverseDeconv";
        const matrix = document.createElementNS("http://www.w3.org/2000/svg", "feConvolveMatrix");
        
        // v6.1'deki o tatlı noktayı yakalayan katsayılar
        const x = p.deconv / 100;
        const center = 1 + (4 * x); 
        const edge = -x;
        
        matrix.setAttribute("order", "3");
        matrix.setAttribute("kernelMatrix", `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`);
        matrix.setAttribute("preserveAlpha", "true");
        filter.appendChild(matrix);
        defs.appendChild(filter);

        svg.appendChild(defs);
        document.body.appendChild(svg);
    }

    function apply() {
        const p = profiles[currentCondition];
        
        // Görüntü filtreleri
        char.style.filter = `contrast(${p.contrast}%) brightness(110%) url(#inverseDeconv)`;
        char.style.transform = `scale(${p.scale / 100})`;
        
        // Kenar hattı ve netlik dengesi
        char.style.webkitTextStroke = p.textStroke > 0 ? `${p.textStroke}px rgba(255,255,255,0.9)` : '0px transparent';
        
        // De-conv arttıkça harfleri birbirinden hafifçe uzaklaştır (Harflerin birleşmesini önler)
        char.style.letterSpacing = (p.deconv / 30) + "px";

        updateUI(p);
        drawMap(p);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }

    function updateUI(p) {
        ['deconv', 'scale', 'textStroke', 'contrast'].forEach(id => {
            const elVal = document.getElementById(id + 'Val');
            const elSlider = document.getElementById(id + 'Slider');
            if(elVal) elVal.innerText = p[id];
            if(elSlider) elSlider.value = p[id];
        });
    }

    function drawMap(p) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 100, 100);
        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(50, 50, 30 + (p.deconv/20), 0, Math.PI * 2);
        ctx.stroke();
    }

    ['deconv', 'scale', 'textStroke', 'contrast'].forEach(id => {
        document.getElementById(id + 'Slider').oninput = (e) => {
            profiles[currentCondition][id] = parseFloat(e.target.value);
            buildFilters();
            apply();
        };
    });

    document.querySelectorAll('.condition-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.condition-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCondition = btn.dataset.condition;
            buildFilters();
            apply();
        };
    });

    buildFilters();
    apply();
})();
