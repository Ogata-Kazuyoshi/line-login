import baseButton from "../assets/LineLoginButton/btn_login_base.png"
import hoverButton from "../assets/LineLoginButton/btn_login_hover.png"
import pressButton from "../assets/LineLoginButton/btn_login_press.png"
import {useEffect, useRef} from "react";

export const Login = () => {
    const buttounRef = useRef<HTMLImageElement>(null)
    const loginClick = () => {
        buttounRef.current!.src = pressButton
        const lineId = import.meta.env.VITE_LINE_CHANNEL_ID
        const redirecturl = import.meta.env.VITE_REDIRECT_URL
        const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineId}&redirect_uri=${redirecturl}&state=12345abcde&scope=openid&nonce=09876xyz`
        window.location.href = url;
    }

    const loginHover = () => {
       buttounRef.current!.src = hoverButton
    }

    const loginLeave = () => {
        buttounRef.current!.src = baseButton
    }

    useEffect(() => {
        buttounRef.current!.src=baseButton
    }, []);

    return <>
        <button
            onMouseEnter={loginHover}
            onMouseLeave={loginLeave}
            onClick={loginClick}
        >
            <img ref={buttounRef} />
        </button>
    </>
}    