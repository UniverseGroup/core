import Cookies from 'cookies';
import cookie from "cookie";

export const getNextUrl = (req, res) => {
    const cookies = cookie.parse(req.headers.cookie);
    return cookies.next_url || '/';
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
