require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const morgan = require('morgan')
const app = express();
const cookieParser = require('cookie-parser')
const passport = require('passport')
const PORT = process.env.PORT || 3001;

app.use(cookieParser())
// passport authentication
const strategy = require('./passport')
passport.use(strategy)
app.use(passport.initialize())


// Connect to the database
mongoose.connect(process.env.MONGODB_URI|| 'mongodb://localhost/sole-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
  console.log(`Mongoose is connected.`)
})
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose had an error ${err}`)
})
mongoose.connection.on('disconnected', () => {
  console.log(`Mongoose is disconnected`)
})


// Routes
const routes = require('./routes/api');
// const { response } = require('express');
// routes(app)


// Data parsing
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

// Logger
app.use(morgan('tiny'));
app.use('/', routes)

// Cookie parser
app.use(cookieParser())


// Server listening
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  const fullpath = path.join(__dirname, 'client', 'build', 'index.html')
  res.sendFile(fullpath);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}