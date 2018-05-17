var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");



// Initial database for urls and users
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9s5m5xK': 'http://www.google.com'
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Generating random string
function generateRandomString(){
  return Math.random().toString(20).slice(8);
}

// Check registered email with database information
function checkEmail(response, userEmail) {
  for (var i in users){
    if (userEmail === users[i].email) {
      response.status(400).send('This email is already registered. Please register with another email address or login using existing email address');
    }
  }
}

function checkEmptyString(response, userEmail, userPassword){
  if (userEmail === "" || userPassword === "" ){
    response.status(400).send('Please enter a valid Username and Password');
  }
}

// Login and Logout
app.post("/login", (request, response) => {
  response.cookie('username', request.body.username);
  response.redirect("/urls");
});

app.post("/logout", (request, response) => {
  response.clearCookie('username');
  response.redirect("/urls");
});

// User Registration
app.get("/register", (request, response) =>{
  response.render("register");
});
app.post("/register", (request, response) =>{
  let userEmail = request.body.email;
  let userPassword = request.body.password;
  let userID = generateRandomString();
  checkEmptyString(response, userEmail, userPassword);
  checkEmail(response, userEmail);

  users[userID] = {
    id: userID,
    email: userEmail,
    password: userPassword
  };
  response.cookie('user_id', userID);
  response.redirect("/urls");
});

// Welcome and URL lists page
app.get("/", (request, response) => {
  response.end("Hello!");
});

app.get("/urls", (request, response) => {
  response.render("urls_index", {
    urls: urlDatabase,
    username: request.cookies["username"]
  });
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});


// Individual id url page and redirection
app.get("/urls/:id", (request, response) => {
  let longURL = urlDatabase[request.params.id];
  response.render("urls_show", {
    shortURL: request.params.id,
    longURL: urlDatabase[request.params.id],
    username: request.cookies["username"]
  });
});
app.get("/u/:shortURL", (request, response) => {
  let shortURL = request.params.shortURL;
  response.redirect(urlDatabase[shortURL]);
});



// Creating, modifying, and deleting URLs
app.get("/urls/new", (request, response) => {
  response.render("urls_new", {
    username: request.cookies["username"]
  });
});

app.post("/urls", (request, response) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = request.body.longURL;
  response.redirect('/urls/' + randomString);
});

app.post("/urls/:id/delete", (request, response) => {
  var shortURL = request.params.id;
  delete urlDatabase[shortURL];
  response.redirect('/urls/');
});

app.post("/urls/:id/update", (request, response) => {
  let updatedURL = request.body.updatedURL;
  let id = request.params.id;
  urlDatabase[id] = updatedURL;
  response.redirect('/urls');
});


// Listening to port
app.listen(PORT, () => {
  console.log(`Example app is listening to port ${PORT}!`);
});






