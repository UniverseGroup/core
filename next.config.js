/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env:{
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URL,
    JWT_KEY: process.env.JWT_KEY,
    BASE_URL: process.env.BASE_URL,
    BOT_TOKEN: process.env.BOT_TOKEN,
    STAFF_ROLE: process.env.STAFF_ROLE,
    STAFF_CHANNEL: process.env.STAFF_CHANNEL,
    HCAPTCHA_SITE_KEY: process.env.HCAPTCHA_SITE_KEY,
    HCAPTCHA_SECRET_KEY: process.env.HCAPTCHA_SECRET_KEY,
    OFFICIAL_GUILDID: process.env.OFFICIAL_GUILDID,
    NORMAL_IMG: process.env.NORMAL_IMG,
    BOT_REVIEWER: process.env.BOT_REVIEWER,
  }
}

module.exports = nextConfig
