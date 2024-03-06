const mongo = require("mongoose");

const catalog = new mongo.Schema({
    catalog_name: {
        type: String,
        required: true,
    }
});

module.exports = mongo.model("3)Catalog", catalog);