<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ByeFrame v6.7 - Direct Link</title>
    <style>
        body { margin: 0; background: #000; color: #fff; font-family: sans-serif; text-align: center; }
        
        /* Görüntüleme Alanı */
        #stage {
            height: 50vh;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: url(#deconv); /* Filtre buraya bağlı */
        }

        #target {
            font-size: 100px;
            font-weight: bold;
            transition: none; /* Gecikmeyi önle */
        }

        .controls {
            height: 50vh;
            background: #111;
            padding: 20px;
            box-sizing: border-box;
            border-top: 2px solid #333;
        }

        .row { margin-bottom: 30px; }
        input { width: 100%; height: 40px; }
        label { display: block; margin-bottom: 10px; color: #007bff; font-weight: bold; }
    </style>
</head>
<body>

    <div id="stage">
        <div id="target">8</div>
    </div>

    <svg style="position: absolute; height: 0;">
        <filter id="deconv">
            <feConvolveMatrix id="matrix" order="3" preserveAlpha="true" kernelMatrix="0 0 0 0 1 0 0 0 0" />
        </filter>
    </svg>

    <div class="controls">
        <div class="row">
            <label>BÜYÜTME: <span id="v-zoom">100</span>%</label>
            <input type="range" id="i-zoom" min="50" max="500" value="100">
        </div>
        <div class="row">
            <label>KESKİNLİK (Kayaç): <span id="v-sharp">0</span></label>
            <input type="range" id="i-sharp" min="0" max="100" value="0">
        </div>
    </div>

    <script>
        // Elementleri doğrudan seçiyoruz
        const target = document.getElementById('target');
        const matrix = document.getElementById('matrix');
        
        const iZoom = document.getElementById('i-zoom');
        const iSharp = document.getElementById('i-sharp');

        const vZoom = document.getElementById('v-zoom');
        const vSharp = document.getElementById('v-sharp');

        function updateEngine() {
            // Değerleri oku
            const z = iZoom.value;
            const s = iSharp.value;

            // 1. Zoom Uygula (Doğrudan Style)
            target.style.fontSize = z + "px";
            vZoom.innerText = z;

            // 2. Keskinlik Uygula (Doğrudan SVG Attribute)
            // S değeri arttıkça kenarlar keskinleşir (-1, -2 vb.)
            const edge = -(s / 10).toFixed(2);
            const center = (1 - (edge * 4)).toFixed(2); // Toplamı 1 yaparak parlaklığı koru
            
            const kMatrix = `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`;
            matrix.setAttribute('kernelMatrix', kMatrix);
            
            vSharp.innerText = s;

            // Debug: Konsola yaz (PC'de F12 ile görebilirsin)
            console.log("Güncellendi:", kMatrix);
        }

        // Input olaylarını bağla
        iZoom.oninput = updateEngine;
        iSharp.oninput = updateEngine;

        // Sayfa açıldığında bir kez çalıştır
        updateEngine();
    </script>
</body>
</html>
