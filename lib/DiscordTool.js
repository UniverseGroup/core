
export default async function getUserdata(userId) {
    return await (await fetch(`https://discord.com/api/users/${userId}`,{
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
    })).json()

}
