var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port setup
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9s5m5xK': 'http://www.google.com'
};

// Identifies path and action
app.get("/", (request, response) => {
  response.end("Hello!");
});

app.get("/urls", (request,response) => {
  response.render("urls_index",{
    urls: urlDatabase
  });
})

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase); // .json ensures proper display on the page
});

app.get("/urls/new",(request,response) => {
  response.render("urls_new");
});

app.get("/urls/:id", (request,response) => {
  var longURL = urlDatabase[request.params.id];
  response.render("urls_show", {
    shortURL: request.params.id,
    longURL: urlDatabase[request.params.id]
  });
});
app.get("/u/:shortURL",(request,response) => {
  var shortURL = request.params.shortURL;
  response.redirect(urlDatabase[shortURL]);
})

app.post("/urls", (request,response) => {
  var randomString = generateRandomString();
  urlDatabase[randomString] = request.body.longURL
  response.redirect('/urls/'+randomString);
});


// Listening to port
app.listen(PORT, () => {
  console.log(`Example app is listening to port ${PORT}!`);
});



// Generating random string

function generateRandomString(){

return Math.random().toString(20).slice(8);

}