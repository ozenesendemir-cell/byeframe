<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ByeFrame v6.3 - Anti-Bleed Recovery</title>
    <style>
        :root {
            --bg-color: #ffffff;
            --text-color: #000000;
            --letter-spacing: 3px;
            --font-weight: 400;
        }

        body {
            background-color: var(--bg-color);
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: sans-serif;
        }

        #reader-area {
            margin-top: 50px;
            padding: 20px;
            width: 80%;
            /* Filtre Uygulama Noktası */
            filter: url(#antiBleedDeconv);
            letter-spacing: var(--letter-spacing);
            font-weight: var(--font-weight);
            font-size: 24px;
            line-height: 1.6;
        }

        .controls {
            position: fixed;
            bottom: 0;
            background: #f0f0f0;
            width: 100%;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            border-top: 1px solid #ccc;
        }
    </style>
</head>
<body>

    <div id="reader-area">
        ByeFrame v6.3 Deneme Metni: Gözlüğe ihtiyaç duymadan net okuma hedefi. 
        Bu metin, feConvolveMatrix kullanılarak de-convolution işlemine tabi tutulmaktadır. 
        Işık dağılmasını engellemek için harf aralıkları optimize edilmiştir.
    </div>

    <svg style="height: 0; width: 0; position: absolute;">
        <filter id="antiBleedDeconv">
            <feConvolveMatrix 
                id="matrixFilter"
                order="3" 
                preserveAlpha="true" 
                kernelMatrix="0 -2 0 -2 180 -2 0 -2 0" />
        </filter>
    </svg>

    <div class="controls">
        <label>
            De-conv Gücü (Merkez): <span id="val-deconv">180</span>
            <input type="range" id="input-deconv" min="50" max="400" value="180">
        </label>
        <label>
            Harf Aralığı (px): <span id="val-spacing">3</span>
            <input type="range" id="input-spacing" min="0" max="10" value="3">
        </label>
    </div>

    <script>
        const matrixFilter = document.getElementById('matrixFilter');
        const readerArea = document.getElementById('reader-area');
        
        const deconvInput = document.getElementById('input-deconv');
        const spacingInput = document.getElementById('input-spacing');

        function updateFilters() {
            const dc = deconvInput.value;
            const sp = spacingInput.value;

            // Matrisi güncelle: Köşeler sabit negatif, merkez dinamik
            // "Anti-Bleed" için kenar değerlerini -2 tutuyoruz (Işık emici)
            matrixFilter.setAttribute('kernelMatrix', `0 -2 0 -2 ${dc} -2 0 -2 0`);
            
            // CSS değişkenlerini güncelle
            document.documentElement.style.setProperty('--letter-spacing', sp + 'px');
            
            // Görsel geri bildirim
            document.getElementById('val-deconv').innerText = dc;
            document.getElementById('val-spacing').innerText = sp;
        }

        deconvInput.addEventListener('input', updateFilters);
        spacingInput.addEventListener('input', updateFilters);
    </script>
</body>
</html>
