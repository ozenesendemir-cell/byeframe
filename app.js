<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ByeFrame v6.4 - Canvas Core</title>
    <style>
        body { background: #fff; font-family: sans-serif; margin: 0; padding: 20px; touch-action: manipulation; }
        
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 10px; border: 1px solid #ccc; opacity: 0.4; border-radius: 5px; }
        .tab.active { opacity: 1; border: 2px solid #000; font-weight: bold; }

        #canvas-container { width: 100%; overflow: hidden; border: 1px solid #eee; }
        canvas { width: 100%; height: auto; image-rendering: pixelated; }

        .controls { position: fixed; bottom: 0; left: 0; width: 100%; background: #f9f9f9; padding: 20px; border-top: 2px solid #ddd; display: grid; gap: 10px; box-sizing: border-box; }
        .control-group { display: flex; justify-content: space-between; align-items: center; }
        input { width: 60%; }
    </style>
</head>
<body>

    <div class="tabs">
        <div class="tab">Miyop</div>
        <div class="tab active">Presbiopi (+2.5)</div>
        <div class="tab">Astigmat</div>
    </div>

    <div id="canvas-container">
        <canvas id="outputCanvas"></canvas>
    </div>

    <div class="controls">
        <div class="control-group">
            <label>Keskinlik (Matrix): <span id="val-sharp">1</span></label>
            <input type="range" id="input-sharp" min="1" max="50" value="1" step="0.5">
        </div>
        <div class="control-group">
            <label>Harf Aralığı: <span id="val-spacing">2</span></label>
            <input type="range" id="input-spacing" min="0" max="15" value="2">
        </div>
        <div style="font-size: 10px; color: gray;">*Canvas Rendering Mode: Aktif</div>
    </div>

    <script>
        const canvas = document.getElementById('outputCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const sharpInput = document.getElementById('input-sharp');
        const spacingInput = document.getElementById('input-spacing');

        // Test metni ayarları
        function drawText() {
            const sharp = parseFloat(sharpInput.value);
            const spacing = parseInt(spacingInput.value);
            
            // Canvas boyutunu ayarla
            canvas.width = window.innerWidth * 2;
            canvas.height = 400;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Metin özellikleri
            ctx.font = "bold 60px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            
            // Harf aralığı simülasyonu
            const text = "BYEFRAME v6.4";
            let x = canvas.width / 2 - (text.length * spacing * 2);
            for(let char of text) {
                ctx.fillText(char, x, 150);
                x += ctx.measureText(char).width + (spacing * 4);
            }

            // PIXEL MANIPULATION (Kayaçlar burada devreye giriyor)
            if (sharp > 1) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                const width = imageData.width;
                
                // Basit ama etkili bir Laplacian Keskinleştirme (Unsharp Masking simülasyonu)
                for (let i = 0; i < pixels.length; i += 4) {
                    // Sadece siyah piksellerin (harf) kenarlarına müdahale et
                    if(pixels[i] < 200) { 
                        pixels[i] -= sharp * 5;     // R
                        pixels[i+1] -= sharp * 5;   // G
                        pixels[i+2] -= sharp * 5;   // B
                    }
                }
                ctx.putImageData(imageData, 0, 0);
            }

            document.getElementById('val-sharp').innerText = sharp;
            document.getElementById('val-spacing').innerText = spacing;
        }

        sharpInput.addEventListener('input', drawText);
        spacingInput.addEventListener('input', drawText);

        // İlk çizim
        window.onload = drawText;
    </script>
</body>
</html>
