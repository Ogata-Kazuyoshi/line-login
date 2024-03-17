import {
    accessTokenGetRepository,
    checkIDTokenRepository,
    checkTokenRepository,
    getUserIdRepository
} from "../repository/AuthRepository.ts";

export const checkAccessTokenService = async (access_token:string | null) => {
    if (access_token && await checkTokenRepository(access_token)) {
            return getUserIdService(access_token)
    }
}

export const accessTokenGetService = async (code: string | null) => {
    if (code) {
        const res  = await accessTokenGetRepository(code)
        if (res) {
            localStorage.setItem('access_token',res.data.access_token)
            localStorage.setItem('id_token',res.data.id_token)
            window.location.href = import.meta.env.VITE_REDIRECT_URL;
        }
    }
};

export const checkIDTokenService = async (idToken: string | null) => {
    if (idToken) {
        const res = await checkIDTokenRepository(idToken)
        if (res) {
            localStorage.setItem('iss',res.data.iss)
        }
    }
};

type UserInfo = {
    sub : string
}
const getUserIdService = async (accessToken:string | null):Promise<UserInfo | undefined> => {
    if (accessToken) return await getUserIdRepository(accessToken)
}
