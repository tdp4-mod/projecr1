const express = require("express");
const router = express.Router();
var session = require("express-session");
const ai = require("../data/ai");
let {ios} = require("../app.js");
let {client} = require("../src/commands/annoucment.js");
let socket = client
let obj = {};
const axios = require("axios");
let users = [];
var cors = require('cors');
router.use(cors())
console.log("------------------")


router.get('/', (req, res) => {
  res.render("show");
});

router.get('/api/test', (req, res) => {
  res.send("OK");
});
router.get('/api/icecast2', async (req, res) => {
    let obj = {}
      let x = await axios("http://65.108.101.89:26064/status-json.xsl")

  
  if (!x.data.icestats.source){
      obj.status = false
   return res.json(obj)   
  }
  if (x.data.icestats.source && x.data.icestats.source.length >0) {
      obj.status = true
      obj.link = x.data.icestats.source[0].listenurl
  res.send(obj)
  }else{
      obj.status = true
      obj.link = x.data.icestats.source.listenurl
        res.send(obj)
  }
  


});


router.get('/edit', (req, res) => {
  res.render("edit");
});

router.get('/admin', (req, res) => {
  res.render("admin");
});

router.get('/cheer', (req, res) => {
 
  let obj = {
"cl1":{
     pos:"34 40",name:"احمر"},
    "cl2":{pos: "38 46",name:"اصفر"},
    "cl3":{pos: "38 46",name:"اخضر"},
    "cl4":{pos: "38 46",name:"ازرق"}
    ,
    arr:["red","red","red","red"]
  }
  var re = new RegExp(obj.cl1.name + "|" + obj.cl2.name + "|" + obj.cl3.name+ "|" +obj.cl4.name, 'g');

  console.log(re)
  obj.arr = [obj.cl1.name,obj.cl2.name,obj.cl3.name,obj.cl4.name,]
  obj.rege = re
  //console.log(Object.keys(obj));
   let xxx = JSON.stringify({ type: "cheer", data: obj });
  //console.log(Object.keys(obj));

socket.write(xxx)
  res.send(obj)
});

router.get('/brad',async (req, res) => {
  
   var PROMPT = req.query.id;
  if (!PROMPT){
    return res.send('Hello World!')
  }
    let x = await ai.brad(PROMPT)
    res.send(x)
});



 socket.on("data", async function (data) {
       
       
        let rec = JSON.parse(data);
        if (rec.type == "getUser") {
            //console.log("getUser");
            users = [];
            rec.data.map((item) => {
                users.push(item);
            });
           obj.users = users
           obj.location = rec.location
        }
     
     

    });

router.get("/users", async (req, res) => {
    let xxx = JSON.stringify({ type: "getOnline" });
    obj.users = [];
    socket.write(xxx);
    
setTimeout(() => {
        res.send(obj);
}, "1000")

});
module.exports = router;