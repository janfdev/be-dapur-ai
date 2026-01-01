const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const router = require("./routes/routes");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = 3000;

app.get("/", (req, res) => {
  res.redirect("/docs");
});

const swaggerSpec = require("./utils/swagger");

// Serve Swagger JSON
app.get("/docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Serve Swagger UI via CDN (Fix for Vercel)
app.get("/docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Dapur AI API Documentation</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: window.location.origin + '/docs/swagger.json',
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
            ],
            layout: "BaseLayout",
          });
        };
      </script>
    </body>
    </html>
  `);
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
