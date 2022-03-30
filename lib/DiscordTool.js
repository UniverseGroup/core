import fetch from 'isomorphic-fetch';

module.exports.discordUrls = {
    login : `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=guilds%20guilds.join%20identify%20email`,
    logout : '/api/logout',
    token: 'https://discord.com/api/oauth2/token',
    me: 'https://discord.com/api/users/@me',
}
module.exports.getMemberData = async function(token, guildId, userId) {
    const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
        headers: {
            'Authorization': `bot ${process.env.BOT_TOKEN}`,
        }
    });
    return await response.json();
}
module.exports.getUserData = async function getUserData(userId) {
    return await (await fetch(`https://discord.com/api/users/${userId}`,{
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
    })).json();
}
module.exports.sendSubmitMessage = async function sendSubmitMessage(userID,username,userdiscriminator,botID,botname,botdiscriminator,sibmitid) {
    return await (await fetch(`https://discord.com/api/v8/channels/${process.env.STAFF_CHANNEL}/messages`,{
        method: 'POST',
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `<@&${process.env.BOT_REVIEWER}>\n\n${username}#${userdiscriminator} has submitted a bot request.\n\nBot ID: ${botID}\nSubmit ID(for approve/deny): ${sibmitid}\nBot: ${botname}#${botdiscriminator}\n\nInvite: https://discordapp.com/oauth2/authorize?client_id=${botID}&scope=bot&permissions=0`,
            allowed_mentions: {
                "roles":[process.env.BOT_REVIEWER]
            }
        })
    })).json()

}
module.exports.kickUser = async function kickUser(userID,reason='No reason provided'){
    return (await fetch(`https://discord.com/api/v8/guilds/${process.env.OFFICIAL_GUILDID}/members/${userID}`,{
        method: 'DELETE',
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
            "X-Audit-Log-Reason": reason
        },
    }))

}

module.exports.JoinServer = async function JoinServer({guildId, userId, accessToken}){
    console.log({guildId, userId, accessToken})
    try {
        return await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bot ${process.env.BOT_TOKEN}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                access_token: accessToken
            })
        });
    } catch (e) {
        throw Error(e.message)
    }

}
