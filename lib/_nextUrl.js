import Cookies from 'cookies';
import cookie from "cookie";

export const getNextUrl = (req, res) => {
    let nextUrl = null;
    try{
        const cookies = cookie.parse(req.headers.cookie);
        nextUrl = cookies.next_url;
    } catch {
        nextUrl = '../../';
    }
    return nextUrl;
}


export const destoryNextUrl = (req, res) => {
    const cookie = new Cookies(req, res);
    cookie.set('next_url', null)
    return true
}

export const setNextUrl = (req, res, next_url) => {
    destoryNextUrl(req, res)
    const cookie = new Cookies(req, res)
    cookie.set('next_url', next_url)
    return true
}
