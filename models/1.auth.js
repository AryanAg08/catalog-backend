const mongo = require("mongoose");

const R = {
    type: String,
    required: true,
};

const auths = new mongo.Schema({
    username: R,
    email: R,
    password: R,
    name: R,
});

module.exports = mongo.model("1)Auth", auths);