const mongoose = require("mongoose");

var sentloggerSchema = new mongoose.Schema({
    quest:  {type: Object},
    qId:String,
  
            created: {type: Date, default: Date.now}


});


module.exports = mongoose.model("quest", sentloggerSchema);