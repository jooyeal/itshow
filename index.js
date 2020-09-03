const http = require("http");
const url = require("url");
const qs = require("querystring");
const template = require("./lib/template.js");

const app = http.createServer(function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathName = url.parse(_url, true).pathname;
    const html = template.html();
    if (pathName === "/") {
        response.writeHead(200);
        response.end(html);
    } else if (pathName === "/style.css") {
        response.writeHead(200);
        response.end();
    } else {
        response.writeHead(404);
        response.end();
    }

});

app.listen(3000);