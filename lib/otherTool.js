module.exports.OwnerCheck = function ({data, userId}) {
    return data.filter(owner => {
        return owner.id === userId;
    })
}
module.exports.BotOwnerCheck = function ({data, botId}) {
    return data.filter(bot => {
        return bot.botid === botId;
    })
}

module.exports.PendingIsmyBot = function({data,userId}){
    return data.ownerid === userId;
}
