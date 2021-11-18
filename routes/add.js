const express = require('express');
const dbProduct = require('../model/Product')
const verify = require('../middlware/verifed')
const fileFilter = require('../middlware/fileUpload')
const router = express.Router();
const toDelete = require('../middlware/delete')

router.get('/', function(req, res, next) {
  res.render('add', {
     title: 'Add Product',
  });
});

router.post('/' , fileFilter.single("img") , verify , async  (req , res) => {
  console.log(req.file.filename);
  const db = new dbProduct({
    title : req.body.title,
    price : req.body.price,
    gender : req.body.gender,
    comment : req.body.comment,
    img : req.file.filename
  })
  await db.save((err) => {
    if(err){
      console.log(err);
    }else{
      res.redirect('/products')
    }
  })
})

router.get('/product/:id' ,  (req , res) => {
  dbProduct.findById(req.params.id, (err ,data) => {
    try {
      res.render("product" , {
        title: "More",
        data
      })
    } catch (error) {
      console.log(error);
    }
  })
})

router.get('/update/:id' , (req, res) => {
  dbProduct.findById(req.params.id, (err ,data) => {
    try {
      res.render("add", {
        title: "Update Product",
        data,
        btn : "Update",
      })
    } catch (error) {
      console.log(error);
    }
  })
})

router.post('/update/:id', fileFilter.single("img") , async (req , res) => {
  const db = {
    title : req.body.title,
    price : req.body.price,
    size : req.body.size,
    gender : req.body.gender,
    comment : req.body.comment,
    img : req.file.filename
  }
  try {
    const ids = {_id : req.params.id}
   await dbProduct.findByIdAndUpdate(ids , db)
    res.redirect('/products')
  } catch (error) {
    console.log(error);
  }
})

router.get('/delete/:id',  async (req , res) => {
  try {
    const {img} = await dbProduct.findById(req.params.id)
    toDelete(img)
    const id = {_id : req.params.id}
    await  dbProduct.findByIdAndDelete(id)
    res.redirect('/')
  } catch (error) {
    console.log(error);
  }
})



module.exports = router;
