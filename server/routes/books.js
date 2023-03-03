// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    let sampleBook={
      Title:"",
      Price:"",
      Author:"",
      Genre:""
    }
    res.render('books/details',{title:'Add Book',books:sampleBook})
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
    console.log("request",req);
    let newBook=book({
      "Title":req.body.title,
      "Price":req.body.price,
      "Author":req.body.author,
      "Genre":req.body.genre
    })

    book.create(newBook, (err,book)=>{
      console.log("HEREEEEE:------",book)
      if(err){
        console.log("Some error occurred:",err);
        res.end(err);
      }else{
        res.redirect('/books')
      }
    })
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    let id= req.params.id;
    book.findById(id,(err,bookToEdit)=>{
      if(err){
        console.log("ERRR::",err);
        res.end(err);
      }else{
        console.log("YAYYY::",bookToEdit);
        res.render('books/details',{title:'Edit Book',books:bookToEdit})
      }
    })
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
    let id= req.params.id;
    let updateBook=book({
      "_id": id,
      "Title":req.body.title,
      "Price":req.body.price,
      "Author":req.body.author,
      "Genre":req.body.genre
    });
    book.updateOne({_id:id}, updateBook, (err)=>{
      if(err){
        console.log("EDIT ERR:",err);
        res.end(err);
      }else{
        console.log("EDIted::: ",updateBook);
        res.redirect('/books');
      }
    })
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    let id= req.params.id;

    book.remove({_id:id}, (err)=>{
      if(err){
        console.log("Delete err",err);
        res.end(err);
      }else{
        console.log("DELETED SUCC");
        res.redirect('/books');
      }
    })
});


module.exports = router;
