// ByeFrame v7.0 - JS Kontrol Motoru
const target = document.getElementById('target');
const matrix = document.getElementById('matrix');
const sZoom = document.getElementById('slider-zoom');
const sSharp = document.getElementById('slider-sharp');

const vZoom = document.getElementById('val-zoom');
const vSharp = document.getElementById('val-sharp');

function refresh() {
    // Zoom İşlemi
    const zValue = sZoom.value;
    target.style.fontSize = zValue + "px";
    vZoom.innerText = zValue;

    // Keskinlik (De-convolution) İşlemi
    const sValue = sSharp.value;
    const edge = -(sValue / 10).toFixed(2);
    const center = (1 - (edge * 4)).toFixed(2);
    
    const kMatrix = `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`;
    matrix.setAttribute('kernelMatrix', kMatrix);
    vSharp.innerText = sValue;
    
    console.log("Motor Güncellendi: ", kMatrix);
}

// Olay Dinleyicileri
sZoom.oninput = refresh;
sSharp.oninput = refresh;

// İlk açılışta çalıştır
refresh();
