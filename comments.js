// Create web server
// Run the server
// Open the browser

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments.js');

var server = http.createServer(function(req, res) {
  var urlParts = url.parse(req.url);
  if (urlParts.pathname === '/add-comment') {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      comments.addComment(JSON.parse(data));
      res.writeHead(200);
      res.end();
    });
  } else if (urlParts.pathname === '/get-comments') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments.getComments()));
  } else {
    var filePath = path.join(__dirname, urlParts.pathname);
    var readStream = fs.createReadStream(filePath);
    readStream.on('error', function() {
      res.writeHead(404);
      res.end();
    });
    readStream.pipe(res);
  }
});

server.listen(8080);
console.log('Server listening on port 8080');