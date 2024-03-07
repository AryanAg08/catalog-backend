const R1 = require("../models/2.product");
const jwt = require("jsonwebtoken");
async function getProducts (req,res) {
    const token=req.query.token;
    console.log(token);
    if(!token) return res.status(401).json("Not logged in!");
    jwt.verify(token,"secretkey",async(err,userInfo)=>{
            console.log(userInfo);
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
    console.log(req.body)
    const token=req.body.token;
    console.log(token);
    if(!token) return res.status(401).json("Not logged in!");
jwt.verify(token,"secretkey",(err,userInfo)=>{
    if(err) return res.status(403).json("Token is invalid");
    const products = req.body;
    products.property.forEach(async (product) => {
        console.log(product)
       console.log(userInfo.id)
       const Data = {
        desc: product.desc,
        location:  product.location,
        price: product.price,
        name: product.name,
        catalog: products.cataname,
        imgurl: product.imgURL
       };

       const Score = await calculate_score(Data);

    const RR2 = await R1.findOneAndUpdate({
        userid: userInfo.id,
        product_name:  product.name,
    },{
        catalog_name: products.cataname,
        product_name: product.name,
        product_price: product.price,
        userid: userInfo.id,
        product_quantity: product.desc,
        product_imgurl: product.imgURL,
        product_location: product.location,
        product_cat: product.category,
        Score: Score,
    },{
        upsert: true,
        new: true,
    }).then(() => {
        return res.status(200).json("Product has been Added");
    });
})
})
}

async function calculate_score (data) {
    // write all the logic for calculating score
  
    const score1 = await getImageScore(data.name, data.imgurl);
    console.log("data coming" + score1);
    let totalscore = 0; // Initialize totalscore to 0
  
    if (data.desc) totalscore += 3;
    if (data.location) totalscore += 4;
    if (data.name) totalscore += 1;
    if (data.imgurl) totalscore += 1;
    if (data.catalog) totalscore += 1;
    if (data.price) totalscore += 1;
    totalscore += score1;
  
    console.log("Final total score is" + totalscore);
    return totalscore ;
  }
  
// function getImageScore(name, imgurl) {
//  // Image scoring logic here!! 
// const axios = require("axios");
// const options = {
//     method: "POST",
//     url: "https://api.edenai.run/v2/image/object_detection",
//   headers: {
//     Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjljMjE2YzgtYzI3Mi00YjFhLWExNDUtZTFiMzA4NDdiMWQ0IiwidHlwZSI6ImFwaV90b2tlbiJ9.DEUrNUrvb4AGs1dtKrBUvqoV_w2tzC7CdT0wYG5GyAU",
//   },
//   data: {
//     providers: "amazon",
//     file_url:  imgurl,
//     fallback_providers: "",
//   },
// }

// axios.request(options)
// .then((response) => {
//     // get  object from response and check if it is an image
//     // console.log(response.data.amazon.items);
//     const length = response.data.amazon.items.reduce((a, obj) => a + Object.keys(obj).length, 0) / 6;
//     var namescore = 8;
//     let confidence = 0;
//     let totalscore = 0;

//     response.data.amazon.items.forEach(obj => {
//         // console.log("Label:", obj.label);
//         // console.log("Confidence:", obj.confidence);
//         if (obj.label == name) {
//                     namescore = 15;
//                 }
//                 confidence = confidence + obj.confidence;
//       });

//     const totalconfidence = Math.round(confidence * 10) / 10;

//     console.log( "this is " + totalconfidence/length);
//     const a = totalconfidence / length; 
//        if (a > 0.50) {
//         console.log(a);
//         totalscore += namescore + 10;
//        }
//        else {
//         totalscore +=  namescore + 4;
//        }

//     console.log("Totalscore from last side"+totalscore);
      
//     return totalscore;
// })

// }

function getImageScore(name, imgurl) {
    return new Promise((resolve, reject) => {
        const axios = require("axios");
        const options = {
            method: "POST",
            url: "https://api.edenai.run/v2/image/object_detection",
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjljMjE2YzgtYzI3Mi00YjFhLWExNDUtZTFiMzA4NDdiMWQ0IiwidHlwZSI6ImFwaV90b2tlbiJ9.DEUrNUrvb4AGs1dtKrBUvqoV_w2tzC7CdT0wYG5GyAU",
            },
            data: {
                providers: "amazon",
                file_url: imgurl,
                fallback_providers: "",
            },
        };

        axios.request(options)
            .then((response) => {
                // get object from response and check if it is an image
                // console.log(response.data.amazon.items);
                const length = response.data.amazon.items.reduce((a, obj) => a + Object.keys(obj).length, 0) / 6;
                var namescore = 8;
                let confidence = 0;
                let totalscore = 0;

                response.data.amazon.items.forEach(obj => {
                    // console.log("Label:", obj.label);
                    // console.log("Confidence:", obj.confidence);
                    if (obj.label == name) {
                        namescore = 15;
                    }
                    confidence = confidence + obj.confidence;
                });

                const totalconfidence = Math.round(confidence * 10) / 10;

                console.log("this is " + totalconfidence / length);
                const a = totalconfidence / length;
                if (a > 0.50) {
                    console.log(a);
                    totalscore += namescore + 10;
                }
                else {
                    totalscore += namescore + 4;
                }

                console.log("Totalscore from last side" + totalscore);

                resolve(totalscore); // Resolve with the totalscore value
            })
            .catch((error) => {
                reject(error); // Reject with the error if any
            });
    });
}

module.exports = {
    getProducts,
    addProduct,
    getImageScore
}