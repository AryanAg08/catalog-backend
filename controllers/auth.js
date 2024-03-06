const R1 = require("../models/1.auth");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

 async function register (req,res) {
        const username = req.body.username;
        console.log(req.body);
         const RR1 = await R1.findOne({
          username
         })

         if (RR1) {
          return res.status(409).send("User already exists!");
         }
        
        const salt=bcrypt.genSaltSync(10);
  const hashPassword=bcrypt.hashSync(req.body.password,salt)
   // insert data
  const RRRR = await R1.findOneAndUpdate({
    username,
    email: req.body.email
   },{
    username,
    email: req.body.email,
    password: hashPassword,
    name: req.body.name
   },{
    new: true,
    upsert: true,
   }).then((data) => {
    console.log(data);
    return res.status(200).json(data);

   })

 
  

}
async function login (req,res) {
  const username = req.body.username;

  const RR1 = await R1.findOne({
    username
   })

   if (!RR1) {
    return res.status(409).send("User not found!");
   }
   else {
    console.log("user is available");
    console.log(await RR1);
    // for (qq of RR1) {
         
      const checkPassword=bcrypt.compareSync(req.body.password,RR1.password)
      if(!checkPassword) return res.status(400).json("Wrong password or username!")
      console.log(RR1._id);
      const token=jwt.sign({id:RR1._id},"secretkey")
      console.log(token);
      const Total = {
        RR1,
        token: `${token}`
      }
    const{password,...others}= RR1;
    res.cookie("accessToken",token,{
      HttpOnly:true,  
    }).status(200).json(Total);
    }
    // }
 
}
async function logout (req,res) {
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json("User Logged Out")
}

module.exports = {
  login,
  logout,
  register
}