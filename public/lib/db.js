var mysql = require("mysql");
var db = mysql.createConnection({
    host: "13.209.9.116",
    user: "mk7700",
    password: "mk74",
    database: "itshow_project",
});
module.exports = db