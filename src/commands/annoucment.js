const util = require("../util");
const { MessageEmbed } = require("discord.js");

var Filter = require("bad-word-ar"),
    filter = new Filter("ar");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook("https://discord.com/api/webhooks/1105582291721400452/JcMDWip2WXADRwIGFSbfGpvkBnlTnd4bsyBb68Bzf0qWwglgUA7E0owQXdPf1Ozlidka");
//const hook = new Webhook("https://discord.com/api/webhooks/1024446137471619144/0y1H5-O9tGVw7WTTJZ4UXl9PFTCKP1CuS7w6nuhUC7WXlFW3MZYF1wljrrbdCkkXFZRk");

var net = require("net");
var client = new net.Socket();
client.connect(11453, "65.108.101.89", function () {
    console.log("Client Connected!\n");
});
let names = [];
let id = [];
function playersData(data) {
    console.log(data);
    names = [];
    id = [];
    if (data.data.length > 0) {
        data.data.forEach(function (player) {
            names.push(fixPlayerName(player.name));
            id.push(`${player.id}`);
        });
    } else {
        names.push("N/A");
        id.push("N/A");
    }

    return [names, id];
}

function fixPlayerName(name) {
    name = name.replace(/=/g, "≡"); // needed to not break the color in the 'players' code block
    if (name.length > 15) {
        return name.substring(0, 15);
        //return `${name.substring(0, 14)}…`;
    }
    return name;
}

client.on("data", function (data) {
    try {
        console.log("[Annoucment Js]: " + data);
        data = JSON.parse(data);

        if (data.type == "chat") {
            let arr = [];
            for (const [key, value] of Object.entries(data.etc)) {
                arr.push({ key: value, id: key });
            }
            let xxx = arr.map((x, i) => `\`${x.id}.\` **${x.key}**`).join("\n");

            const embed = new MessageBuilder()
                .setTitle(data.name)

                .setDescription(`**${data.data}** \n${xxx}`)
                .setTimestamp();

            hook.send(`**${data.name}** [\`${data.etc.id}]\` **:** ${data.data}`);
        }
        
           if (data.type == "orderPrepare") {
               
data.data.map( (item, index) => {
  setTimeout(() => {
   console.log(item.id);
       let xxx = JSON.stringify({ type: "order", data: item.id });
                    client.write(xxx);
    console.log(item);
  }, 2500*index )
});
                       
  }
        if (data.type == "getUser") {
            const [names, id] = playersData(data);
            const embed = new MessageBuilder()
                .setTitle(data.location)
                .addField("Player", `\`\`\`fix\n${names.join("\n")}\`\`\``, true)
                .addField("ID", `\`\`\`fix\n${id.join("\n")}\`\`\``, true)

                .setColor("#00b0f4")
                .setTimestamp();

            hook.send(embed);
        }
    } catch (err) {
        console.log(err);
    }
});

client.on("close", function () {
    console.log("Connection closed");
});

module.exports = {
    name: "annoucment",
    aliases: ["s"],
    exec: async (msg, args) => {
        try {
            let query = args.join(" ");

            if (!query) return msg.channel.send(util.embed().setDescription("❌ | Missing args."));

            if (args[0] == "room") {
                let messs = args.slice(1).join(" ");

                let xxx = JSON.stringify({ type: "room", data: messs });
                client.write(xxx);
                return;
            }

            if (args[0] == "kick" && args[1]) {
                if (id.indexOf(args[1]) > -1) {
                    let xxx = JSON.stringify({ type: "kick", data: args[1] });
                    client.write(xxx);
                    msg.channel.send("تم الطرد بنجاح");
                } else {
                    msg.channel.send("اللاعب غير موجود");
                }

                return;
            }
            if (query == "online") {
                let xxx = JSON.stringify({ type: "getOnline" });
                client.write(xxx);
                return;
            }
            /*
            if (query == "online"){
                
                const embed = new MessageEmbed()
		.setTitle(`Street 1`)
                .addField('Player',       `\`\`\`fix\n${names.join('\n')}\`\`\``, true)
		.addField('ID', `\`\`\`fix\n${id.join('\n')}\`\`\``, true)
                .setFooter(`Requested by ${msg.author.username}`, msg.author.avatarURL)
		.setTimestamp();

		return msg.channel.send(embed);
            }
            */
            filter.replaceWord("$");
            query = filter.clean(query);
            let xxx = JSON.stringify({ type: "bot", data: query });
            client.write(xxx);
            msg.channel.send("تم إرسال الرساله بنجاح");
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    },
   client:client,

};

