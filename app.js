(function() {
    const char = document.getElementById('testCharacter');
    const sample = document.getElementById('sampleText');
    const canvas = document.getElementById('distortionCanvas');
    const profileSelect = document.getElementById('profileSelect');

    const STORAGE_KEY = 'byeframe_v6_1_final';
    const defaultProfiles = {
        myopia: { deconv: 80, axis: 0, radial: -60, contrast: 150, textStroke: 0.8, scale: 130 },
        hyperopia: { deconv: 75, axis: 0, radial: 65, contrast: 145, textStroke: 1.0, scale: 140 },
        astigmatism: { deconv: 120, axis: 90, radial: 0, contrast: 180, textStroke: 1.2, scale: 140 },
        presbyopia: { deconv: 160, axis: 0, radial: 10, contrast: 210, textStroke: 1.6, scale: 170 }
    };

    let profiles = JSON.parse(localStorage.getItem(STORAGE_KEY)) || JSON.parse(JSON.stringify(defaultProfiles));
    let currentCondition = localStorage.getItem('bf_condition') || 'presbyopia';

    function buildFilters() {
        const p = profiles[currentCondition];
        const old = document.getElementById('svg-engine');
        if (old) old.remove();

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "svg-engine";
        svg.setAttribute("style", "position:absolute;width:0;height:0");
        
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

        // De-convolution Matrisi
        const filter1 = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter1.id = "inverseDeconv";
        const matrix = document.createElementNS("http://www.w3.org/2000/svg", "feConvolveMatrix");
        const x = p.deconv / 100;
        const center = 1 + (4 * x * 3);
        const edge = -(x * 3);
        matrix.setAttribute("order", "3");
        matrix.setAttribute("kernelMatrix", `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`);
        matrix.setAttribute("preserveAlpha", "true");
        filter1.appendChild(matrix);
        defs.appendChild(filter1);

        // Radyal Displacement
        const filter2 = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter2.id = "radialDist";
        const turb = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
        turb.setAttribute("type", "fractalNoise");
        turb.setAttribute("baseFrequency", "0.01");
        turb.setAttribute("numOctaves", "1");
        turb.setAttribute("result", "noise");
        const disp = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
        disp.setAttribute("in", "SourceGraphic");
        disp.setAttribute("in2", "noise");
        disp.setAttribute("scale", Math.abs(p.radial) / 4);
        filter2.appendChild(turb);
        filter2.appendChild(disp);
        defs.appendChild(filter2);

        svg.appendChild(defs);
        document.body.appendChild(svg);
    }

    function apply() {
        const p = profiles[currentCondition];
        let f = `contrast(${p.contrast}%) url(#inverseDeconv)`;
        if(Math.abs(p.radial) > 10) f += ` url(#radialDist)`;
        
        char.style.filter = f;
        char.style.transform = `scale(${p.scale / 100}) rotate(${p.axis}deg)`;
        char.style.webkitTextStroke = `${p.textStroke}px rgba(255,255,255,0.8)`;
        
        sample.style.filter = f;
        sample.style.webkitTextStroke = `${p.textStroke/2}px rgba(255,255,255,0.8)`;

        updateUI(p);
        drawMap(p);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
        localStorage.setItem('bf_condition', currentCondition);
    }

    function updateUI(p) {
        const fields = ['deconv', 'scale', 'radial', 'textStroke', 'axis', 'contrast'];
        fields.forEach(id => {
            document.getElementById(id + 'Val').innerText = p[id];
            document.getElementById(id + 'Slider').value = p[id];
        });
    }

    function drawMap(p) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 120, 120);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 5) {
            let r = 35 + (p.radial / 10);
            if (currentCondition === 'astigmatism') r += Math.cos((i - p.axis) * Math.PI / 90) * 10;
            const x = 60 + r * Math.cos(i * Math.PI / 180);
            const y = 60 + r * Math.sin(i * Math.PI / 180);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Kontrolleri Bağla
    const sliders = ['deconv', 'scale', 'radial', 'textStroke', 'axis', 'contrast'];
    sliders.forEach(id => {
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
        if(btn.dataset.condition === currentCondition) btn.classList.add('active');
    });

    document.getElementById('panicResetBtn').onclick = () => {
        profiles[currentCondition] = JSON.parse(JSON.stringify(defaultProfiles[currentCondition]));
        buildFilters();
        apply();
    };

    // Başlat
    buildFilters();
    apply();
})();
