const FetchUrl = {
    captchaVerify : "https://hcaptcha.com/siteverify"
}

module.exports.FetchUrl=FetchUrl;

const fetch = async function(url, options) {
    const response = await fetch(url, options);
    return await response.json();
}
module.exports.Fetch = fetch;
