import {accessTokenGetRepository, checkTokenRepository, getUserIdRepository} from "../repository/AuthRepository.ts";

export const checkTokenService = async (access_token:string | null) => {
    if (access_token && await checkTokenRepository(access_token)) {
            return getUserIdService(access_token)
    }
}

export const accessTokenGetService = async (code: string | null) => {
    if (code) {
        const response  = await accessTokenGetRepository(code)
        if (response) {
            localStorage.setItem('access_token',response.data.access_token)
            window.location.href = import.meta.env.VITE_REDIRECT_URL;
        }
    }
};

type UserInfo = {
    sub : string
}
const getUserIdService = async (accessToken:string | null):Promise<UserInfo | undefined> => {
    if (accessToken) return await getUserIdRepository(accessToken)
}
