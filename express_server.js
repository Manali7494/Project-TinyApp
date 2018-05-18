var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
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
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

// Generates random string
function generateRandomString(){
  return Math.random().toString(20).slice(8);
}

// Validates login Username and Password
function validateUser(loginEmail){
  for (var i in users){
    if (loginEmail === users[i].email){
      return users[i];
    }
  }
}

function checkPassword(usrObject, password, response){
  let compare = bcrypt.compareSync(password, usrObject.password);
  if (compare === true){
    return true;
  } else{
    response.status(403);
    response.send("Password doesn't match the email address");
  }
}

// Registration checks for empty strings and existing emails
function checkEmptyString(response, userEmail, userPassword){
  var result;
  if (userEmail === "" || userPassword === "" ){
    response.status(400).send('Please enter a valid Username and Password');
    result = true;
  } else{
    result = false;
  }
  return result;
}

function checkEmail(response, userEmail) {
  for (var i in users){
    if (userEmail === users[i].email) {
      response.status(400).send('This email is already registered. Please register with another email address or login using existing email address');
    }
  }
}

// Login and Logout
app.get("/login", (request, response) => {
  response.render("login");
});

app.post("/login", (request, response) => {
  let userObject = validateUser(request.body.email);
  if (userObject === undefined){
    response.status(403);
    response.send("User with that email can not be found");
  } else{
    if (checkPassword(userObject, request.body.password, response)){
      let userID = userObject.id;
      response.cookie('user_id', userID);
      response.redirect('/urls');
    }
  }

});

app.post("/logout", (request, response) => {
  response.clearCookie('user_id');
  response.redirect('/urls/');
});

// User Registration
app.get("/register", (request, response) =>{
  response.render("register");
});
app.post("/register", (request, response) =>{
  let userEmail = request.body.email;
  let userPassword = request.body.password;
  let userID = generateRandomString();
  checkEmail(response, userEmail);
  if (!checkEmptyString(response, userEmail, userPassword)){
    users[userID] = {
      id: userID,
      email: userEmail,
      password: bcrypt.hashSync(userPassword, 10)
    };
  }
  response.cookie('user_id', userID);
  response.redirect("/urls");
});


// Initate pages
app.get("/urls", (request, response) => {

  let usrID = request.cookies.user_id;
  let usrObj = users[usrID];
  let templateVars = {
    urls: urlDatabase,
    user: usrObj,
    userID: usrID
  };

  response.render("urls_index", templateVars);

});


app.get("/u/:shortURL", (request, response) => {
  let shortURL = request.params.shortURL;
  response.redirect(urlDatabase[shortURL]);
});


// Creating, modifying, and deleting URLs
app.get("/urls/new/", (request, response) => {
  let usrID = request.cookies.user_id;
  let usrObj = users[usrID];
  let templateVars = {
    urls: urlDatabase,
    user: usrObj,
    userID: usrID
  };
  if (usrID !== undefined){
    response.render("urls_new", templateVars);
  } else{
    response.redirect("/login");
  }
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

// Individual id url page and redirection
app.get("/urls/:id", (request, response) => {
  let usrID = request.cookies.user_id;
  let usrObj = users[usrID];
  templateVars = {
    shortURL: request.params.id,
    longURL: urlDatabase[request.params.id],
    userID: usrID,
    user: usrObj
  };
  response.render("urls_show", templateVars);
});

// Listening to port
app.listen(PORT, () => {
  console.log(`Example app is listening to port ${PORT}!`);
});
