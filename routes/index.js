const express = require('express');
const dbProduct = require('../model/Product')
const router = express.Router();

router.get('/products', function(req, res, next) {
  dbProduct.find({} , (err , data) => {
    try {
      res.render('card', { 
        title: 'Product',
        db : data 

      });
    } catch (err) {
        console.log(err);
    }
  })
 
});
router.get('/', function(req, res, next) {
  dbProduct.find({} , (err , data) => {
    try {
      res.render('index', { 
        title: 'Home',
        db : data 

      });
    } catch (err) {
        console.log(err);
    }
  })
 
});

module.exports = router;
