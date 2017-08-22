/*
* Config proxy
*/
let request = require('request');

function setupProxy(app) {
  app.post("/api/*", function(req,res) {
    //modify the url in any way you want
    var newurl = 'http://localhost:9001' + req.originalUrl;
    req.pipe(request.post(newurl, { json: true, body: req.body }), { end: false }).pipe(res);
  });

  app.get("/api/*", function(req,res) {
    console.log('req.originalUrl', req.originalUrl)
    //modify the url in any way you want
    var newurl = 'http://localhost:9001' + req.originalUrl;
    request.get(newurl).pipe(res);
  });

}

module.exports = {
  setupProxy
}
