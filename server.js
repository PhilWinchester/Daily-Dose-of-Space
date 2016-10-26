require('dotenv').config();
const express              = require("express");
const logger               = require("morgan");
const bodyParser           = require("body-parser");
const path                 = require("path");
const methodOverride       = require("method-override");
const sha256               = require('js-sha256');

const nasaService          = require("./services/nasa");

const app                  = express();
const PORT                 = process.argv[2] || process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set("views", "views");

app.listen(PORT, () => console.warn("server up and running on->", PORT));

app.get("/", nasaService.getApod, nasaService.getEpic, (req,res) => {
  res.render('index', {
    apodData: res.apod,
    epicData: res.epic,
  });
  // res.json(res.apod);
});
