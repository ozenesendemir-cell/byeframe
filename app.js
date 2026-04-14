<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ByeFrame v6.5 - Bypass Mode</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: #fff; 
            font-family: sans-serif; 
            overflow: hidden; /* Sayfa kaymasını engelle */
        }

        .header {
            padding: 10px;
            display: flex;
            justify-content: space-around;
            background: #eee;
            font-size: 12px;
        }

        .active-tab { border-bottom: 2px solid red; font-weight: bold; }

        #stage {
            height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-bottom: 1px solid #ddd;
        }

        /* KRİTİK ALAN: Okuma Metni */
        #text-target {
            font-size: 20px;
            text-align: center;
            transition: transform 0.1s ease-out;
            transform-origin: center;
            will-change: transform, letter-spacing, filter;
            line-height: 1.4;
            padding: 20px;
        }

        .controls {
            height: 35vh;
            padding: 20px;
            background: #fdfdfd;
            box-sizing: border-box;
        }

        .control-row {
            margin-bottom: 25px;
        }

        label { display: block; font-size: 14px; margin-bottom: 5px; color: #555; }

        input[type=range] {
            width: 100%;
            height: 30px; /* Mobilde daha kolay dokunmak için */
        }
    </style>
</head>
<body>

    <div class="header">
        <span>Miyop</span>
        <span class="active-tab">Presbiopi (+2.5)</span>
        <span>Astigmat</span>
    </div>

    <div id="stage">
        <div id="text-target">
            BYEFRAME OPERASYONU<br>
            v6.5 Reset Modu<br>
            <small>Bu metnin büyümesi ve keskinleşmesi lazım.</small>
        </div>
    </div>

    <div class="controls">
        <div class="control-row">
            <label>Büyütme (Scale): <span id="val-scale">1.0</span></label>
            <input type="range" id="input-scale" min="0.5" max="5" step="0.1" value="1">
        </div>

        <div class="control-row">
            <label>Anti-Bleed (Keskinlik): <span id="val-sharp">0</span></label>
            <input type="range" id="input-sharp" min="0" max="10" step="0.5" value="0">
        </div>
        
        <div class="control-row">
            <label>Harf Aralığı: <span id="val-spacing">0</span>px</label>
            <input type="range" id="input-spacing" min="0" max="20" step="1" value="0">
        </div>
    </div>

    <script>
        const target = document.getElementById('text-target');
        
        function update() {
            const sc = document.getElementById('input-scale').value;
            const sh = document.getElementById('input-sharp').value;
            const sp = document.getElementById('input-spacing').value;

            // 1. Büyütme/Küçültme (CSS Transform - En hızlı yöntem)
            target.style.transform = `scale(${sc})`;

            // 2. Harf Aralığı (Bleeding engelleme)
            target.style.letterSpacing = `${sp}px`;

            // 3. Keskinleştirme (CSS Filter Contrast - Kayaçların basit hali)
            // Kontrastı artırıp parlaklığı hafif kısarak harf kenarlarını topluyoruz
            target.style.filter = `contrast(${100 + (sh * 20)}%) brightness(${100 - (sh * 2)}%)`;

            // Değerleri yazdır
            document.getElementById('val-scale').innerText = sc;
            document.getElementById('val-sharp').innerText = sh;
            document.getElementById('val-spacing').innerText = sp;
        }

        // Tüm inputlara dinleyici ekle
        document.querySelectorAll('input').forEach(el => {
            el.addEventListener('input', update);
        });

        // Sayfa yüklendiğinde çalıştır
        update();
    </script>
</body>
</html>
