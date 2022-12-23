//#region imports
const config = require(`./config/config.json`);
const util = require(`@un-boxing-hosting/boxing-hosting-utils`)
const Discord = require(`discord.js`);
const REST = require('@discordjs/rest').REST;
const db = require('quick.db');
const utils = new util.Client();
const list = utils.getIDList();
const stafflist = utils.getStaffList();
//#endregion

//#region variables
const hostname = `https://mypetseal.com`
const dirname = `MyPetSeal/server`;
const intents = new Discord.IntentsBitField(config.intents);
const bot = new Discord.Client({
    intents
});
//#endregion

//#region bot
bot.once(`ready`, async () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity(`MyPetSeal.com`, {
        type: `WATCHING`
    });
});
const commands = [
    new Discord.SlashCommandBuilder().setName(`mypet`).setDescription(`See Your Pet From MyPetSeal.com`),
    new Discord.SlashCommandBuilder().setName(`link`).setDescription(`How to link your account`),
    new Discord.SlashCommandBuilder().setName(`help`).setDescription(`Help Command`),
    new Discord.SlashCommandBuilder().setName(`pub-pets`).setDescription(`Public Pets`),
]
const rest = new REST({
    version: '10'
}).setToken(config.token);
rest.put(
    Discord.Routes.applicationCommands(config.botID), {
        body: commands
    },
);

bot.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    console.log(interaction.user)
    switch (commandName) {
        case 'mypet':
            var email = db.get(interaction.user.id)
            if (email == undefined) {
                interaction.reply(`You have not linked your account yet.`)
                return;
            }
            var user = db.get(email).discord
            var pets = db.get(email).pets
            console.log(pets)
            if (pets == undefined) {
                interaction.reply(`You have no pets`)
            }
            // const file = new AttachmentBuilder(pets.img);
            var petsEmbed = new Discord.EmbedBuilder()
                .setTitle(`Your pets`)
                .setURL(hostname)
                //.setDescription(`${pets}`)
                .addFields({
                    name: `Name`,
                    value: `${pets.name}`
                }, {
                    name: `Happyness`,
                    value: `${pets.happy}`
                }, {
                    name: `Owner`,
                    value: `${user.name}`
                })
                .setImage(pets.img)
                .setColor(` #0099ff`)
                .setFooter({
                    text: 'made by un boxing hosting',
                    iconURL: 'https://bots.unboxingman.com/pix/logo.png'
                })
                .setTimestamp()
            interaction.reply({
                embeds: [petsEmbed]
            })
            break;
        case 'link':
            interaction.reply(`To link your account, go to ${hostname}/login and login with discord (the email MUST match both accounts).`)
            break;
        case 'help':
            interaction.reply(`To see your pets, use the command \`Mypet\`.\nTo link your account, use the command \`Link\`.`)
            break;
        case 'pub-pets':
            var public_pets = await pubpets()
            var embeds = []
            console.log(public_pets)
            var petsEmbed = new Discord.EmbedBuilder()
            public_pets.forEach(pet => {

                petsEmbed.setTitle(`public pets`)
                petsEmbed.setURL(hostname)
                //  .setDescription(`${pet.owner}`)
                petsEmbed.addFields({
                    name: `Name`,
                    value: pet.pets.name
                }, {
                    name: `Happness`,
                    value: `${pet.pets.happy}`
                }, {
                    name: `Owner`,
                    value: `${pet.owner}`
                })

                petsEmbed.setImage(pet.pets.img)


            })
            petsEmbed.setColor(` #0099ff`)
            petsEmbed.setFooter({
                text: 'made by un boxing hosting',
                iconURL: 'https://bots.unboxingman.com/pix/logo.png'
            })
            petsEmbed.setTimestamp()
            
            interaction.reply({
                embeds: [petsEmbed]
            })
            break;
    }
})

bot.on(`messageCreate`, async (message) => {
    console.log(`${message.author.username} said: ${message.content}`);
    const idlist = await list;
    const staffIDlist = await stafflist;
    if (message.author.bot) return;
    const prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;

    const args2 = message.content.slice(prefix.length).split(/ +/);
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(prefix.length).toLowerCase();
    console.log(command)
    switch (command) {
        case `mypet`:


    }



})



bot.login(config.token);

//# endregion
//#region functions
async function pubpets() {
    var public = db.get(`public_pets`)
    var public_pets = []

    await public.forEach(email => {
        var user = db.get(email)
        var owner = getName(user)
        if (user.pets != undefined) {
            public_pets.push({
                owner: owner.name,
                pets: user.pets
            })
        }
    })
    console.log(public_pets)
    return public_pets
}

function getName(user) {
    if (user.discord !== undefined && user.discord !== null) {
        var send = {
            email: user.discord.email,
            name: user.discord.name,
            id: user.discord.id
        }
        return send;
    }
    if (user.google != undefined && user.google != null) {
        var send = {
            email: user.google.email,
            name: user.google.name,
            id: user.google.id
        }

        return send;
    }
}
module.exports = {
    bot,
}