const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
const username = req.body.username;
const password = req.body.password;

// Check if both username and password are provided
if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}
// Return error if username or password is missing
return res.status(404).json({message: "Unable to register user."}
);
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const filter_book = Object.values(books).filter((book) => book.author === author);
  res.send(filter_book)
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const filter_book = Object.values(books).filter((book) => book.title === title);
  res.send(filter_book)  
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)  
  //return res.status(300).json({message: "Yet to be implemented"});
});

const getAllBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error.message);
        throw error;
    }
};

const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );

        console.log("Book details:", response.data);
        return response.data;

    } catch (error) {
        console.error(
            "Error fetching book by ISBN:",
            error.message
        );
        throw error;
    }
};

const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        console.log("Books by author:", response.data);
        return response.data;

    } catch (error) {
        console.error(
            "Error fetching books by author:",
            error.message
        );
        throw error;
    }
};

const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        console.log("Books by title:", response.data);
        return response.data;

    } catch (error) {
        console.error(
            "Error fetching books by title:",
            error.message
        );
        throw error;
    }
};


module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
module.exports.general = public_users;

