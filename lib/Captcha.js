import {FetchUrl} from "./fetchTool";

export const VerifyCaptcha = async (token) => {
    const params = new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY,
        response:token,
    })
    const checkCaptcha = (await (await fetch(FetchUrl.captchaVerify,{
        method:'POST',
        body:params,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })).json());
    return checkCaptcha.success;
}
