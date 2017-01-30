const Discord = require("discord.js");
const bot = new Discord.Client();
const cleverbot = require("cleverbot.io");
const yt = require("ytdl-core");
const os = require("os");

const dpx = "?";
const clever = new cleverbot('USER', 'KEY');
const token = 'TOKEN'

var afk = [];

// Delton
// By: houseofkraft

// TODO: Add rock paper scissors (RPS) (DONE)
// TODO: Remove case-sensitive for commands  (PLANNED)
// TODO: Fix RPS  (PLANNED)

function arrayToString(arr) {
  var output = ""
  arr.forEach(function(i, index, array) {
    output += i + " "
  });
  return output
}

function arrayFind(arr, txt) {
  var found = false;
  var counter = 0;
  var num
  arr.forEach(function(i, index, array) {
    if (txt === i) {
      found = true;
      num = counter;
    }
    counter = counter + 1
  });
  return found, num;
}

function toGB(data) {
  output = data / 1073741824
  output = output.toFixed(1);
  return output;
}

function hasPerm(member, perm) {
    if (member.roles.filter(r=>r.hasPermission(perm)).size > 0) {
        return true
        // Returns True
    }
    else {
		    return false
        // Returns False
    }
}

bot.on("ready", () => {
  console.log("Delton is ready for service.");
});

bot.on("message", message => {
  if (message.content.startsWith(dpx + "ping")) {
    message.channel.sendMessage(":white_check_mark: **Pong!**");
  }
  if (message.content.startsWith(dpx + "cleverbot")) {
    let args = message.content.split(" ").slice(1);
    if (args.length < 1) {
      message.channel.sendMessage(":fire: **Usage: ** ?cleverbot <message>");
    } else {
      clever.setNick(message.guild);
      clever.create(function(err, session) {
        clever.ask(args[0], function(err, response) {
          message.channel.sendMessage(response);
        });
      });
    }
  }
  if (message.content.startsWith(dpx + "help")) {
    var embed = new Discord.RichEmbed();
    embed.setTitle("Delton Commands");
    embed.setDescription(arrayToString([
      "=== Delton Commands ===\n",
      "By: houseofkraft\n",
      "\n",
      "?help - Get the list of commands\n",
      "?ping - Pong!\n",
      "?cleverbot <question> - Ask the magical cleverbot a question!\n",
      "?warn - Warn a bad person on your server! (Buggy)\n",
      "?roll - Roll a dice!\n",
      "?flipcoin - Flip a coin!\n",
      "?rps <choice> - Rock paper scissor!\n",
      "?afk - Toggle's your AFK status\n",
      "?stats - Get stats!\n",
      "?kick - Kick a naughty user! (Requires KICK_MEMBERS)\n"
    ]));
    embed.setFooter("Version 1.2.8");
    message.author.sendEmbed(embed);
    message.channel.sendMessage(":mailbox_with_mail: **Check your DM's!**")
  }
  if (message.content.startsWith(dpx + "warn")) {

  }
  if (message.content.startsWith(dpx + "roll")) {
    var roll = Math.floor(Math.random() * 4) + 1
  	if (roll === 1) {
  		return message.channel.sendMessage(":one:");
  	}
  	if (roll === 2) {
  		return message.channel.sendMessage(":two:");
  	}
  	if (roll === 3) {
  		return message.channel.sendMessage(":three:");
  	}
  	if (roll === 4) {
  		return message.channel.sendMessage(":four:");
  	}
  }
  if (message.content.startsWith(dpx + "flipcoin")) {
    var roll = Math.floor(Math.random() * 2) + 1
    if (roll === 1) {
      message.channel.sendMessage("**Heads!**");
    }
    if (roll === 2) {
      message.channel.sendMessage("**Tail!**");
    }
  }
  if (message.content.startsWith(dpx + "rps")) {
    // Fix bug with it
    let args = message.content.split(" ").slice(1);
    if (args.length < 1) {
      message.channel.sendMessage(":fire: **Usage: ** ?rps <rock/paper/scissor>");
    } else {
      var choice = args[0];
      choice = choice.replace("rock", "1");
      choice = choice.replace("paper", "2");
      choice = choice.replace("scissor", "3");
      if (choice === args[0]) {
        message.channel.sendMessage(":fire: You need to choose **rock**, **paper**, or **scissor**!");
      } else {
        var roll = Math.floor(Math.random() * 3) + 1
        if (roll === choice) {
          message.channel.sendMessage("**We both chose the same thing!**");
        }
        if (roll === 1 && choice === 2) {
          message.channel.sendMessage("**I chose rock and I lost :(**")
        }
        if (roll === 2 && choice === 3) {
          message.channel.sendMessage("**I chose paper and I lost :(**")
        }
        if (roll == 3 && choice === 2) {
          message.channel.sendMessage("**I chose scissors and I beat you :D**")
        }
        if (roll === 2 && choice === 1) {
          message.channel.sendMessage("**I chose paper and I beat you! :D**")
        }
      }
    }
  }
  if (message.content.startsWith(dpx + "afk")) {
    if (arrayFind(afk, message.author.id)) {
      var found, num = arrayFind(afk, message.author.id);
      afk.splice(num, 1); // Remove the ID from the AFK list
      var oldNick = message.member.displayName
      var o = oldNick.replace("[AFK]", "");
      message.member.setNickname(o);
      message.channel.sendMessage(":white_check_mark: **Sucessfully turned off AFK**")
    } else {
      afk.push(message.author.id);
      var oldNick = message.member.displayName
      message.member.setNickname(oldNick + " [AFK]")
      message.channel.sendMessage(":white_check_mark: **Sucessfully turned on AFK**")
    }
  }
  if (message.content.startsWith(dpx + "kick")) {
    let args = message.content.split(" ").slice(1);
    if (args.length < 1) {
      return message.channel.sendMessage(":fire: **Usage: ** ?kick <username>");
    }
    // Now since we know the user has supplied enough args, we can store the user variable
    var user = args[0];
    if (!hasPerm(message.member, "KICK_MEMBERS")) {
      return message.channel.sendMessage(":fire: **You don't have permission to kick other people!**");
    }
    if (hasPerm(user, "KICK_MEMBERS")) {
      return message.channel.sendMessage(":fire: **The person you are kick has the KICK_MEMBERS permision.**");
    }
    try {
     user.kick();
     message.channel.sendMessage(":white_check_mark: **Sucessfully kicked the user!**");
    } catch(e) {
     message.channel.sendMessage(":fire: **An unexpected error has occured while kicking the user.");
     message.channel.sendMessage("Error: " + e);
    }
  }
  if (message.content.startsWith(dpx + "stats")) {
    var freemem = toGB(os.freemem());
    var totalmem = toGB(os.totalmem());
    var embed = new Discord.RichEmbed();
    embed.setTitle("Stats");
    embed.setDescription(arrayToString([
      "Stats\n",
      "RAM: " + freemem + "/" + totalmem + " GB free\n",
      "Servers: " + bot.guilds.size + "\n",
      "Channels: " + bot.channels.size + "\n",
      "Version: 1.2.7"
    ]));
    message.channel.sendEmbed(embed);
  }
  // Check if AFK person is mentioned
  var idMent = message.content.replace("@", "");
  idMent = idMent.replace("<", "");
  idMent = idMent.replace(">", "");
  var found, num = arrayFind(afk, idMent)
  if (found) {
    message.channel.sendMessage("The user you are trying to mention is AFK and may not respond.");
  }
});

bot.login(token);
