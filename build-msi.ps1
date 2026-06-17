$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeDir = Join-Path $root "tools\node-v20.11.1-win-x64"
$wixDir = Join-Path $root "tools\wix311"
$node = Join-Path $nodeDir "node.exe"
$npm = Join-Path $nodeDir "node_modules\npm\bin\npm-cli.js"

if (!(Test-Path $node)) {
  throw ("Portable Node was not found: " + $node)
}

if (!(Test-Path $npm)) {
  throw ("npm was not found: " + $npm)
}

if (!(Test-Path (Join-Path $wixDir "candle.exe")) -or !(Test-Path (Join-Path $wixDir "light.exe"))) {
  throw "WiX tools were not found. Please check tools\wix311."
}

$env:Path = $nodeDir + ";" + $wixDir + ";" + $env:Path
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"

Push-Location $root
try {
  if (!(Test-Path (Join-Path $root "node_modules"))) {
    & $node $npm install
  }

  & $node $npm run pack
  & $node $npm run msi
}
finally {
  Pop-Location
}
