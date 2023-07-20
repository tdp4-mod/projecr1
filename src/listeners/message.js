let {client} = require("../commands/annoucment.js");
let websock = client
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook("https://discord.com/api/webhooks/1113874161140518973/R9CNjXduk8tS3Eb9q_c_mSwiUAG29W3IoIR8MT_-k1JnNzPWyrTgdwjbd2ZX7mnh10EC");

websock.on("data", function (data) {
    try {
        console.log("[Ann Js]: " + data);
        data = JSON.parse(data);

        if (data.type == "chat") {
         

            hook.send(`**${data.name}** [\`${data.etc.id}]\` **:** ${data.data}`);
        }
       
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    name: "message",
    exec: async (client, msg) => {
        if (!msg.guild) return;
        if (msg.author.bot) return;     
   if (msg.channel.id == "1109973262978531411" ) {
     let xxx = JSON.stringify({ type: "bot", data: msg.content.split(/ +/g).join(" ") });
            websock.write(xxx);   
    }
        const prefix = msg.content.toLowerCase().startsWith(client.prefix) ? client.prefix : `<@!${client.user.id}>`;
        if (!msg.content.toLowerCase().startsWith(prefix)) return;
    

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
        if (command) {
            try {
                await command.exec(msg, args);
            } catch (e) {
                console.error(e);
            }
        }
    }
};
