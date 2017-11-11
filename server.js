var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var router = express.Router();
var router2 = express.Router();

var server = express();
var webAddr = "";
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.get("/",function(req,res){
  res.send("hello world");
  
});
server.get("/wiki/:pr",function(req,res){
  console.log(webAddr+"/wiki/"+req.params["pr"]);
request(webAddr+"/wiki/"+req.params["pr"],function(error,response,body){
  res.send(body);
});
});

router.use(function(req, res, next) {
  request(webAddr+"/w"+ req.url,function(error,response,body){
  res.send(body);
});
});

server.use('/w', router);

router2.use(function(req, res, next) {
  console.log('%s %s %s', webAddr, req.url);
  request(webAddr+"/static"+ req.url,function(error,response,body){
  res.send(body);
});
});

server.use('/static', router2);



server.post("/search",function(req,res){
  console.log(req.body.addr);
  webAddr="https://"+req.body.addr.match(/:\/\/(?:www\.)?(.[^/]+)(.*)/)[1];
request(req.body.addr,function(error,response,body){
  res.send(body);
});

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");