const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const host = "127.0.0.1";
const port = Number(process.env.PORT) || 4173;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8"
};

function createStaticServer() {
  return http.createServer((req, res) => {
    const portValue = server.address()?.port || port;
    const url = new URL(req.url, `http://${host}:${portValue}`);
    const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = path.normalize(path.join(root, requestedPath));

    if (!filePath.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === "ENOENT") {
          send(res, 404, "Not found");
          return;
        }
        send(res, 500, "Server error");
        return;
      }
      send(res, 200, content, mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream");
    });
  });
}

function send(res, status, content, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(content);
}

let server;

function startStaticServer(preferredPort = port) {
  if (server?.listening) {
    return Promise.resolve({
      server,
      url: `http://${host}:${server.address().port}/`
    });
  }

  server = createStaticServer();
  return new Promise((resolve, reject) => {
    const handleError = error => {
      if (error.code === "EADDRINUSE" && preferredPort !== 0) {
        server = createStaticServer();
        server.once("error", reject);
        server.listen(0, host, () => {
          server.off("error", reject);
          resolve({
            server,
            url: `http://${host}:${server.address().port}/`
          });
        });
        return;
      }
      reject(error);
    };
    server.once("error", handleError);
    server.listen(preferredPort, host, () => {
      server.off("error", handleError);
      resolve({
        server,
        url: `http://${host}:${server.address().port}/`
      });
    });
  });
}

if (require.main === module) {
  startStaticServer().then(({ url }) => {
    console.log(`定制产品出图报价: ${url}`);
  }).catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { startStaticServer };
