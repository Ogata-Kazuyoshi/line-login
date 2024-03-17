import axios from "axios";

export const checkTokenRepository =async (access_token:string) =>{
    try {
        return  await axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`)
    } catch (err) {
        console.log('checkTokenRepositoryでのエラーです :',err)
    }
}

export const accessTokenGetRepository = async (code:string) => {
    const data = {
        grant_type: 'authorization_code',
        code: code,
        client_id: import.meta.env.VITE_LINE_CHANNEL_ID, // チャネルID
        client_secret: import.meta.env.VITE_CLIENT_SECRET, // チャネルシークレット
        redirect_uri: import.meta.env.VITE_REDIRECT_URL, // 「LINEログイン設定」で設定したコールバックURL
    };
    try {
        return await axios.post(
            'https://api.line.me/oauth2/v2.1/token',
            data,
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
            },
        );
    } catch (err) {
        console.log('accessTokenGetRepositoryのエラーです : ',err)
    }
}

export const getUserIdRepository = async (accessToken:string) => {
    try {
        const response = await axios.get('https://api.line.me/oauth2/v2.1/userinfo', {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
        });
        return response.data
    } catch (error) {
        console.log("error : ",error)
    }
}