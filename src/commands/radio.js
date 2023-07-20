let radioAPI = 
[
  {ID:1,name:"إذاعة القران الكريم"},
  {ID:2,name:"راديو 9090"},
    {ID:3,name:"نغم اف ام"},
    {ID:4,name:"راديو شعبي"},
    {ID:5,name:"نجوم اف ام"},
]

const util = require("../util");

const getAttachmentURL = (msg) => (msg.attachments.first() || {}).url;

module.exports = {
    name: "radio",
    aliases: ["rd"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

        const missingPerms = util.missingPerms(msg.guild.me.permissionsIn(msg.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return msg.channel.send(util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`));

        if (!music.node || !music.node.connected)
            return msg.channel.send(util.embed().setDescription("❌ | Lavalink node not connected."));

        let query = args.join(" ") || getAttachmentURL(msg);
      console.log( query)
        if (!query) return msg.channel.send(util.embed().setDescription("❌ | Missing args."));
console.log( query.indexOf("اذاعة القران") >-1 )
      switch (true){
        case query.indexOf("1") >-1 : 
          query = "https://n08.radiojar.com/8s5u5tpdtwzuv"
          break
        case query.indexOf("2")>-1 :
                    query = "https://9090streaming.mobtada.com/9090FMEGYPT"
          break
        case query.indexOf("3")>-1 :
                              query = "https://ahmsamir.radioca.st/stream/1/"
          break
                  case query.indexOf("4")>-1 :
   query = "http://radio95.radioca.st/stream/1/"
          break

            case query.indexOf("5")>-1 :
   query = "https://audio.nrpstream.com/listen/nogoumfm/radio.mp3"
          break
           default:
    // code block
             query = ""        
      }
let msgObj =radioAPI.map((x, i) => `ID: \`${++i}.\` **${x.name}**`)



 if (!query) return msg.channel.send(util.embed().setDescription(msgObj));
        try {
            const { loadType, playlistInfo: { name }, tracks } = await music.load(util.isValidURL(query) ? query : `ytsearch:${query}`);
            if (!tracks.length) return msg.channel.send(util.embed().setDescription("❌ | Couldn't find any results."));
            
            if (loadType === "PLAYLIST_LOADED") {
                for (const track of tracks) {
                    track.requester = msg.author;
                    music.queue.push(track);
                }
                msg.channel.send(util.embed().setDescription(`✅ | Loaded \`${tracks.length}\` tracks from **${name}**.`));
            } else {
                const track = tracks[0];
                track.requester = msg.author;
                music.queue.push(track);
              if (music.player && music.player.playing)
                    msg.channel.send(util.embed().setDescription(`✅ | **${track.info.title}** added to the queue.`));
               
            }
            
            if (!music.player) await music.join(msg.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
