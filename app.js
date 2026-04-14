<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ByeFrame v6.3.1 - Stabilizer</title>
    <style>
        :root {
            --bg-color: #ffffff;
            --text-color: #000000;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding-bottom: 200px; /* Kontroller için yer */
        }

        #reader-area {
            margin-top: 50px;
            padding: 40px;
            width: 85%;
            font-size: 28px; /* Presbiyopi için başlangıç boyutu */
            line-height: 1.8;
            /* Filtre burada aktif */
            filter: url(#refinedDeconv);
            transition: letter-spacing 0.2s;
        }

        .controls {
            position: fixed;
            bottom: 0;
            background: #e9e9e9;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
            box-shadow: 0 -5px 15px rgba(0,0,0,0.1);
        }

        .control-group {
            display: flex;
            flex-direction: column;
        }

        input[type=range] { width: 100%; margin: 10px 0; }
    </style>
</head>
<body>

    <div id="reader-area">
        ByeFrame Operasyonu: v6.3.1 Stabilize Modu. <br>
        Eğer "kayaçlar" çalışmıyorsa, Divisor parametresi matrisin enerjisini dengelemiyor demektir. 
        Şimdi bu metindeki harflerin kenarlarındaki ışık halelerini (halo) yok etmeye odaklanıyoruz. 
        Toprak Razgatlıoğlu'nun virajdaki keskinliği gibi harfleri keskinleştirmeliyiz.
    </div>

    <svg style="position: absolute; width: 0; height: 0;">
        <filter id="refinedDeconv">
            <feConvolveMatrix 
                id="mainMatrix"
                order="3" 
                preserveAlpha="true" 
                divisor="1"
                kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" />
        </filter>
    </svg>

    <div class="controls">
        <div class="control-group">
            <label>De-conv (Merkez Gücü): <span id="val-center">5</span></label>
            <input type="range" id="input-center" min="1" max="250" value="5">
        </div>
        <div class="control-group">
            <label>Kenar Traşlama (Negatif): <span id="val-edge">-1</span></label>
            <input type="range" id="input-edge" min="-50" max="0" value="-1">
        </div>
        <div class="control-group">
            <label>Harf Arası (px): <span id="val-spacing">2</span></label>
            <input type="range" id="input-spacing" min="0" max="20" value="2">
        </div>
    </div>

    <script>
        const matrix = document.getElementById('mainMatrix');
        const reader = document.getElementById('reader-area');

        function updateEngine() {
            const center = parseFloat(document.getElementById('input-center').value);
            const edge = parseFloat(document.getElementById('input-edge').value);
            const spacing = document.getElementById('input-spacing').value;

            // Matris Toplamı Hesaplama (Divisor)
            // 3x3 matrisimizde 4 kenar aktif (0 -1 0, -1 5 -1, 0 -1 0 yapısı)
            // Toplam = center + (4 * edge)
            const sum = center + (4 * edge);
            const divisor = sum <= 0 ? 1 : sum; // 0'a bölme hatasını engelle

            // Matris Dizilimi
            const k = `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`;
            
            matrix.setAttribute('kernelMatrix', k);
            matrix.setAttribute('divisor', divisor);
            
            reader.style.letterSpacing = spacing + 'px';

            // UI Güncelleme
            document.getElementById('val-center').innerText = center;
            document.getElementById('val-edge').innerText = edge;
            document.getElementById('val-spacing').innerText = spacing;
        }

        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', updateEngine);
        });

        // İlk açılışta çalıştır
        updateEngine();
    </script>
</body>
</html>
