const mongo = require("mongoose");
 // product_id , product_name, product_category, product_price, userid, quantity, location, imgURL // product

 const product_info = new mongo.Schema({
    catalog_name: {
        type: String, 
        required: true,
    },
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    product_quantity: {
        type: String,
        required: true
    },
    product_imgurl: {
        type: String,
        required: true
    },
    product_location: {
        type: String,
        required: true
    },
    product_cat: {
        type: String,
        required: false,
    },
    Score: {
        type: String,
        required: true,
    }
 });

 module.exports = mongo.model("2)Product",  product_info); 