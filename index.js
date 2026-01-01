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

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");

// Serve Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
