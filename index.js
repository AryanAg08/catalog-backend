require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookiep = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 5001;
const mongo = require("mongoose");
const logger = require("morgan");
const path = require("path");
const multer = require("multer");

app.use(logger("dev"));


app.use("/links", express.static(path.join(__dirname, "public/uploads")));

mongo.connect(process.env.mongo).then(() => {
    console.log("connected to mongo!!");
});

// const  userRoutes = require()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })

const upload = multer({ storage: storage });

app.use("/api/upload",upload.single("file"),(req,res)=>{
    const file=req.file;
    console.log(file)
    res.status(200).json(file.filename)
})

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials",true)
    next()
})
app.use(express.json())
app.use(cors({
    origin:"*",
}
))
app.use(cookiep())
const userRoutes = require("./routes/users.js");
app.use("/api/users",userRoutes);
const authRoutes = require("./routes/auth.js");
app.use("/api/auth",authRoutes);
// const CommentRoutes = require("./routes/comments.js");
// app.use("/api/comments",CommentRoutes);
const postRoutes = require("./routes/product.js");
app.use("/api/product",postRoutes);
const likeRoutes = require("./routes/likes.js");
app.use("/api/likes",likeRoutes);

const axios = require("axios").default;
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
};
axios
  .request(options)
  .then((response) => {
    // console.log(response.data);
    console.log(response.data.amazon);
  })
  .catch((error) => {
    console.error(error);
  });

  /**
  {
  amazon: {
    status: 'success',
    items: [ [Object], [Object], [Object], [Object] ],
    cost: 0.001
  },
  google: { status: 'success', items: [ [Object] ], cost: 0.00225 },
  'eden-ai': {
    status: 'success',
    items: [ [Object], [Object], [Object], [Object], [Object] ]
  }
}

  */

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `)
})