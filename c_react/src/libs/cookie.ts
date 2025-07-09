'use client'
import Cookies from "js-cookie"
const save = (key: string, value: string, exp: number) => {
    return Cookies.set(key, value, {
        expires: new Date(exp * 1000),
        path: "/",
    })
}

const get = (key: string) => {
    return Cookies.get(key)
}
const remove = (key: string) => {
    return Cookies.remove(key, {
        path: "/",
    })
}
const getToken = async () => {
    const t = get('pm-t')
    if (t) {
        return t
    }
    return null
}
export { save, get, remove, getToken }

