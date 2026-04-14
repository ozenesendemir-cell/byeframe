<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ByeFrame v6.6 - Engine Rebuild</title>
    <style>
        :root {
            --zoom: 1;
            --spacing: 0px;
            --stroke: 0px;
        }

        body {
            margin: 0;
            background: #000; /* Ekran görüntündeki gibi koyu tema */
            color: #fff;
            font-family: sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        /* Görüntüleme Alanı */
        #display-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            /* Filtre Uygulama */
            filter: url(#deconvFilter);
        }

        #odak-hedefi {
            font-size: calc(80px * var(--zoom));
            font-weight: bold;
            margin: 0;
            letter-spacing: var(--spacing);
            -webkit-text-stroke: var(--stroke) #fff;
        }

        .info-box {
            background: #1a1a1a;
            padding: 15px;
            border-radius: 15px;
            text-align: center;
            font-size: 14px;
            max-width: 80%;
            margin-top: 20px;
        }

        /* Kontrol Paneli */
        .controls {
            background: #0a0a0a;
            padding: 20px;
            border-top: 1px solid #333;
        }

        .control-group {
            margin-bottom: 20px;
        }

        .label-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            color: #aaa;
        }

        input[type=range] {
            width: 100%;
            height: 6px;
            background: #333;
            border-radius: 5px;
            accent-color: #007bff;
        }
    </style>
</head>
<body>

    <div id="display-area">
        <h1 id="odak-hedefi">8</h1>
        <div class="info-box">
            Recovery Modu (v6.6). Keskinliği ve büyütmeyi test etmek için aşağıdaki sliderları kullanın.
        </div>
    </div>

    <svg style="position: absolute; width: 0; height: 0;">
        <filter id="deconvFilter" color-interpolation-filters="sRGB">
            <feConvolveMatrix 
                id="convMatrix"
                order="3" 
                preserveAlpha="true" 
                divisor="1"
                kernelMatrix="0 0 0 0 1 0 0 0 0" />
        </filter>
    </svg>

    <div class="controls">
        <div class="control-group">
            <div class="label-row">
                <span>TERS KESKİNLİK (De-conv)</span>
                <span id="val-deconv">0</span>
            </div>
            <input type="range" id="input-deconv" min="0" max="300" value="0">
        </div>

        <div class="control-group">
            <div class="label-row">
                <span>BÜYÜTME (Zoom)</span>
                <span id="val-zoom">100</span>
            </div>
            <input type="range" id="input-zoom" min="50" max="300" value="100">
        </div>

        <div class="control-group">
            <div class="label-row">
                <span>KENAR HATTI (px)</span>
                <span id="val-stroke">0</span>
            </div>
            <input type="range" id="input-stroke" min="0" max="5" step="0.1" value="0">
        </div>
    </div>

    <script>
        const matrix = document.getElementById('convMatrix');
        const root = document.documentElement;

        function update() {
            const deconv = parseFloat(document.getElementById('input-deconv').value);
            const zoom = parseFloat(document.getElementById('input-zoom').value);
            const stroke = parseFloat(document.getElementById('input-stroke').value);

            // 1. Matris Güncelleme (De-convolution etkisi)
            // Merkez artarken kenarlar negatife düşerek "ışık emilimi" sağlar
            const edge = (deconv > 0) ? -Math.sqrt(deconv) : 0;
            const center = 1 + (Math.abs(edge) * 4); // Parlaklığı korumak için denge
            
            // kernelMatrix yapısı: 0 edge 0 / edge center edge / 0 edge 0
            const k = `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`;
            matrix.setAttribute('kernelMatrix', k);

            // 2. CSS Değişkenlerini Güncelleme
            root.style.setProperty('--zoom', zoom / 100);
            root.style.setProperty('--stroke', stroke + 'px');
            root.style.setProperty('--spacing', (zoom / 50) + 'px'); // Otomatik harf açma

            // 3. UI Rakamlarını Güncelleme
            document.getElementById('val-deconv').innerText = deconv;
            document.getElementById('val-zoom').innerText = zoom + "%";
            document.getElementById('val-stroke').innerText = stroke;
        }

        // Event Listeners
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', update);
        });

        // Başlangıç tetiklemesi
        update();
    </script>
</body>
</html>
