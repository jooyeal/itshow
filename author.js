var template = require("./template.js");
var qs = require("querystring");
var db = require("./db.js");
var url = require("url");


exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, function (err, topics, fields) {
        db.query(`SELECT * FROM author`, function (err2, authors) {
            var title = "Welcome";
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            var list = template.list(topics);
            var html = template.html(
                title,
                list,
                `<form action="author/create_process" method="post">
                    <p>    
                        <input type="text" name ="name" placeholder = "name"/>
                    </p>
                    <p>    
                        <textarea name ="profile" placeholder= "description"></textarea>
                    </p>
                    <p>
                        <input type="submit"/ value="create">
                    </p>
                    
                </form>`,
                template.authorTable(authors)
            );

            response.writeHead(200);
            response.end(html);
        });

    });
}

exports.createAuthorProcess = function (request, response) {
    var body = "";
    request.on("data", function (data) {
        body += data;
    });
    request.on("end", function () {
        var post = qs.parse(body);
        db.query(
            `
        INSERT INTO author (name, profile) VALUES(?, ?)`,
            [post.name, post.profile],
            function (err, result) {
                if (err) throw err;
                response.writeHead(302, {
                    location: `/author`,
                });
                response.end();
            }
        );
    });
}

exports.update = function (request, response) {
    db.query(`SELECT * FROM topic`, function (err, topics) {
        if (err) throw err;
        db.query(`SELECT * FROM author`, function (err2, authors) {
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function (err3, author) {
                var title = "Welcome";
                var list = template.list(topics);
                var html = template.html(
                    title,
                    list,
                    `${template.authorTable(authors)}
                    <form action="/author/update_process" method="post">
                <input type = "hidden" name="id" value ="${queryData.id}"/>
                <p>    
                    <input type="text" name ="name" value = "${author[0].name}" placeholder = "name"/>
                </p>
                <p>    
                    <textarea name ="profile" placeholder= "description">${author[0].profile}</textarea>
                </p>
                <p>
                    <input type="submit" value="update"/>
                </p> 
                </form>`, ``


                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.updateAuthorProcess = function (request, response) {
    var body = "";
    request.on("data", function (data) {
        body += data;
    });
    request.on("end", function () {
        var post = qs.parse(body);
        db.query(
            "UPDATE author SET name=?, profile=? WHERE id=?",
            [post.name, post.profile, post.id],
            function (err, result) {
                if (err) throw err;
                response.writeHead(302, {
                    location: `/author`,
                });
                response.end();
            }
        );
    });
}

exports.deleteProcess = function (request, response) {
    var body = "";
    request.on("data", function (data) {
        body += data;
    });
    request.on("end", function () {
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function (err, result) {
            if (err) throw err;
            db.query(`DELETE FROM author WHERE id=?`, [post.id], function (
                err2,
                result2
            ) {
                if (err2) throw err2;
                response.writeHead(302, {
                    Location: `/author`,
                });
                response.end();
            });
        });

    });
}