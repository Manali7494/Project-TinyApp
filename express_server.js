var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port setup
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

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
    urls: urlDatabase,
    username: request.cookies["username"]
  });
})

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase); // .json ensures proper display on the page
});

app.get("/urls/new",(request,response) => {
  response.render("urls_new", {
    username: request.cookies["username"]
  });
});

app.get("/urls/:id", (request,response) => {
  var longURL = urlDatabase[request.params.id];
  response.render("urls_show", {
    shortURL: request.params.id,
    longURL: urlDatabase[request.params.id],
  //  username: request.cookies["username"]
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

app.post("/urls/:id/delete",(request,response) => {
var shortURL = request.params.id;
delete urlDatabase[shortURL];
response.redirect('/urls/');
});


app.post("/urls/:id/update",(request,response) => {
var updatedURL = request.body.updatedURL;
var id = request.params.id;
urlDatabase[id] = updatedURL;
response.redirect('/urls');
});

// Listening to port
app.listen(PORT, () => {
  console.log(`Example app is listening to port ${PORT}!`);
});

app.post("/login",(request,response) => {
response.cookie('username',request.body.username);
response.redirect("/urls");
console.log(request.body.username);
});


// Generating random string

function generateRandomString(){

return Math.random().toString(20).slice(8);

}