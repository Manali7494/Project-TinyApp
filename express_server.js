var PORT = process.env.PORT || 8080; // default port setup


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

// Listening to port
app.listen(PORT, () => {
  console.log(`Example app is listening to port ${PORT}!`);
});


