var mysql = require("mysql");
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dpvmdprtm1",
    database: "itshow_project",
});
db.connect();
module.exports = db;