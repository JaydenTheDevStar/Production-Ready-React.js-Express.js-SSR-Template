import React from "react";
import path from "path";
import express from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./src/store";
import App from "./src/App";
import fs from "fs";

const app = express();
const isDevelopment = process.env.NODE_ENV !== "production";

// Serve static assets from the dist/static directory
if (isDevelopment) {
  // In dev mode, serve the client from the webpack-dev-server
  app.use("/static", express.static(path.resolve(__dirname, "../public")));
} else {
  app.use("/static", express.static(path.resolve(__dirname, "../static")));
}

app.get("*", (req, res) => {
  if (isDevelopment) {
    // In development mode, serve the index.html directly without SSR
    const indexFile = path.resolve("./public/index.html");
    fs.readFile(indexFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading index.html", err);
        return res.status(500).send("An error occurred");
      }
      res.send(data);
    });
  } else {
    // In production mode, perform SSR
    const context = {};

    const appMarkup = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    );

    const clientBundles = fs
      .readdirSync(path.resolve(__dirname, "../static"))
      .filter((file) => file.startsWith("ClientIndex") && file.endsWith(".js"));

    const indexFile = path.resolve("./public/index.html");
    fs.readFile(indexFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading index.html", err);
        return res.status(500).send("An error occurred");
      }

      const preloadedState = store.getState();

      const html = data
        .replace('<div id="root"></div>', `<div id="root">${appMarkup}</div>`)
        .replace(
          "</body>",
          `<script>
            window.__PRELOADED_STATE__ = ${JSON.stringify(
              preloadedState
            ).replace(/</g, "\\u003c")}
          </script>
          ${clientBundles
            .map((bundle) => `<script defer src="/static/${bundle}"></script>`)
            .join("\n")}
          </body>`
        );
      res.send(html);
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
