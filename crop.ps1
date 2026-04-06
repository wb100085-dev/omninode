Add-Type -AssemblyName System.Drawing
$dir = Get-Item "c:\Users\천왕봉\Desktop\homepage\이미지"
$file = Get-ChildItem -Path $dir.FullName -Filter "Gemini*.png" | Select-Object -First 1
$img = [System.Drawing.Image]::FromFile($file.FullName)
$w = [Math]::Floor($img.Width / 2)
$h = [Math]::Floor($img.Height / 2)

for($r = 0; $r -lt 2; $r++) {
    for($c = 0; $c -lt 2; $c++) {
        $x = $c * $w
        $y = $r * $h
        $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
        $bmp = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        
        $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        
        $idx = $r * 2 + $c + 1
        $out = Join-Path -Path $dir.FullName -ChildPath "biz_$idx.png"
        $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Output "Saved $out"
    }
}
$img.Dispose()
