const cheerio = require("cheerio");
const request = require("request");
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8000;

const mongodb_uri = process.env.MONGODB_URI || 'mongodb://localhost/newscrap';

mongoose.Promise = Promise;
mongoose.connect(mongodb_uri, { useMongoClient: true });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static('./public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const routes = require('./routes/router.js');

app.use('/',routes);

app.listen(port, function () {
 console.log("You are listening to port: " + port);
});
