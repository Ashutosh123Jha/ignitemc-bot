require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const spamMap = new Map();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("clientReady", () => {
  console.log("IgniteMC Bot Online ✅");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const now = Date.now();

  if (!spamMap.has(userId)) {
    spamMap.set(userId, []);
  }

  const userMessages = spamMap.get(userId);
  userMessages.push(now);

  const recentMessages = userMessages.filter(time => now - time < 10000);
  spamMap.set(userId, recentMessages);

  if (recentMessages.length >= 5) {
    await message.member.timeout(4 * 60 * 60 * 1000, "Spam");
    await message.channel.send(`🔇 ${message.author} ko 4 ghante ke liye mute kiya gaya (Spam).`);
    spamMap.delete(userId);
    return;
  }

  if (message.content === "!ping") {
    message.reply("Pong 🏓");
  }

  if (message.content === "ip") {
    message.reply(
      "🎮 IgniteMC IP: play.ignitemc.fun\n🔌 Port: 25565\n🌐 Official Website: https://ignitemc.fun/"
    );
  }
});

client.login(process.env.TOKEN);
