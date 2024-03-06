const express = require ("express");
const { addProduct, getProducts} = require("../controllers/product.js");
const router=express.Router();
router.get("/",getProducts)
router.post("/addproduct",addProduct)
module.exports = router;