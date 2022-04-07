import Cookies from 'cookies';

export default (req, res) => {
    const cookie = new Cookies(req, res)
    cookie.set('token', null)
    cookie.set('next_url', null)
    res.redirect('../../')
}
