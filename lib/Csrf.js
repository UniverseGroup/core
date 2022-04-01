// This code is referred to "https://github.com/koreanbots/core/blob/master/utils/Csrf.ts".
// Origin made by wonderlandpark
import { parse, serialize } from 'cookie'
import csrf from 'csrf'

const csrfKey = '_csrf'

const Token = new csrf()

export const tokenCreate = () => Token.create(process.env.CSRF_SECRET)

export const tokenVerify = (token) => Token.verify(process.env.CSRF_SECRET, token)

export const getToken = (req, res) => {
    const parsed = parse(req.headers.cookie || '')
    let key = parsed[csrfKey]
    if (!key || !tokenVerify(key)) {
        key = tokenCreate()
        res.setHeader(
            'set-cookie',
            serialize(csrfKey, key, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
            })
        )
    }

    return key
}

export const checkToken = (req, res, token) => {
    const parsed = parse(req.headers.cookie || '')
    if (parsed[csrfKey] !== token || !tokenVerify(token)) {
        res.status(400).json({ code: 400, message: 'CSRF 검증 에러 (페이지를 새로고침해주세요)' })
        // res.status(400)
        // res.json({ code: 400, message: 'CSRF 검증 에러 (페이지를 새로고침해주세요)' })
        return false
    } else return true
}
