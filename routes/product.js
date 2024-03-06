const express = require ("express");
const { addPost, getProduct} = require("../controllers/product.js");
const router=express.Router();
router.get("/",getProduct)
router.post("/addproduct",addPost)
module.exports = router;