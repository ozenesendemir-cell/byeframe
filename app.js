<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>ByeFrame v6.8</title>
    <style>
        body { margin: 0; background: black; color: white; font-family: sans-serif; overflow: hidden; }
        #wrap { height: 100vh; display: flex; flex-direction: column; }
        #view { flex: 1; display: flex; align-items: center; justify-content: center; }
        #target { font-size: 50px; font-weight: bold; }
        .box { height: 40%; background: #111; padding: 20px; border-top: 2px solid #444; }
        input { width: 100%; height: 50px; margin-bottom: 20px; }
        label { display: block; color: cyan; margin-bottom: 5px; font-size: 14px; }
    </style>
</head>
<body>

    <div id="wrap">
        <div id="view">
            <div id="target" style="filter: url(#f);">8</div>
        </div>
        
        <div class="box">
            <label>BÜYÜTME (ZOOM)</label>
            <input type="range" min="20" max="400" value="50" oninput="doZoom(this.value)">
            
            <label>KESKİNLİK (KAYAÇ)</label>
            <input type="range" min="0" max="100" value="0" oninput="doSharp(this.value)">
        </div>
    </div>

    <svg style="position: absolute; width: 0; height: 0;">
        <filter id="f">
            <feConvolveMatrix id="m" order="3" preserveAlpha="true" kernelMatrix="0 0 0 0 1 0 0 0 0" />
        </filter>
    </svg>

    <script>
        // Hiç değişken tanımlamadan doğrudan DOM'a müdahale
        function doZoom(v) {
            document.getElementById('target').style.fontSize = v + "px";
        }

        function doSharp(v) {
            var e = -(v / 10); // Kenar (Edge)
            var c = 1 - (e * 4); // Merkez (Center) - Parlaklık dengesi
            var matrix = "0 "+e+" 0 "+e+" "+c+" "+e+" 0 "+e+" 0";
            document.getElementById('m').setAttribute('kernelMatrix', matrix);
        }
    </script>
</body>
</html>
