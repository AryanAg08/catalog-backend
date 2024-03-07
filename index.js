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
const fs = require("fs");
const csv = require("csv-parser")
let fileuploadpath = "./public/uploads/"
// const { getImageScore } = require("./controllers/product.js");

app.use(logger("dev"));


app.use("/link", express.static(path.join(__dirname, "public/uploads")));

mongo.connect(process.env.mongo).then(() => {
    console.log("connected to mongo!!");
});

// const  userRoutes = require()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    // Access-Control-Allow-Origin: *,
    credentials: true,
}
))
app.use(cookiep())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
      const a = Date.now()+file.originalname
      fileuploadpath += a;
}
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
    const a = Date.now()+file.originalname
    fileuploadpath += a;
  }
});

const upload = multer({ storage: storage });
const upload2 = multer({ storage: storage2 });

app.use("/api/upload",upload.single("file"),(req,res)=>{
    const file=req.file;
    const catlog_name = req.name;
    console.log(file)
    res.status(200).send(file.filename)
})

// app.use("/api/upload/csv",upload2.single("file"),(req,res)=>{
//   const file=req.file;
//   const catlog_name = req.name;
//   console.log(file)
//   res.status(200).send(file.filename);

//   const files = req.file;

//   // Use csv-parser to parse the CSV file
//   const results = [];
//   fs.createReadStream(files.path)
//     .pipe(csvParser())
//     .on('data', (data) => {
//       results.push(data);
//     })
//     .on('end', () => {
//       // `results` now contains the parsed data from the CSV file
//       // res.json({ data: results });
//       console.log(results);
//     });
  
// })
app.use("/api/csv", upload2.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
   console.log("file recieved!!", req.file);

   const results = [];
   const filename = fileuploadpath;
   let totalScore = 0; // Initialize total score
   
   fs.createReadStream(filename)
     .pipe(csv())
    //  .on('headers', (headers) => {
    //   //  headers.forEach((header) => {
    //   //    csvSchema[header] = String;
    //   //  });
    //  })
     .on('data', async (data) => {
       results.push(data);
       // Calculate score for each item and add to total score
      
     })
     .on('end', async () => {
       console.log('CSV file data:');
       console.log(results);
       const score = await getImageScore(results[0].name, results[0].imgURL); // Assuming getTotalScore function is defined
       totalScore += score;
   
       // Log total score
       console.log('Total score:', totalScore);
       res.send(totalScore.toString());
     });
  
});

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials",true)
    next()
})

const userRoutes = require("./routes/users.js");
app.use("/api/users",userRoutes);
const authRoutes = require("./routes/auth.js");
app.use("/api/auth",authRoutes);
// const CommentRoutes = require("./routes/comments.js");
// app.use("/api/comments",CommentRoutes);
const postRoutes = require("./routes/product.js");
app.use("/api/product",postRoutes);
const likeRoutes = require("./routes/likes.js");
const { getImageScore } = require("./controllers/product.js");
app.use("/api/likes",likeRoutes);

// const axios = require("axios").default;
// const options = {
//   method: "POST",
//   url: "https://api.edenai.run/v2/image/object_detection",
//   headers: {
//     Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjljMjE2YzgtYzI3Mi00YjFhLWExNDUtZTFiMzA4NDdiMWQ0IiwidHlwZSI6ImFwaV90b2tlbiJ9.DEUrNUrvb4AGs1dtKrBUvqoV_w2tzC7CdT0wYG5GyAU",
//   },
//   data: {
//     providers: "amazon",
//     file_url:  `https://nsut-backend-0f7548004ed1.herokuapp.com/links/iphone.png`,
//     fallback_providers: "",
//   },
// };
// axios
//   .request(options)
//   .then((response) => {
//     // console.log(response.data);
//     console.log(response.data.amazon);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// getImageScore("Iphone", "https://nsut-backend-0f7548004ed1.herokuapp.com/links/iphone.png");

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `)
})


/**
 * 
 * {
   status: 'success',
   items: [
     {
       label: 'Electronics',
       confidence: 0.9999581909179688,
       x_min: null,
       x_max: null,
       y_min: null,
       y_max: null
     },
     {
     label: 'Mobile Phone',
       confidence: 0.9999581909179688,
       x_min: null,
       x_max: null,
       y_min: null,
       y_max: null
     },
     {
       label: 'Phone',
       confidence: 0.9999581909179688,
       x_min: null,
      x_max: null,
       y_min: null,
      y_max: null
     },
     {
       label: 'Iphone',
       confidence: 0.9966401672363281,
       x_min: null,
       x_max: null,
       y_min: null,
       y_max: null
     },
     {
       label: 'Disk',
       confidence: 0.9083155059814453,
       x_min: 0.1579134464263916,
       x_max: 0.8444782495498657,
       y_min: 0.04748363420367241,
       y_max: 0.9531964175403118
     }
   ],
   cost: 0.001
 }
 */