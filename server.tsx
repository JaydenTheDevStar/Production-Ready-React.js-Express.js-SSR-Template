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

// Serve static assets from the dist/static directory
app.use("/static", express.static(path.resolve(__dirname, "../static")));

app.get("*", (req, res) => {
  const context = {};

  // Render the app to a string (SSR)
  const appMarkup = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );

  // Read the generated client-side bundle
  const clientBundle = fs
    .readdirSync(path.resolve(__dirname, "../static"))
    .find((file) => file.startsWith("ClientIndex"));

  // Read the existing index.html template
  const indexFile = path.resolve("./public/index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading index.html", err);
      return res.status(500).send("An error occurred");
    }

    // Get the preloaded state from the Redux store
    const preloadedState = store.getState();

    // Replace the <div id="root"></div> with the server-rendered app
    const html = data
      .replace('<div id="root"></div>', `<div id="root">${appMarkup}</div>`)
      .replace(
        "</body>",
        `<script>
       window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
         /</g,
         "\\u003c"
       )}
     </script>
     <script>
       document.addEventListener("DOMContentLoaded", function() {
         var script = document.createElement("script");
         script.src = "/static/${clientBundle}";
         document.body.appendChild(script);
       });
     </script>
     </body>`
      );

    // Send the modified HTML file
    return res.send(html);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
