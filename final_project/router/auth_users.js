const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let booksArray = Object.values(books);
const isValid = (username)=>{ //returns boolean
  let usersWithSameName = users.filter((user) => user.username === username);
  if(usersWithSameName.length > 0){
    return true;
  }
  else{
    return false;
  }
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let filteredUser = users.filter((user) => user.username === username && user.password === password);
  if(filteredUser.length > 0){
    return true;
  }
  else{
    return false;
  }
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;
  if(!username || !password){
    res.status(404).json({message:"Error logging in"});
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data:password
    }, "access", {expiresIn:60*60});
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }
  else{
    return res.status(208).json({message:"Invalid login. check username or password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  let review = req.query.review;
  const username = req.session.authorization.username;
  if(books[ISBN].reviews && books[ISBN].reviews[username]){
    books[ISBN].reviews[username] = review;
  }
  else{
    if(!books[ISBN].reviews){
      books[ISBN].reviews = [{username : review}];
    }
    books[ISBN].reviews[username] = review;
  }
  return res.status(200).json({message:"Review submitted or updated successfully"})
  // return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
  const ISBN = req.params.isbn;
  const username = req.session.authorization.username;
  let reviewsArray = books[ISBN].reviews;
  delete reviewsArray[username];
  // res.send(reviewsArray)
  res.status(200).json({message:"Delete Review successfully"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
