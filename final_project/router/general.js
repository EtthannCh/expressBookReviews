const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksArray = Object.values(books); // return books array
const axios = require("axios")

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.query.username;
  let password = req.query.password;
  if(username && password){
    if(!isValid(username)){
      users.push({"username":username, "password":password})
      return res.status(200).json({message:"User successfully registered"})
    }
    else{
      res.status(404).json({message:"User already Exists"});
    }
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  // res.send(JSON.stringify(books))
  const findBookPromise = new Promise((resolve, reject) => {
    resolve("Find Book Promise resolved")
  },5000)
  findBookPromise.then(() => {
    res.send(JSON.stringify(books))
  }).catch((err) => {
    res.status(500).json({message:"Internal server error"})
  })
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbnNumber = req.params.isbn;
  let findBookByIsbn = books[isbnNumber];
  const findBookByIsbnPromise = new Promise((resolve, reject) => {
    if(findBookByIsbn){
      resolve(findBookByIsbn)
    }
    else{
      reject(new Error("book not found"))
    }
  })
  findBookByIsbnPromise.then((findBookByIsbn) => {
    res.send(findBookByIsbn);
  }).catch((err) => {
    res.status(500).json({message:"Internal server error"})
  })
  
  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorName = req.params.author;
  let selectedBook = booksArray.find((book) => book.author === authorName);
  const findBookByAuthorPromise = new Promise((resolve, reject) => {
    if(selectedBook){
      resolve(selectedBook)
    }
    else{
      reject(new Error("book not found"))
    }
  })
  findBookByAuthorPromise.then((selectedBook) => {
    res.send(selectedBook)
  }).catch((err) =>{ 
    res.status(500).json({message:"Internal Server error"})
  })
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let bookTitle = req.params.title;
  let selectedBookByTitle = booksArray.find((book) => book.title === bookTitle);
  const findBookByTitlePromise = new Promise((resolve, reject) => {
    if(selectedBookByTitle){
      resolve(selectedBookByTitle)
    }
    else{
      reject(new Error("Book not found"))
    }
  })
  findBookByTitlePromise.then((selectedBookByTitle) => {
    res.send(selectedBookByTitle)
  }).catch((err) => {
    res.status(500).json({message:"Internal Server error"})
  })
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let ISBN = req.params.isbn;
  let selectedBookByISBN = books[ISBN];
  res.send(selectedBookByISBN.reviews.text)
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
