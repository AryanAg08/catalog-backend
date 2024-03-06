const R1 = require("../models/2.product");
const jwt = require("jsonwebtoken");
async function getProducts (req,res) {
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");
    jwt.verify(token,"secretkey",async(err,userInfo)=>{

        const RR1 = await R1.find({
            userid: userInfo.id,
        })
        if (RR1) {
            console.log(RR1);
            return res.status(200).json(RR1);
        }
        console.log(userInfo)
        return res.status(404).json("not found!!")
    })
}
//SELECT p.*,u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id=p.userid) LEFT JOIN relationships AS r ON (p.userid=r.followedid) WHERE r.followerid=? OR p.userid=?
async function addProduct (req,res) {
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");
jwt.verify(token,"secretkey",(err,userInfo)=>{
    if(err) return res.status(403).json("Token is invalid");
    const products = req.body;
    products.forEach(async (product) => {
        console.log(product)
        console.log(userInfo.id)
    // const q="INSERT INTO product(`name`,`catogary`,`price`,`imgURL`,`location`,`userid`) VALUES (?)";
    // const values=[
    //     product.name,
    //     product.catogary,
    //     parseInt(product.price),
    //    product.imgURL,
    //    product.location,
    //     userInfo.id,
    // ];
    // db.query(q,[values],(err,data)=>{ 
    //     if(err) return res.status(500).json(err);
    //     return res.status(200).json("Product has been Added");
    // })

    const RR2 = await R1.findOneAndUpdate({
        userid: userInfo.id,
        product_name:  product.product_name,
    },{
        catalog_name: product.catalog_name,
        product_name: product.product_name,
        product_price: product.product_price,
        userid: userInfo.id,
        product_quantity: product.product_quantity,
        product_imgurl: product.product_imgurl,
        product_location: product.product_location,
    },{
        upsert: true,
        new: true,
    }).then(() => {
        return res.status(200).json("Product has been Added");
    })
})
})
}

async function calculate_score (data) {
 // write all the logic for calculating score
}


async function getImageScore(name, imgurl) {
 // Image scoring logic here!! 
const axios = require("axios");
const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/image/object_detection",
  headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjljMjE2YzgtYzI3Mi00YjFhLWExNDUtZTFiMzA4NDdiMWQ0IiwidHlwZSI6ImFwaV90b2tlbiJ9.DEUrNUrvb4AGs1dtKrBUvqoV_w2tzC7CdT0wYG5GyAU",
  },
  data: {
    providers: "amazon",
    file_url:  `https://nsut-backend-0f7548004ed1.herokuapp.com/links/iphone.png`,
    fallback_providers: "",
  },
}

}
module.exports = {
    getProducts,
    addProduct
}