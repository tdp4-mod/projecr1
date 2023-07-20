const express = require("express");
const app = express();
const port = 11164;
let socket = require("./src/commands/annoucment.js");
let obj = {};
let users = [];
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

app.get("/", async (req, res) => {
    let xxx = JSON.stringify({ type: "getOnline" });
    obj.users = [];
    socket.write(xxx);
    
setTimeout(() => {
        res.send(obj);
}, "1000")

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

process.on("unhandledRejection", (reason, p) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
    console.log(" [antiCrash] :: Multiple Resolves");
    console.log(type, promise, reason);
});
