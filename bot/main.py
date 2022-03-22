import os
import traceback

import discord
from discord.ext import commands
from pymongo import MongoClient
import dotenv
import certifi
import jwt
ca = certifi.where()
dotenv.load_dotenv()
INTENTS = discord.Intents.all()
client = commands.Bot(command_prefix='!',intents=INTENTS)
db = MongoClient(os.getenv('MONGODB_URI'), tlsCAFile=ca)
@client.event
async def on_ready():
    print('Bot is ready')

@client.event
async def on_member_join(member:discord.Member):
    print(member)
    if member.bot:
        role = client.get_guild(953953436133650462).get_role(954183713154023514)
        findid = list(db['UniverseDatabase']['pendbots'].find({'botid':str(member.id)}))
        db['UniverseDatabase']['pendbots'].update_one({'id':findid[-1]['id']},{"$set":{"pending":True}})
        await member.add_roles(role)

@client.event
async def on_command_error(ctx,error):
    if isinstance(error,commands.MissingRole):
        return await ctx.reply("You cannot run this command")

@client.command()
@commands.has_role(954010525019299860)
async def todo(ctx):
    data = list(db['UniverseDatabase']['pendbots'].find())
    num = sum(not item['approved'] and item['denyReason'] == "" for item in data)
    em = discord.Embed(title='Todo',description=f"Todo Count : {num}")
    await ctx.reply(embed=em)

@client.command()
@commands.has_role(954010525019299860)
async def bots(ctx):
    data = list(db['UniverseDatabase']['pendbots'].find())
    todonum = sum(not item['approved'] and item['denyReason'] == ""  for item in data)
    em = discord.Embed(title='Todo',description=f"Todo Count : {todonum}")
    num = 0
    for item in data:
        if not item['approved'] and item['denyReason'] == "":
            num += 1
            bot = await client.fetch_user(int(item['botid']))
            owner = await client.fetch_user(int(item['ownerid']))
            botdata = db['UniverseDatabase']['bots'].find_one({'botid':item['botid']})
            categories = ", ".join([i['label']for i in botdata['category']])
            invite_url = f"https://discordapp.com/oauth2/authorize?client_id={item['botid']}&scope=bot&permissions=0"
            em.add_field(name=f"{num}. {bot.name}( {item['botid']} )",value=f"심사ID: {item['id']}\nPrefix: {item['prefix']}\nCategory: {categories}\n\nowner: {owner}\n\n[invite]({invite_url})")
    await ctx.reply(embed=em)

@client.command()
@commands.has_role(954010525019299860)
async def approve(ctx,uniqueid):
    data = db['UniverseDatabase']['pendbots'].find_one({'id':uniqueid})
    owner = await client.fetch_user(int(data['ownerid']))
    userbot = await client.fetch_user(int(data['botid']))
    db['UniverseDatabase']['pendbots'].update_one({'id':uniqueid},{"$set":{"approved":True,"pending":False}})
    token = jwt.encode({'botid':userbot.id,'ownerid':owner.id},os.getenv('JWT_KEY'))
    db['UniverseDatabase']['bots'].update_one({'botid': str(userbot.id)}, {"$set": {"approved": True,"token":token}})
    db['UniverseDatabase']['users'].update_one({'userid':str(owner.id),'bots.botid':str(userbot.id)},{"$set": {"bots.$.approved": True}})
    member_user = ctx.guild.get_member(int(data['ownerid']))
    member_bot = ctx.guild.get_member(int(data['botid']))
    developer_role = ctx.guild.get_role(954184048358596648)
    bot_role=ctx.guild.get_role(954184241250463814)
    pend_bot_role=ctx.guild.get_role(954183713154023514)
    await member_user.add_roles(developer_role)
    await member_bot.remove_roles(pend_bot_role)
    await member_bot.add_roles(bot_role)
    try:
        await owner.send(f'축하드립니다!🎉🎉\n\n신청하신봇 ( **{userbot.name}#{userbot.discriminator}** )(이)가 승인되었습니다!\n\n봇 페이지 -{os.getenv("BASE_URL")}bots/{userbot.id}')
    except:
        pass
    await ctx.reply('✅')

@client.command()
@commands.has_role(954010525019299860)
async def deny(ctx,uniqueid,*,reason):
    try:
        data = db['UniverseDatabase']['pendbots'].find_one({'id': uniqueid})
        owner = await client.fetch_user(int(data['ownerid']))
        userbot = await client.fetch_user(int(data['botid']))
        db['UniverseDatabase']['pendbots'].update_one({'id':uniqueid},{"$set":{"denyReason":reason,"deny":True,'pending':False}})
        db['UniverseDatabase']['bots'].delete_one({"botid":data["botid"]})
        db['UniverseDatabase']['users'].update_one({'userid': str(owner.id)},
                                                   {"$pull": {"bots": {"botid":str(userbot.id)}}})
        member_bot = ctx.guild.get_member(int(data['botid']))
        await member_bot.kick()
        try:
            await owner.send(f'신청하신봇 ( **{userbot.name}#{userbot.discriminator}** )(이)가 반려되었습니다.\n\n반려사유 - {reason}')
        except:
            pass
        await ctx.reply('✅')
    except:
        print(str(traceback.format_exc()))

@client.command()
@commands.has_role(954010525019299860)
async def findowner(ctx,bot:discord.User):
    if not bot.bot:
        return
    data = db['UniverseDatabase']['pendbots'].find_one({'botid': str(bot.id)})
    owner = ctx.guild.get_member(int(data['ownerid']))
    if bool(owner):
        return await ctx.reply(f"founded this bot owner\n\nbot: {bot.mention}\nowner: {owner}")
    return await ctx.reply("Not founded")


if __name__ == "__main__":
    client.run(os.getenv('TOKEN'))