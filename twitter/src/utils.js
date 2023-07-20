const discord = require('discord.js');
hooksurl = ["https://discord.com/api/webhooks/758632923070070843/ofhEv43jg2w6i1BdW7ItrZ4RVaAz7OKnJ1CYTJNlhPxtnyfGutvZ9SWCZy9SBEF0TBPH","https://discord.com/api/webhooks/1021538631493627985/RyxyuIuZG_3Yf3Q1YqM4mwRpDww8hqD9wY3iXqlz8xhMn8CHBOUTwF0tXw8hIu4je-6y"]
let userCtegory ={
  memes:['1133609812120543233','1219002421155966976','3493166842','1392544248017399810','582243339'],
  news:["301120393"],
  jorgena:[45454545454]
}

/**
 * Wrapper function for sending Discord embeds
 * @param {Object} Object.webhookUrl Discord webhook URL
 * @param {Object} Object.description Description of the embed
 * @param {Object} Object.storeName Name of a store
 * @param {Object} Object.productName Name of a product
 * @param {Object} Object.productUrl URL
 * @param {Object} Object.productImage Image
 */
const sendDiscordWebhook = async ({
  webhookUrl,
  description,
  storeName,
  productName,
  productUrl,
  productImage,
  username
}) => {
      const embed = new discord.MessageEmbed();
  if (storeName) embed.setAuthor(storeName, undefined, undefined);
  if (description) embed.setDescription("**"+description+"**");

  embed
    .setColor('#ffaaaa')
    .setFooter(
      `Twitter Bricks by ${username.name}`,
      'https://media.discordapp.net/attachments/683591452214820909/748503709452861450/rtuna_logo.png',
    );
        console.log("=============")
    console.log(userCtegory.memes.includes(username.id))
            console.log("=============")
    console.log(userCtegory.news.includes(username.id))

  switch(true){
  case userCtegory.memes.includes(username.id):
    webhookUrl = "https://discord.com/api/webhooks/1023652031019360276/6doJ6S3yBtpL_nMpn3bS-L2OJx830eJXb1xGvFauimbmNr-4KaYzP9rezvDBwM-nLJQm"
  break;
    case userCtegory.news.includes(username.id):
webhookUrl = "https://discord.com/api/webhooks/1023556928640651265/Ct-N4SgssHG6ErBgRxy792lk2er1TJo_MrQIX20n9YxPkDMmCLHoPoCiS-6XTUBPwKn1"
    break;
 default:
       webhookUrl = "https://discord.com/api/webhooks/1023559692884127784/F53JY1hGsvxcIVsR2eTuAQ_CovXnG7o6logJCWqmSzRfr2UrF2507DsV1YgoJQzaKIP4"
}

  if (productName) embed.setTitle(productName);
  if (productUrl) embed.setURL(productUrl);
  if (productImage) embed.setImage(productImage);
  /*
 hooksurl.map(function (url) {
     const [, , , , , id, token] = url.split('/');
     const hook = new discord.WebhookClient(id, token);

return hook
    .send({
      embeds: [embed],
    })
    .catch((err) => {
      console.log(`Failed to send a notification! ${err}`);
    });
})
  */
  const [, , , , , id, token] = webhookUrl.split('/');
  const hook = new discord.WebhookClient(id, token);
  return hook
    .send({
      embeds: [embed],
    })
    .catch((err) => {
      console.log(`Failed to send a notification! ${err}`);
    });

};

/**
 * Removes trash character from the text passed in.
 * @param {String} text Text to remove the characters from
 * @returns {String}
 */
const removeTrashCharacters = (text) => {
  // could be done more effectively but CBA

  let newText = text;
  newText = newText.replace('\n=&gt;', '');
  newText = newText.replace('=&gt;', '');
  newText = newText.replace('&gt;', '');
  newText = newText.replace('&gt; ', '');
  newText = newText.replace('#AD', '');
  newText = newText.replace('AD:', '');
  newText = newText.replace('Ad:', '');
  newText = newText.replace('AD :', '');
  newText = newText.replace('AD', '');
  newText = newText.replace('=> ', '');
  newText = newText.replace('=>', '');
  newText = newText.replace('&gt; ', '');
  newText = newText.replace('Link >', '');
  // newText = newText.replace(/[^\w\s]/gi, '');
  return newText;
};

/**
 * Replaces all URLs in a text with neat discord embed formatting of [Click here](URL)
 * @param {*} text - Text to edit
 * @param {*} urls - urls to replace
 * @returns {String} - text with the URLs replaced
 */
const replaceUrlsInText = (text, urls) => {
  /** Prettify the text */
  let editedText = text;
  for (let i = 0; i < urls.length; i += 1) {
    const { url } = urls[i];
    const expandedUrl = urls[i].expanded_url;
    /** Last URL in urls is always the tweet link. We remove it from the text completely */
    editedText = editedText.replace(url, ` [Click here](${expandedUrl})`);
  }
  return editedText;
};

/**
 * Removes mentions from a string.
 * @param {String} text Text to remove mentions from
 * @param {Object} mentions Mentions to remove
 */
const removeMentions = (text, mentions) => {
  let editedText = text;
  for (let i = 0; i < mentions.length; i += 1) {
    const mention = mentions[i];
    editedText = editedText.replace(`@${mention.screen_name}`, '');
  }
  return editedText;
};

module.exports = {
  sendDiscordWebhook,
  removeTrashCharacters,
  replaceUrlsInText,
  removeMentions,
};