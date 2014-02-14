static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./bower_components/history');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(4000);
