// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const life360 = require('life360-node-api');

const dotenv = require('dotenv');
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

async function createEmbed() {
    const client360 = await life360.login(process.env.USERNAME, process.env.PASSWORD);
    const circles = await client360.listCircles();
    const members = await circles[2].listMembers();

    let circleList = []


    const getDate = date => {
        return new Date(date);
    }

    for (const member of members) {
        if (member.location) {
            circleList.push({name: member.firstName, 
                value: "At " + (member.location.name ? member.location.name : "Unkown Location")
                + " For: " 
                + Math.trunc((Date.now() - new Date(member.location.since)) / (1000 * 3600)) + ' Hours'});
        }
    }

    circleList.sort((a, b) => parseInt(a.value.substring(a.value.indexOf(':') + 2)) - parseInt(b.value.substring(b.value.indexOf(':') + 2)))
    circleList.reverse();

    const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('At Home Leaderboard')
	.setAuthor({ name: 'Life360 Bot', iconURL: 'https://www.apkmirror.com/wp-content/uploads/2021/09/06/6155e82dd62ff-384x384.png'})
    .setThumbnail('https://www.apkmirror.com/wp-content/uploads/2021/09/06/6155e82dd62ff-384x384.png')
	.addFields(
        ...circleList,
	)
	.setTimestamp()
	.setFooter({ text: 'By Ratik Koka', iconURL: 'https://www.apkmirror.com/wp-content/uploads/2021/09/06/6155e82dd62ff-384x384.png' });
    
    return exampleEmbed;
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

    let embed = await createEmbed();

	if (commandName === 'leaderboard') {
		await interaction.reply({ embeds: [embed] });
	} 

});


// Login to Discord with your client's token
client.login(process.env.TOKEN);
