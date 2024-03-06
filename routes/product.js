import express from "express";
import { addPost, getProduct} from "../controllers/product.js"
const router=express.Router();
router.get("/",getProduct)
router.post("/addproduct",addPost)
export default router;