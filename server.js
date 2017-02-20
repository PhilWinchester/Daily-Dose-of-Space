const dotEnv               = require('dotenv').config({silent: true});
const express              = require("express");
const logger               = require("morgan");
const bodyParser           = require("body-parser");
const path                 = require("path");
const methodOverride       = require("method-override");
const session              = require('express-session');
const cookieParser         = require('cookie-parser');

const indexRoutes          = require("./routes/index");
const authRoutes           = require("./routes/auth");
const usersRoutes          = require("./routes/users");
const dataRoutes           = require("./routes/data");

const app                  = express();
const SECRET               = "sunset3000";
const PORT                 = process.argv[2] || process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: SECRET
}));

app.set('view engine', 'ejs');
app.set("views", "views");

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/data", dataRoutes);

app.listen(PORT, () => console.warn("server up and running on->", PORT));
