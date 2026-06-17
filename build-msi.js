const { MSICreator } = require("electron-wix-msi");
const path = require("path");

const appName = "FrantaManifoldQuote";

async function build() {
  const msiCreator = new MSICreator({
    appDirectory: path.resolve(__dirname, "release", `${appName}-win32-x64`),
    outputDirectory: path.resolve(__dirname, "release", "msi"),
    description: "Franta Manifold Quote System",
    exe: appName,
    name: "Franta Manifold Quote",
    manufacturer: "FRANTA",
    version: "1.0.0",
    arch: "x64",
    shortName: appName,
    shortcutName: "Franta Manifold Quote",
    programFilesFolderName: "Franta Manifold Quote",
    shortcutFolderName: "FRANTA"
  });

  await msiCreator.create();
  await msiCreator.compile();
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});
