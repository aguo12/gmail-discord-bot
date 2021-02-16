const token = 'YourToken'
const Discord = require("discord.js");
const bot = new Discord.Client();
let prefix = 'snail.'
const fetch = require('node-fetch')
const nodemailer = require('nodemailer')
const fs = require('fs')

const accounts = {}

bot.on('ready', () => {
    console.log('This bot is online')
})

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    var args = message.content.slice(prefix.length).split('<>');
    const command = args.shift().toLowerCase();

    if (args[1]) {
        var args = args.slice(0).join('<>')
    } else {
        var args = args[0]
    }

    if (command === "setup") {
        message.reply("I'll send you instructions soon. You will need for gmail: username and password.")
    }

    if(command === "config"){
        if(accounts[message.author.id] == null){
            if(args!= null && args.split("<>")[0].includes("@gmail.com") && args.split("<>")[1]){
                accounts[message.author.id] = {"username": args.split("<>")[0], "password": args.split("<>")[1]}
                message.reply("Success. U are now very swag.")
            } else{
                message.reply("Wrong syntax. Send like `snail.config<>andy@gmail.com<>12345`")
            }
        } else{
            message.reply("Nice try spanch, but you are already registered.")
        }
    }

    if(command === "email"){
        if(accounts[message.author.id] != null){
            if(args.split("<>")[0].includes("@")){
                var smtpTransport = nodemailer.createTransport({
                    service: "gmail",
                    secure: true,
                    auth: {
                        user: accounts[message.author.id].username,
                        pass: accounts[message.author.id].password
                    }
                });
                var mailOptions = {
                    to: args.split("<>")[0],
                    from: accounts[message.author.id].username,
                    subject: args.split("<>")[1],
                    html: `${args.split("<>")[2]}`,
                };
                smtpTransport.sendMail(mailOptions, function (err, sent) {
                    if (err) {
                        message.reply("There was an error.");
                    } else {
                        message.reply("Successfully sent email.")
                    }
                })
            } else{
                message.reply("Invalid format.")
            }
        } else{
            message.reply("Not a verified user. Nice try you spanch.")
        }
    }

    if(command === "instructions"){
        let instructions = new Discord.MessageEmbed()
        .setTitle("Instructions")
        .setAuthor('Spanchbob', 'https://cdn.discordapp.com/emojis/808462846211784704.png?v=1')
        .setColor("FFFF00")
        .addField("Step 1", "Configure your email client with `snail.config`. You will be prompted to enter your service details, password, host, port, etc.")
        .addField("Step 2", "If using GMAIL (only supported atm), u will need to turn on less secure app access at [here](https://myaccount.google.com/lesssecureapps)")
        message.reply(instructions)
    }


})


bot.login(token);

