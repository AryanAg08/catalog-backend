// import { db } from "../connect.js";
const jwt = require("jsonwebtoken");

async function getUser (req, res)  {
  const userId = req.params.userId;
  const q = "SELECT * FROM user WHERE id=?";

  // // db.query(q, [userId], (err, data) => {
  // //   if (err) return res.status(500).json(err);
  // //   const { password, ...info } = data[0];
  // //   return res.json(info);
  // });
};

module.exports = {
  getUser
}