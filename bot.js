const { Client, Intents } = require('discord.js');
const axios = require('axios');

const TOKEN = 'Your-Token-Here';  // Replace with your actual token

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    console.log(`Received message: ${message.content}`);
    
    if (message.author.bot) return;

    if (message.content.toLowerCase() === '!verse') {
        console.log('Recognized the !verse command');

        try {
            const response = await axios.get('https://labs.bible.org/api/?passage=random');
            console.log('Made the API call');
            console.log('API Response:', response.data);

            if (response.data) {
                // Use regex to extract book, chapter, verse and text
                const match = response.data.match(/<b>(.*?)<\/b>\s*(.*)/);
                if (match && match[1] && match[2]) {
                    const reference = match[1];
                    const text = match[2].trim();
                    console.log('Sending verse to the user');
                    message.reply(`${reference} - "${text}"`);
                } else {
                    message.reply('Fetched data from Bible API, but it was not in the expected format.');
                }
            } else {
                console.log('Fetched data from Bible API, but it was empty.');
                message.reply('Fetched data from Bible API, but it was empty.');
            }
        } catch (error) {
            message.reply('Sorry, I couldn\'t fetch a verse at the moment.');
        }
    }
});

client.login(TOKEN);
