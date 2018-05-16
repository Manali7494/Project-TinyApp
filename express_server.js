var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port setup
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extenderd: true}));
app.set("view engine", "ejs");

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9s5m5xK': 'http://www.google.com'
};

// Identifies path and action
app.get("/", (request, response) => {
  response.end("Hello!");
});
app.get("/urls.json", (request, response) => {
  response.json(urlDatabase); // .json ensures proper display on the page
});
app.get('/hello', (request,response) => {
  response.end("<html><body>Hello <b>World</b></body></html>\n")
});
app.get("/urls", (request,response) => {
  response.render("urls_index",{
    urls: urlDatabase
  });
})

app.get("/urls/:id", (request,response) => {
  response.render("urls_show", {
    shortURL: request.params.id,
    longURL: urlDatabase[request.params.id]
  });
});

// Listening to port
app.listen(PORT, () => {
  console.log(`Example app is listening to port ${PORT}!`);
});

/*
for (var i in urlDatabase){
console.log(i);
console.log(urlDatabase[i]);
}*/