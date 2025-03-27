import { Octokit } from "@octokit/rest";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

function formatCount(count) {
  return count >= 1000
    ? (count / 1000).toFixed(1) + "k+"
    : count.toLocaleString();
}

async function getBotStats() {
  let stats = {
    currentGuildCount: 0,
    totalUserCount: 0,
    totalUsedCount: 0,
  };

  try {
    const prideresponse = await fetch("http://2.56.246.53:2610/stats");
    const data = await prideresponse.json();
    Object.assign(stats, {
      currentGuildCount: formatCount(data.currentGuildCount),
      totalUserCount: formatCount(data.totalUserCount),
      totalUsedCount: formatCount(data.totalUsage),
    });
  } catch (error) {
    console.error("Error fetching Pridebot stats:", error);
  }

  return stats;
}

async function updateReadme() {
  const [botStats] = await Promise.all([getBotStats()]);

  let readmeContent = `
 # Welcome to Pridebot Systems

## What is "Pridebot"?
Pridebot, developed by [Sdriver1](https://github.com/sdriver1), is a multi function LGBTQIA+ themed open source discord application set to make information and acceptance accessible to more users. Currently the bot is apart of ${botStats.currentGuildCount} server reaching to ${botStats.totalUserCount} users. The bot been used over ${botStats.totalUsedCount} times with features ranging from profile system where users can in organize way express there identities, avatar editors to rep your flag, educational for identities and supportive resources for mental health or coming out, and finally fun little minigames to mess with your friends.

## Where can I find Pridebot?
You can find Pridebot on discord and invite to any server [here](https://pridebot.xyz/invite). The official repo for Pridebot is [here](https://pridebot.xyz/github). 

## Links
### Website:
- https://pridebot.xyz
- https://pfp.pridebot.xyz

### Socials:
- BlueSky - https://bsky.app/profile/pridebot.xyz
- Tiktok - https://www.tiktok.com/@pridebotdiscord
- LinkedIn - https://www.linkedin.com/company/pridebot/

### Voting
Help support Pridebot by voting here:
- Top.gg - https://top.gg/bot/1101256478632972369/vote
- Botlist.me - https://botlist.me/bots/1101256478632972369/vote
- Discords.com - https://discords.com/bots/bot/1101256478632972369/vote
- Discordlist.gg - https://discordlist.gg/bot/1101256478632972369/vote

## Legal
- https://pridebot.xyz/tos
- https://pridebot.xyz/privacy

Copyright Sdriver1 2023-2025
    `;

  fs.writeFileSync("profile/README.md", readmeContent);
  console.log("README.md updated successfully");
}

updateReadme().catch((error) => console.error("Error in updateReadme:", error));
