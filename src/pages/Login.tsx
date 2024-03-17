export const Login = () => {
    const loginClick = () => {
        const lineId = import.meta.env.VITE_LINE_CHANNEL_ID
        const redirecturl = import.meta.env.VITE_REDIRECT_URL

        const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineId}&redirect_uri=${redirecturl}&state=12345abcde&scope=profile%20openid&nonce=09876xyz`

        window.location.href = url;
    }
    return <>
        <button onClick={loginClick}>LINEでログイン</button>
    </>
}    