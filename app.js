const express = require("express");
const showdown = require("showdown");
const path = require("path");
var bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
exports.ios = io
app.use(bodyParser.urlencoded({ extended: true }));
var session = require("express-session");
var cors = require('cors');
const mongoose = require("mongoose");
let Users = {};
let uniqueList = [];
  let dupList = []
let SheetAnswer = [];
let sheetArray = [];
const ipaddr = require('ipaddr.js');
const duplicates = require('find-array-duplicates');
let onlineSocket = require('./server');
let quest = require("./models/question");
var filter = require("object-loops/filter");
var forEach = require("object-loops/for-each");
var findKey = require("object-loops/find-key");
var find = require("object-loops/find");
const axios = require("axios");

serverConfig = { current_Q: null, status: "pending", now: 0, send_q: true, rewards: 1000, endedGame: false, startGame: false, totalPlayers: 0 };
const converter = new showdown.Converter();
let ids = -1;

app.set('trust proxy', true)
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors())

app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------



Array.prototype.contains = function(item){
  let filtered_item = this.filter((i) => {
    return i.ip === item.ip
  });
  return !!filtered_item.length;
}

function contains(list, item){
  let filtered_item = list.filter((i) => {
    return i.ip === item.ip
  });
  return !!filtered_item.length;
}

function pushToUniqueList(item){
  if(!uniqueList.contains(item)) uniqueList.push(item);
}

function pushToDuplicateList(item){
  if(!dupList.contains(item)) dupList.push(item);
}
// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
const run = async () => {
  await mongoose.connect("mongodb+srv://admin:123123a@cluster0.75inu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });
};
run();

const runn = async () => {
  let url = "https://docs.google.com/spreadsheets/d/1upHj9wrMYfieNLL5idW4U_i7DJCzkjaAuyEA1WuDKLQ/gviz/tq?";

  let x = await axios.get(url);

  return x;
};
runn();
app.use("/", require("./routes/index.js"));

// ---------------------------------------------------------------------------
// Socket Events
// ---------------------------------------------------------------------------

/*
(lol  = async function(){
  let tt = await getQuestion()
  console.log(secretqands)

  return tt
})();
*/
let secretqands;
/*
let secretqands =   {
    questions: [
        { question: "Which is the capital of india?", choices: ["New delhi", "Mumbai", "Banglore", "Mysore"], correctAnswer: 0 },
        { question: "Total number of states in India", choices: ["27", "28", "29", "30"], correctAnswer: 0 },
        { question: "Current President of India?", choices: ["Pranab Mukherjee", "Pratibha Patil", "Narendra modi", "Manmohan singh"], correctAnswer: 0 },
        { question: "Current Prime Minister of India?", choices: ["Pratibha Patil", "Pranab Mukherjee", "Manmohan singh", "Narendra modi"], correctAnswer: 0 },
    ],
};
*/
let detectip = [];
let dumppip =[]
 async function joinRoom(socket, sockid, rId, secretCode) {
     let getClient = await getClientIp(socket.handshake.address,socket.id)
  if (serverConfig.status == "ongoing") io.to(socket.id).emit("console", "Sorry you are elemented server running");
  //console.log(getClient);
  Users[socket.id] = {
    seceret: secretCode,
    sockId: sockid,
    ip: getClient.geoplugin_request,
    status: "pending",
    userId: rId,
    elemented: serverConfig.status == "ongoing" ? true : false,
    login: false,
    username: null,
    correct: false,
    banned: false,
    remark: getClient.geoplugin_city,
    scan: {checked:false,list:[]},
    platform: null,
    joinAt:+Date.now()
  };

  if (serverConfig.status == "waiting") {
    io.to(socket.id).emit("console", "fun and win are ready");
  } 
  if (serverConfig.status == "pending") {
    io.to(socket.id).emit("console", "Win and Fun is inactive now, follow our Discord page and community for more information");
  }
    

  console.log(Users)
}

function checkUser(uid) {
  for (client in Users) {
    if (Users[client].userId == uid) {
      return true;
    }
  }
  return false;
}

  async function getClientIp(ip,id) {
  let remoteAddress = ip;
console.log(remoteAddress)
  if (ipaddr.isValid(remoteAddress)) {
    const addr = ipaddr.parse(remoteAddress);
    if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
      remoteAddress = addr.toIPv4Address().toString();
    }
  }
/*
  let x =  axios.get(`http://www.geoplugin.net/json.gp?ip=${remoteAddress}`).then((value) => {
    Users[id].remark = value.data.geoplugin_city
    //Users[id].ip = remoteAddress

  });
  */
  let x = await axios.get(`http://www.geoplugin.net/json.gp?ip=${remoteAddress}`)


  //console.log(x.data)
  return  x.data
}


io.on("connection", (socket) => {
  //console.log(`[ server.js ] ${socket.id} connected`);
  let secretCode = (Math.random() + 1).toString(36).substr(2, 5);

  socket.on("message", function(data, callback) {
    if (data.event === "connected" && data.data.socketId) {
      joinRoom(socket, data.data.socketId, data.data.userId, secretCode);
    }
  });

  socket.on("disconnect", () => {
    console.log(`[ server.js ] ${socket.id} disconnected`);
    delete Users[socket.id];
  });
});

function updateSlide(markdown) {
  io.emit("update slide", converter.makeHtml(markdown));
}

async function getQuestion() {
  let showrep = await quest.find({});
  secretqands = showrep[0];
  return showrep[0];
}

async function loadQuestion() {
  let url =
    "https://script.googleusercontent.com/macros/echo?user_content_key=kcIDAy8bL0JKN9mx9U9T252IUC4nR41_b941D39X98zQ_EbsyUdKCanHXkowFaWjezLemE6R4PFoFgsYQiBbMBuyg2YWmO2bm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnO5P2dJ-F7rvSKj8nJ4y7EV_2pJfKjJyzQNqLZHHvnUvV1XGX0E4OKknDf5CUZho0bP349F4U6GJFpoLHUiYlTRG3aoj3Q0zttz9Jw9Md8uu&lib=M5n70OiFqeggbPgT6N8ExVMiMCzF4OkDw";

  let mea = {};

  let quest = [];

  let x = await axios.get(url);

  x.data.user.forEach((main) => {
    console.log(main);

    let obj = { question: main.QUESTION, choices: [main.MCQ1, main.MCQ2, main.MCQ3, main.MCQ4], correctAnswer: main.CORRECT };

    quest.push(obj);

    console.log("----------");
  });

  mea.questions = quest;
  secretqands = mea;
}

function updateMessage(data) {
  io.emit("update message", converter.makeHtml(markdown));
}

function runquiz(data) {
  serverConfig.status = "waiting";
  for (client in Users) {
    Users[client].status = "waiting";
  }
  loadQuestion();
  io.emit("START QUEST", { q: Users.length });
}

function sendQuest(data, mcq) {
  serverConfig.now = new Date().getTime() + 11000;
  serverConfig.status = "ongoing";
  if (serverConfig.startGame == false) {
    serverConfig.totalPlayers = filtterRewards().length;
    serverConfig.startGame = true;
  }

  io.emit("RECIVE QUEST", { q: data, mcq: mcq });

  setTimeout(function() {
    console.log("boo");
    checkClientAnsers(secretqands.questions[ids].correctAnswer, ids);

    updateStatusCount()

  }, 11000);
}

      setInterval(async function () {
    let obj = {}
  let x = await axios("http://65.108.101.89:26064/status-json.xsl")
         
  
  if (!x.data.icestats.source){
      obj.status = false
   return  io.emit("musics", obj);
  }
  if (x.data.icestats.source && x.data.icestats.source.length >0) {
      obj.status = true
      obj.link = x.data.icestats.source[0].listenurl
   io.emit("musics", obj);
  }else{
      obj.status = true
      obj.link = x.data.icestats.source.listenurl
        io.emit("musics", obj);
  }
          
}
            , 5000);


setInterval(function () {
 uniqueList = [];
   dupList = []
 

  let rwd = filtterRewards(Users);
 
 

  


 
  for (let i = 0; i < rwd.length; i++) {
    if (uniqueList.contains(rwd[i])) {
      console.log("0000", i)
      pushToDuplicateList(rwd[i]);
      Users[rwd[i].sockId].banned = true;
Users[rwd[i].sockId].scan.list.push(uniqueList[uniqueList.map(x => x.ip).indexOf(rwd[i].ip)])
      // Users[rwd[i].sockId].remark ="Duplicate identity found ID:"+ uniqueList[t++].userId +"-"+ uniqueList[t++].ip

    } else {
      // Users[rwd[i].sockId].scan.list = []
      pushToUniqueList(rwd[i]);
    }
  }
 
   var filteredObj = filter(Users, function(val, key, obj) {
    return val.elemented == false && val.login == true && val.banned == false;
  });

    var filteredBan = filter(Users, function(val, key, obj) {
    return  val.banned;
  });

  let objec = {};
  objec.data = uniqueList;
  objec.totalWin = Object.keys(filteredObj).length;
  objec.adminUsers = Users
  objec.banned = filteredBan
  objec.Unique = filteredObj


  


  io.emit("api", objec);
}
            , 1000);


function RECEVIE_ANS(data) {
  //console.log("!!!!!", io.engine.clients);
  // io.emit("RECIVE ANS", data);
}

function updateStatusCount() {
  let c_count = filtterRewards().length

  io.emit("StatusCount", { current: c_count, total: serverConfig.totalPlayers });
}

function shutdown(data) {
  serverConfig.status = "pending";

  for (var i in Users) {
    Users[i] = {
      status: "pending",
      userId: null,
      elemented: serverConfig.status == "ongoing" ? true : false,
      login: false,
      username: null,
      correct: false,
      banned: false,
      platform: null,
    };
  }

  serverConfig = { current_Q: null, status: "pending", now: 0, send_q: true, rewards: null, endedGame: false };

  SheetAnswer = [];
  sheetArray = [];
  ids = -1;
  io.emit("console", "Win and Fun is inactive now, follow our Discord page and community for more information");
    
    io.emit("shutdown", true);
    
}

function sendANS(data) {
  //console.log("!!!!!", io.engine.clients);

  console.log("SheetAnswer", SheetAnswer);
  let ans = revalAnswer();

  io.emit("SHOW ANSWER", ans);

  for (const x of ans.correct) {
    console.log(x);
    io.to(x.ClientID).emit("FAIL", "WRONG!");
  }
}

function sendrewards(data) {
  //console.log("!!!!!", io.engine.clients);

  //  console.log("SheetAnswer", data);
  console.log(Math.floor(data.length));
  console.log(Math.floor(serverConfig.rewards));
  console.log(Math.floor(serverConfig.rewards / data.length));

  let winnersrewrds = Math.floor(serverConfig.rewards / data.length);

  io.emit("SEND REWARD", data);

  for (const x of data) {
    //console.log(x);
    io.to(x.sockId).emit("WINNER", { msg: "CONGRATULATIONS!", cash: winnersrewrds });
  }
}
// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

app.get("/funandwin/join/:id/:pf/:sockId", async (req, res) => {
  console.log(req.params);
  let id = req.params.id;
  let sockid = req.params.sockId;
  let pf = req.params.pf;

  let data = {};
  if (!id || !sockid || !pf) {
    data.result = "ERROR";
    data.message = "Error!";
    return res.send(data);
  }
  if (serverConfig.status != "waiting") {
    data.result = "ERROR";
    data.message = "Fun and Win is not available! Try again in a few moment.";
    return res.send(data);
  }
  let listUser = await  axios.get(`http://65.108.101.89:11164/users`);
  console.log(listUser.data)
  if (JSON.stringify(listUser.data) === '{}' || !listUser.data.location){
      data.result = "ERROR";
    data.message = "Wait Hosting ...";
    return res.send(data);
  }
   let index = listUser.data.users.map(i => i.id).indexOf(id);
 if(index<0){
    data.result = "ERROR";
    data.message = `انت غير متواجد في ${listUser.data.location} رجاء التوجهه الى هناك`;
    return res.send(data);
 }
console.log(index);
      let checklog = await checkLogin(id, pf);
   if (checklog.result) {
      data.result = "ERROR";
      data.message = "Error!: already joined with: " + checklog.id + "[" + checklog.pf + "]";
      return res.send(data);
    }
         let getClient = await getClientIp(req.ip,sockid)

/*
  let checkU = await userinfoGlobal(id, pf);

  if (checkU.STATUS) {
    let checklog = await checkLogin(id, pf);
    console.log(checklog);

    if (checklog.result) {
      data.result = "ERROR";
      data.message = "Error!: already joined with: " + checklog.id + "[" + checklog.pf + "]";
      return res.send(data);
    }
    blook username login*/
    Users[sockid].login = true;
    Users[sockid].userId = id;
    Users[sockid].platform = pf;
    Users[sockid].username = listUser.data.users[index].name;
    Users[sockid].ip =  getClient.geoplugin_request,
    console.log("NEW CLIENT ADDED:", Users[sockid]);

    data.result = "OK";
    data.username = listUser.data.users[index].name;


/*
  var notfound = forEach(Users, function (val, key, obj) {
    if (val.scan.checked== false && val.login){
  //  if (detectip.indexOf(val.ip)) >
   let x = detectip.findIndex(x => x.ip === val.ip)
console.log(x)
   // console.log(detectip)
    if (x==-1){
      obj[key].scan.checked = true
      console.log("PASS!")
      detectip.push(val)
    }else{
      obj[key].scan.checked = true
      obj[key].scan.list.push(detectip[x])
      dumppip.push(val)
      console.log("CATCH!")
      
    }
  
   } 
})
*/

  
    return res.send(data);
  /*
  } else {
    data.result = "ERROR";
    data.message = "Error!";
    return res.send(data);
  }
  */
});

app.get("/api/sheet", async (req, res) => {
   uniqueList = [];
   dupList = []
  /*
let q1 = SheetAnswer.sheet.filter((a) => a.answer == "0").length;
let q2 = SheetAnswer.sheet.filter((a) => a.answer == "1").length;
let q3 = SheetAnswer.sheet.filter((a) => a.answer == "2").length;
let q4 = SheetAnswer.sheet.filter((a) => a.answer == "3").length;
let objdata = {q1,q2,q3,q4}


var values = [
  { name: 'someName1' },
  { name: 'someName2' },
  { name: 'someName1' },
  { name: 'someName1' }
]
*/


  let fuck = [
    { sheet: [{ socketId: "OmKVIcEGMegk8D65AAAA", answer: "0" }] },
    { sheet: [{ socketId: "OmKVIcEGMegk8D65AAAA", answer: "1" }] },
    { sheet: [{ socketId: "OmKVIcEGMegk8D65AAAA", answer: "3" }] },
    { sheet: [{ socketId: "OmKVIcEGMegk8D65AAAA", answer: "2" }] },
  ];

  let rwd = filtterRewards(Users);
 
 

  


 
  for (let i = 0; i < rwd.length; i++) {
    if (uniqueList.contains(rwd[i])) {
      console.log("0000", i)
      pushToDuplicateList(rwd[i]);
      Users[rwd[i].sockId].banned = true;
Users[rwd[i].sockId].scan.list.push(uniqueList[uniqueList.map(x => x.ip).indexOf(rwd[i].ip)])
      // Users[rwd[i].sockId].remark ="Duplicate identity found ID:"+ uniqueList[t++].userId +"-"+ uniqueList[t++].ip

    } else {
      // Users[rwd[i].sockId].scan.list = []
      pushToUniqueList(rwd[i]);
    }
  }
  let xxc
  if (rwd.length > 0) {
    xxc = duplicates(rwd, 'ip').all()
  } else {
    xxc = []
  }
  
   var filteredObj = filter(Users, function(val, key, obj) {
    return val.elemented == false && val.login == true && val.banned == false;
  });

    var filteredBan = filter(Users, function(val, key, obj) {
    return  val.banned;
  });

  let objec = {};
  objec.data = uniqueList;
  objec.totalWin = Object.keys(filteredObj).length;
  objec.adminUsers = Users
  objec.banned = filteredBan
  objec.Unique = filteredObj
  objec.lol = xxc
  res.send(objec);
});

app.get("/api/updateSlide", (req, res) => {
  //console.log(`[ server.js ] GET request to 'api/updateSlide' => ${JSON.stringify(req.query)}`);

  const { markdown } = req.query;

  if (markdown) {
    updateSlide(markdown);
    res.status(200).send(`Received 'updateSlide' request with: ${markdown}\n`);
  } else {
    res.status(400).send("Invalid parameters.\n");
  }
});


app.get("/socket/ip", async (req, res) => {
  let remoteAddress = onlineSocket
//console.log(remoteAddress)
  res.json({
    remoteAddress,
  });
})

app.get("/api/ip", async (req, res) => {
  let remoteAddress = getClientIp(req.ip);

  res.json({
    remoteAddress,
  });
})

app.get("/api/sheets", async (req, res) => {
  //console.log(`[ server.js ] GET request to 'api/updateSlide' => ${JSON.stringify(req.query)}`);
  let url =
    "https://script.googleusercontent.com/macros/echo?user_content_key=kcIDAy8bL0JKN9mx9U9T252IUC4nR41_b941D39X98zQ_EbsyUdKCanHXkowFaWjezLemE6R4PFoFgsYQiBbMBuyg2YWmO2bm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnO5P2dJ-F7rvSKj8nJ4y7EV_2pJfKjJyzQNqLZHHvnUvV1XGX0E4OKknDf5CUZho0bP349F4U6GJFpoLHUiYlTRG3aoj3Q0zttz9Jw9Md8uu&lib=M5n70OiFqeggbPgT6N8ExVMiMCzF4OkDw";

  let mea = {};

  let quest = [];

  let x = await axios.get(url);

  x.data.user.forEach((main) => {
    console.log(main);

    let obj = { question: main.QUESTION, choices: [main.MCQ1, main.MCQ2, main.MCQ3, main.MCQ4], correctAnswer: main.CORRECT };

    quest.push(obj);

    console.log("----------");
  });

  mea.questions = quest;
  secretqands = mea;
  res.send(mea);
});

app.get("/api/shut-down", (req, res) => {
  //console.log(`[ server.js ] GET request to 'api/updateSlide' => ${JSON.stringify(req.query)}`);

  const { markdown } = req.query;

  shutdown(markdown);
  res.status(200).send(`Received 'shut-down' request with: ${markdown}\n`);
});

app.get("/api/new-quest", (req, res) => {
  //console.log(`[ server.js ] GET request to 'api/new-quest' => ${JSON.stringify(req.query)}`);
  console.log(ids);
  if (!secretqands) {
    return res.send("Q not loaded please re run a app");
  }
  console.log(secretqands.questions.length);
  const data = req.query;
  console.log(secretqands.questions.length);
  if (secretqands.questions.length < ids + 2) {
    return res.send("Q Finished please send a reward to players");
  }

  if (serverConfig.now > new Date().getTime()) {
    return res.send("wait " + (serverConfig.now - new Date().getTime()) / 1000);
  }

  ids++;

  sheetArray = [];

  let cueentq = secretqands.questions[ids].question;
  let mcq = secretqands.questions[ids].choices;
  secretqands.questions[ids].timestap = new Date().getTime() + 10000;
  if (data) {
    sendQuest(cueentq, mcq);
    res.status(200).send(`Received 'updateSlide' request with: ${data}\n`);
  } else {
    res.status(400).send("Invalid parameters.\n");
  }
});

app.get("/api/client-ans", (req, res) => {
  let data = {};
  //console.log(`[ server.js ] GET request to 'api/client-ans' => ${JSON.stringify(req.query)}`);
  //console.log(secretqands.questions[ids]);
  const params = req.query;
  let clientanswered = req.query.myans.replace("mcq_", "");
  console.log(clientanswered);
  let ts = new Date().getTime();
  if (ts > secretqands.questions[ids].timestap) {
    data.result = "ERROR";
    data.message = "TIME OUT";
    return res.send(data);
  }

  if (Users[req.query.id]["q_" + ids] == ids) {
    data.result = "ERROR";
    data.message = "Already answered";
    return res.send(data);
  }
  Users[req.query.id]["q_" + ids] = ids;
  Users[req.query.id]["q_mcq" + ids] = clientanswered;

  if (secretqands.questions[ids].correctAnswer != clientanswered) {
    Users[req.query.id].elemented = true;
    Users[req.query.id].correct = false;
    console.log("USERS ELEMNTED ACTION");
  } else {
    Users[req.query.id].correct = true;
  }
  sheetArray.push({ socketId: req.query.id, answer: clientanswered, elemented: Users[req.query.id].elemented, correct: Users[req.query.id].correct, ip: Users[req.query.id].ip });
  SheetAnswer[ids] = {
    sheet: sheetArray,
  };

  if (data) {
    RECEVIE_ANS(data);
    data.result = "OK";
    data.message = "";
    return res.send(data);
  } else {
    res.status(400).send("Invalid parameters.\n");
  }
});

app.get("/api/send-Rewards", (req, res) => {
  //console.log(`[ server.js ] GET request to 'api/new-quest' => ${JSON.stringify(req.query)}`);
  /*
if ids == length its ok 
*/
  let sr = filtterRewards();
  const data = req.query;
  if (data) {
    sendrewards(sr);
    res.status(200).send(`Received 'updateSlide' request with: ${data}\n`);
  } else {
    res.status(400).send("Invalid parameters.\n");
  }
});

app.get("/api/send-answer", (req, res) => {
  //console.log(`[ server.js ] GET request to 'api/new-quest' => ${JSON.stringify(req.query)}`);
  /*
if ids == length its ok 
*/
  if (secretqands.questions.length < ids + 1) {
    return res.send("Answers Finished please send a reward to players");
  }

  if (serverConfig.now > new Date().getTime()) {
    return res.send("wait " + (serverConfig.now - new Date().getTime()) / 1000);
  }

  const data = req.query;
  if (data) {
    sendANS(secretqands.questions[ids].correctAnswer);
    res.status(200).send(`Received 'updateSlide' request with: ${data}\n`);
  } else {
    res.status(400).send("Invalid parameters.\n");
  }
});

app.get("/api/run-quiz", (req, res) => {
  //console.log(`[ server.js ] GET request to 'api/run-quiz' => ${JSON.stringify(req.query)}`);
  /*
if ids == length its ok 
*/
  const data = req.query;
  if (data) {
    runquiz(data);
    res.status(200).send(`Received 'updateSlide' request with: ${data}\n`);
  } else {
    res.status(400).send("Invalid parameters.\n");
  }
});

/*
(!Users[client]["q_" + current_q] == undefined || Users[client]["q_" + current_q] != answer || !Users[client].login)
*/
function checkClientAnsers(answer, current_q) {
  console.log("checked1:", answer);
  console.log("checked2:", current_q);
  for (client in Users) {
    console.log(Users[client]["q_mcq" + current_q] == answer && Users[client].login);
    if (Users[client]["q_mcq" + current_q] == answer && Users[client].login) {
      console.log("OK");
    } else {
      Users[client].elemented = true;
      Users[client].correct = false;

    }
  }
}

function filtterAnsers(array, current_q) {
  let pushtemp = [];
  for (var i = 0; i < array.length; i++) {
    var cube = array[i].sheet;
    for (var j = 0; j < cube.length; j++) {
      if (i == current_q) {
        pushtemp.push({ ClientID: cube[j].socketId, ANS: cube[j].answer, elemented: cube[j].elemented, correct: cube[j].correct, ip: cube[j].ip });
      }
      console.log("fuck[" + i + "][" + j + "] = " + cube[j].socketId);
    }
  }

  return pushtemp;
}

function filtterRewards() {
  let pushtemp = [];
  for (i in Users) {
    if (!Users[i].elemented && !Users[i].banned   && Users[i].login && Users[i].userId && Users[i].platform) {
      pushtemp.push(Users[i]);
    }
  }
  return pushtemp;
}

async function userinfoGlobal(id, pf) {
  let output = {};
  let result;
  try {
    if (pf != "FB") {
      result = await axios.get(`http://api-b.darkness-project.com/service/user/info?userId=${id}`);
    } else {
      result = await axios.get(`http://api-fb.darkness-project.com/service/user/info?userId=${id}`);
    }
    output = await result.data;
    output.STATUS = result.data.result == "OK" ? true : false;
    return output;
  } catch (error) {
    output.STATUS = false;
    return output;
  }
}

async function checkLogin(id, pf) {
  let data = {};
  for (var client in Users) {
    if (Users[client].login && Users[client].userId == id && Users[client].platform == pf) {
      data.result = true;
      data.id = Users[client].userId;
      data.pf = Users[client].platform;
      return data;
    }
  }
  return false;
}

function revalAnswer() {
  let xnx = filtterAnsers(SheetAnswer, ids);
  var hasDuplicate = false;
  xnx.map((v) => v.ANS)
    .sort()
    .sort((a, b) => {
      if (a === b) hasDuplicate = true;
    });
  console.log("hasDuplicate", hasDuplicate);
  let data = {};
  data.hasDuplicate = hasDuplicate;
  data.mq1 = 0;
  data.mq2 = 0;
  data.mq3 = 0;
  data.mq4 = 0;
  let result = xnx.filter((word) => word.correct == false);
  var filteredObj = filter(Users, function(val, key, obj) {
    return val.elemented == false && val.login == true;
  });
  console.log("dddddddd", filteredObj);

  data.data = xnx;
  data.correct = result;
  data.answer = secretqands.questions[ids] ? secretqands.questions[ids].correctAnswer : null;
  data.totalWin = Object.keys(filteredObj).length;
  for (var i = 0; i < xnx.length; i++) {
    if (xnx[i].ANS == 0) {
      data.mq1 = data.mq1 + 1;
    } else if (xnx[i].ANS == 1) {
      console.log("added?");
      data.mq2 = data.mq2 + 1;
    } else if (xnx[i].ANS == 2) {
      data.mq3 = data.mq3 + 1;
    } else {
      data.mq4 = data.mq4 + 1;
    }
  }

  return data;
}



server.listen(11164, "0.0.0.0", () => {
  console.log("listening on *:3000");
});

