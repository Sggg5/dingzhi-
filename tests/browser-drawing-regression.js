const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { startStaticServer } = require("../server");

const updateBaselines = process.argv.includes("--update");
const baselineDir = path.join(__dirname, "visual-baselines");
const artifactDir = path.join(__dirname, "visual-artifacts");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const cases = [
  { name: "manifold", productType: "分水器类", quoteNo: "VIS-MANIFOLD-001" },
  {
    name: "manifold-double-row-219",
    productType: "分水器类",
    quoteNo: "VIS-MANIFOLD-DOUBLE-219",
    setup: `
      setValue('#manifoldType', '双排交错');
      setValue('#mainDiameter', '219');
      setValue('#wallThickness', '3');
      setValue('#branchDiameter', '40');
      setValue('#branchThickness', '1.5');
      setValue('#branchCount', '12');
      setValue('#branchSpacing', '120');
      setValue('#branchHeight', '80');
      setValue('#mainFitting', '法兰');
      setValue('#tailFitting', '法兰');
    `
  },
  {
    name: "manifold-max-20",
    productType: "分水器类",
    quoteNo: "VIS-MANIFOLD-MAX-020",
    setup: `
      setValue('#manifoldType', '单排');
      setValue('#mainDiameter', '40');
      setValue('#wallThickness', '1.5');
      setValue('#branchDiameter', '20');
      setValue('#branchCount', '20');
      setValue('#branchSpacing', '120');
      setValue('#branchHeight', '100');
    `
  },
  { name: "docking", productType: "对接类", quoteNo: "VIS-DOCKING-001" },
  {
    name: "docking-cad-pipe-40",
    productType: "对接类",
    quoteNo: "VIS-DOCKING-CAD-PIPE-040",
    setup: `
      setValue('#productDiameterA', '40');
      setValue('#productThicknessA', '1.5');
      setValue('#productDiameterB', '40');
      setValue('#productThicknessB', '1.5');
      setValue('#productFittingA', '外丝');
      setValue('#productFittingB', '外丝');
      setValue('#productMiddleDiameter', '40');
      setValue('#productMiddleThickness', '1.5');
      setValue('#productMiddleA', '直管');
      setValue('#productMiddleLengthA', '180');
      update();
    `
  },
  {
    name: "docking-cad-flange-40",
    productType: "\u5bf9\u63a5\u7c7b",
    quoteNo: "VIS-DOCKING-CAD-FLANGE-040",
    setup: `
      setValue('#productDiameterA', '40');
      setValue('#productThicknessA', '1.5');
      setValue('#productDiameterB', '40');
      setValue('#productThicknessB', '1.5');
      setValue('#productFittingA', '\u6cd5\u5170');
      setValue('#productFittingB', '\u6cd5\u5170');
      setValue('#productMiddleDiameter', '40');
      setValue('#productMiddleThickness', '1.5');
      setValue('#productMiddleA', '\u76f4\u7ba1');
      setValue('#productMiddleLengthA', '180');
      update();
    `
  },
  {
    name: "docking-cad-socket-weld-40",
    productType: "对接类",
    quoteNo: "VIS-DOCKING-CAD-SOCKET-040",
    setup: `
      setValue('#tubeSeries', 'A');
      setValue('#productDiameterA', '40');
      setValue('#productThicknessA', '1.5');
      setValue('#productDiameterB', '40');
      setValue('#productThicknessB', '1.5');
      setValue('#productFittingA', '插焊');
      setValue('#productFittingB', '插焊');
      setChecked('#productHasMiddle', false);
      update();
    `
  },
  {
    name: "docking-cad-single-card-42",
    productType: "对接类",
    quoteNo: "VIS-DOCKING-CAD-SINGLE-CARD-042",
    setup: `
      setValue('#tubeSeries', 'B');
      syncProductRules('tubeSeries');
      setValue('#productDiameterA', '42');
      setValue('#productThicknessA', '1.5');
      setValue('#productDiameterB', '42');
      setValue('#productThicknessB', '1.5');
      setValue('#productFittingA', '单卡');
      setValue('#productFittingB', '单卡');
      setChecked('#productHasMiddle', false);
      update();
    `
  },
  {
    name: "docking-cad-cap-40",
    productType: "\u5bf9\u63a5\u7c7b",
    quoteNo: "VIS-DOCKING-CAD-CAP-040",
    setup: `
      setValue('#productDiameterA', '40');
      setValue('#productThicknessA', '1.5');
      setValue('#productDiameterB', '40');
      setValue('#productThicknessB', '1.5');
      setValue('#productFittingA', '\u5835\u5934');
      setValue('#productFittingB', '\u5835\u5934');
      setValue('#productMiddleDiameter', '40');
      setValue('#productMiddleThickness', '1.5');
      setValue('#productMiddleA', '\u76f4\u7ba1');
      setValue('#productMiddleLengthA', '180');
      update();
    `
  },
  {
    name: "docking-compact-16",
    productType: "对接类",
    quoteNo: "VIS-DOCKING-COMPACT-016",
    setup: `
      setValue('#productDiameterA', '16');
      setValue('#productThicknessA', '1');
      setValue('#productDiameterB', '16');
      setValue('#productThicknessB', '1');
      setValue('#productFittingA', '外丝');
      setValue('#productFittingB', '外丝');
      setChecked('#productHasMiddle', false);
    `
  },
  {
    name: "docking-reducer-219",
    productType: "对接类",
    quoteNo: "VIS-DOCKING-REDUCER-219",
    setup: `
      setValue('#productDiameterA', '219');
      setValue('#productThicknessA', '3');
      setValue('#productDiameterB', '133');
      setValue('#productThicknessB', '2.5');
      setValue('#productFittingA', '法兰');
      setValue('#productFittingB', '法兰');
      setChecked('#productHasMiddle', true);
      setValue('#productMiddleDiameter', '159');
      setValue('#productMiddleThickness', '2.5');
      setValue('#productMiddleCount', '1');
    `
  },
  { name: "tee", productType: "三通类", quoteNo: "VIS-TEE-001" },
  {
    name: "tee-german-external-15",
    productType: "三通类",
    quoteNo: "VIS-TEE-DE-015",
    setup: `
      setValue('#tubeSeries', 'B');
      syncProductRules('tubeSeries');
      setValue('#teeBodyDiameter', '15');
      setValue('#teeBodyThickness', '1.5');
      setValue('#teeDiameterA', '15');
      setValue('#teeThicknessA', '1.5');
      setValue('#teeDiameterB', '15');
      setValue('#teeThicknessB', '1.5');
      setValue('#teeDiameterC', '15');
      setValue('#teeThicknessC', '1.5');
      setValue('#teeFittingA', '外丝');
      setValue('#teeFittingB', '外丝');
      setValue('#teeFittingC', '外丝');
      update();
      if (document.querySelector('#teeBodyLength').value !== '19') {
        throw new Error('German D15 tee body length must resolve to the D18 standard value of 19 mm');
      }
      if (document.querySelector('#teeBodyLengthStatus').textContent.trim() !== '自动') {
        throw new Error('Tee body length must be marked as an automatic table value');
      }
    `
  },
  {
    name: "tee-gb-external-16",
    productType: "三通类",
    quoteNo: "VIS-TEE-GB-016",
    setup: `
      setValue('#tubeSeries', 'A');
      syncProductRules('tubeSeries');
      ['A', 'B', 'C'].forEach(side => {
        setValue('#teeDiameter' + side, '16');
        setValue('#teeThickness' + side, '1');
        setValue('#teeFitting' + side, '外丝');
      });
      setValue('#teeBodyDiameter', '16');
      setValue('#teeBodyThickness', '1');
      update();
      if (document.querySelector('#teeBodyLength').value !== '17') throw new Error('GB D16 tee body length must be 17 mm');
    `
  },
  {
    name: "tee-german-single-card-18",
    productType: "三通类",
    quoteNo: "VIS-TEE-DE-018",
    setup: `
      setValue('#tubeSeries', 'B');
      syncProductRules('tubeSeries');
      ['A', 'B', 'C'].forEach(side => {
        setValue('#teeDiameter' + side, '18');
        setValue('#teeThickness' + side, '1.5');
        setValue('#teeFitting' + side, '单卡');
      });
      setValue('#teeBodyDiameter', '18');
      setValue('#teeBodyThickness', '1.5');
      update();
      if (document.querySelector('#teeBodyLength').value !== '19') throw new Error('German D18 tee body length must be 19 mm');
    `
  },
  {
    name: "tee-gb-internal-20",
    productType: "三通类",
    quoteNo: "VIS-TEE-GB-020",
    setup: `
      setValue('#tubeSeries', 'A');
      syncProductRules('tubeSeries');
      ['A', 'B', 'C'].forEach(side => {
        setValue('#teeDiameter' + side, '20');
        setValue('#teeThickness' + side, '1');
        setValue('#teeFitting' + side, '内丝');
      });
      setValue('#teeBodyDiameter', '20');
      setValue('#teeBodyThickness', '1');
      update();
      if (document.querySelector('#teeBodyLength').value !== '28') throw new Error('GB D20 tee body length must be 28 mm');
    `
  },
  {
    name: "tee-german-double-card-22",
    productType: "三通类",
    quoteNo: "VIS-TEE-DE-022",
    setup: `
      setValue('#tubeSeries', 'B');
      syncProductRules('tubeSeries');
      ['A', 'B', 'C'].forEach(side => {
        setValue('#teeDiameter' + side, '22');
        setValue('#teeThickness' + side, '1.5');
        setValue('#teeFitting' + side, '双卡');
      });
      setValue('#teeBodyDiameter', '22');
      setValue('#teeBodyThickness', '1.5');
      update();
      if (document.querySelector('#teeBodyLength').value !== '28') throw new Error('German D22 tee body length must be 28 mm');
    `
  },
  {
    name: "tee-cad-socket-weld-40",
    productType: "三通类",
    quoteNo: "VIS-TEE-CAD-SOCKET-040",
    setup: `
      setValue('#tubeSeries', 'A');
      setValue('#teeBodyDiameter', '40');
      setValue('#teeDiameterA', '40');
      setValue('#teeDiameterB', '40');
      setValue('#teeDiameterC', '40');
      setValue('#teeFittingA', '插焊');
      setValue('#teeFittingB', '插焊');
      setValue('#teeFittingC', '插焊');
      update();
    `
  },
  {
    name: "tee-large-b-middle",
    productType: "三通类",
    quoteNo: "VIS-TEE-219-B-MIDDLE",
    setup: `
      setValue('#teeBodyDiameter', '219');
      setValue('#teeBodyThickness', '3');
      setValue('#teeDiameterA', '219');
      setValue('#teeThicknessA', '3');
      setValue('#teeDiameterB', '133');
      setValue('#teeThicknessB', '2.5');
      setValue('#teeDiameterC', '219');
      setValue('#teeThicknessC', '3');
      setValue('#teeFittingA', '法兰');
      setValue('#teeFittingB', '法兰');
      setValue('#teeFittingC', '法兰');
      setValue('#teeMiddleB', '直管');
      setValue('#teeMiddleLengthB', '50');
    `
  },
  {
    name: "tee-large-external-branch-219",
    productType: "三通类",
    quoteNo: "VIS-TEE-219-B-EXTERNAL-0508",
    setup: `
      setValue('#teeBodyDiameter', '219');
      setValue('#teeBodyThickness', '3');
      setValue('#teeDiameterA', '219');
      setValue('#teeThicknessA', '3');
      setValue('#teeDiameterB', '50.8');
      setValue('#teeThicknessB', '1.5');
      setValue('#teeDiameterC', '219');
      setValue('#teeThicknessC', '3');
      setValue('#teeFittingA', '沟槽');
      setValue('#teeFittingC', '沟槽');
      setValue('#teeMiddleB', '无');
      const branchFitting = document.querySelector('#teeFittingB');
      if (!Array.from(branchFitting.options).some(option => option.value === '外丝')) {
        branchFitting.add(new Option('外丝', '外丝'));
      }
      branchFitting.value = '外丝';
      update();
    `
  },
  { name: "elbow", productType: "弯头类", quoteNo: "VIS-ELBOW-001" },
  {
    name: "elbow-cad-single-card-42",
    productType: "弯头类",
    quoteNo: "VIS-ELBOW-CAD-SINGLE-CARD-042",
    setup: `
      setValue('#tubeSeries', 'B');
      syncProductRules('tubeSeries');
      setValue('#elbowBodyDiameter', '42');
      setValue('#elbowDiameterA', '42');
      setValue('#elbowDiameterB', '42');
      setValue('#elbowFittingA', '单卡');
      setValue('#elbowFittingB', '单卡');
      setValue('#productAngle', '90');
      update();
      if (document.querySelector('#productLength').value !== '63') throw new Error('German D42 elbow center height must be 63 mm');
      if (document.querySelector('#elbowLengthStatus').textContent.trim() !== '自动') {
        throw new Error('Elbow center height must be marked as an automatic table value');
      }
    `
  },
  {
    name: "elbow-45-large",
    productType: "弯头类",
    quoteNo: "VIS-ELBOW-45-219",
    setup: `
      setValue('#elbowBodyDiameter', '219');
      setValue('#elbowBodyThickness', '3');
      setValue('#elbowDiameterA', '219');
      setValue('#elbowThicknessA', '3');
      setValue('#elbowDiameterB', '159');
      setValue('#elbowThicknessB', '2.5');
      setValue('#elbowFittingA', '法兰');
      setValue('#elbowFittingB', '法兰');
      setValue('#productAngle', '45');
      setValue('#elbowMiddleA2', '直管');
      setValue('#elbowMiddleLengthA', '80');
      setValue('#elbowMiddleB2', '直管');
      setValue('#elbowMiddleLengthB', '80');
    `
  },
  { name: "combination", productType: "组合件", quoteNo: "VIS-COMBINATION-001" }
];

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function stopChrome(process) {
  if (!process || process.exitCode !== null) return;
  const exited = new Promise(resolve => process.once("exit", resolve));
  process.kill();
  await Promise.race([exited, wait(3000)]);
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", chunk => { body += chunk; });
      response.on("end", () => {
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    }).on("error", reject);
  });
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = require("net").createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(error => error ? reject(error) : resolve(port));
    });
  });
}

class DevToolsClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.sequence = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", event => {
      const message = JSON.parse(event.data);
      if (!message.id && message.method) {
        (this.listeners.get(message.method) || []).forEach(listener => listener(message.params || {}));
        return;
      }
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
    });
  }

  async command(method, params = {}) {
    await this.ready;
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
    return () => this.listeners.set(method, listeners.filter(item => item !== listener));
  }

  close() {
    this.socket.close();
  }
}

async function waitForTarget(port) {
  let lastError;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await requestJson(`http://127.0.0.1:${port}/json`);
      const page = targets.find(target => target.type === "page");
      if (page?.webSocketDebuggerUrl) return page;
    } catch (error) {
      lastError = error;
    }
    await wait(100);
  }
  throw lastError || new Error("Chrome DevTools target did not start");
}

function pngDigest(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function evaluate(client, expression) {
  const response = await client.command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) {
    const details = response.exceptionDetails;
    throw new Error(details.exception?.description || details.text || "page evaluation failed");
  }
  return response.result?.value;
}

async function captureDrawing(client, testCase) {
  await evaluate(client, `document.querySelector('[data-product-type="${testCase.productType}"]')?.click()`);
  await wait(250);
  await evaluate(client, `(() => {
    const emit = element => {
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };
    window.setValue = (selector, value) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error('missing field: ' + selector);
      const desired = String(value);
      if (!Array.from(element.options || []).some(option => option.value === desired) && element.tagName === 'SELECT') {
        throw new Error('unavailable option ' + desired + ' for ' + selector);
      }
      element.value = desired;
      emit(element);
    };
    window.setChecked = (selector, value) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error('missing field: ' + selector);
      element.checked = Boolean(value);
      emit(element);
    };
    setValue('#tubeSeries', 'A');
    syncProductRules('tubeSeries');
    ${testCase.setup || ""}
    const quoteNo = document.querySelector('#quoteNo');
    quoteNo.value = '${testCase.quoteNo}';
    emit(quoteNo);
    delete window.setValue;
    delete window.setChecked;
  })()`);
  await wait(350);
  const bounds = await evaluate(client, `(() => {
    const drawing = document.querySelector('#drawing');
    document.querySelector('#visual-regression-capture')?.remove();
    const host = document.createElement('div');
    host.id = 'visual-regression-capture';
    host.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;width:1200px;height:810px;background:#fff;overflow:hidden;';
    const clone = drawing?.cloneNode(true);
    if (!clone) return null;
    clone.removeAttribute('id');
    clone.setAttribute('width', '1200');
    clone.setAttribute('height', '810');
    clone.style.cssText = 'display:block;width:1200px;height:810px;background:#fff;';
    host.append(clone);
    document.body.append(host);
    const rect = host.getBoundingClientRect();
    return rect && { x: Math.floor(rect.x), y: Math.floor(rect.y), width: Math.ceil(rect.width), height: Math.ceil(rect.height) };
  })()`);
  if (!bounds || bounds.width < 100 || bounds.height < 100) throw new Error(`${testCase.name}: drawing not visible`);
  await wait(120);
  const shot = await client.command("Page.captureScreenshot", { format: "png", clip: { ...bounds, scale: 1 }, captureBeyondViewport: true });
  await evaluate(client, "document.querySelector('#visual-regression-capture')?.remove()");
  return Buffer.from(shot.data, "base64");
}

async function run() {
  if (!fs.existsSync(chromePath)) throw new Error(`Chrome not found: ${chromePath}`);
  fs.mkdirSync(baselineDir, { recursive: true });
  fs.mkdirSync(artifactDir, { recursive: true });
  const serverInfo = await startStaticServer(0);
  const debugPort = await freePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "franta-visual-"));
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--window-size=1800,1280", `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`, serverInfo.url
  ], { stdio: "ignore" });
  let client;
  const browserErrors = [];

  try {
    const target = await waitForTarget(debugPort);
    client = new DevToolsClient(target.webSocketDebuggerUrl);
    client.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
      browserErrors.push(exceptionDetails?.exception?.description || exceptionDetails?.text || "未捕获页面异常");
    });
    client.on("Runtime.consoleAPICalled", ({ type, args = [] }) => {
      if (type !== "error") return;
      const message = args.map(arg => arg.value ?? arg.description ?? "").filter(Boolean).join(" ");
      browserErrors.push(message || "console.error");
    });
    await client.command("Page.enable");
    await client.command("Runtime.enable");
    await client.command("Page.addScriptToEvaluateOnNewDocument", {
      source: `(() => {
        const RealDate = Date;
        class FixedDate extends RealDate {
          constructor(...args) { super(...(args.length ? args : ['2026-01-01T00:00:00.000Z'])); }
          static now() { return new RealDate('2026-01-01T00:00:00.000Z').valueOf(); }
        }
        window.Date = FixedDate;
      })();`
    });
    await client.command("Page.navigate", { url: serverInfo.url });
    await wait(800);
    await evaluate(client, "localStorage.clear(); location.reload()");
    await wait(800);
    browserErrors.length = 0;
    const failures = [];
    for (const testCase of cases) {
      browserErrors.length = 0;
      const image = await captureDrawing(client, testCase);
      const baselinePath = path.join(baselineDir, `${testCase.name}.png`);
      fs.writeFileSync(path.join(artifactDir, `${testCase.name}.actual.png`), image);
      if (updateBaselines) {
        fs.writeFileSync(baselinePath, image);
        console.log(`visual baseline updated: ${testCase.name}`);
      } else if (!fs.existsSync(baselinePath)) {
        failures.push(`${testCase.name}: missing baseline; run npm run test:visual:update`);
      } else if (pngDigest(image) !== pngDigest(fs.readFileSync(baselinePath))) {
        failures.push(`${testCase.name}: screenshot changed; see tests/visual-artifacts/${testCase.name}.actual.png`);
      } else {
        console.log(`visual regression passed: ${testCase.name}`);
      }
      if (browserErrors.length) {
        failures.push(`${testCase.name}: browser error: ${browserErrors.join(" | ")}`);
      }
    }
    if (failures.length) throw new Error(`Visual regression failures:\n${failures.join("\n")}`);
  } finally {
    client?.close();
    await stopChrome(chrome);
    serverInfo.server.close();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
    } catch (error) {
      // Chrome can retain a child-process lock briefly on Windows. The folder
      // lives in the OS temp directory and does not affect the test result.
      console.warn(`visual test temp cleanup deferred: ${error.code || error.message}`);
    }
  }
}

run().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
