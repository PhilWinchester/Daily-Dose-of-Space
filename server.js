require('dotenv').config();
const express              = require("express");
const logger               = require("morgan");
const bodyParser           = require("body-parser");
const path                 = require("path");
const methodOverride       = require("method-override");

const mapRoutes            = require("./routes/maps");
const dataRoutes           = require("./routes/data");

const app                  = express();
const PORT                 = process.argv[2] || process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set("views", "views");

app.use("/maps", mapRoutes);
app.use("/data", dataRoutes);

app.listen(PORT, () => console.warn("server up and running on->", PORT));

app.get("/", (reg,res) => {
  res.render("index");
});

app.get("/login", (req,res) => {
  res.render("login");
});
