import * as React from "react";
import {useEffect} from "react";
import {accessTokenGetService, checkTokenService} from "../service/AuthService.ts";
import {useNavigate} from "react-router-dom";

type Props = {
    userId : string | null
    setUserId :(id:string | null)=>void
}

export const UserPage:React.FC<Props> = (props) => {
    const navigate = useNavigate()
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const initial = async () => {
            if (searchParams.get('code')) await accessTokenGetService(searchParams.get('code'))
            const checkTokenResult = await checkTokenService(localStorage.getItem('access_token'))
            if (checkTokenResult) {
                props.setUserId(checkTokenResult.sub)
                navigate('/userpage')
            } else {
                navigate('/login')
            }
        }
        initial()
    }, []);
    return <>
    <div>
        <div>Lineから取得したUserIdは下記です</div>
        <br/>
        <div>{props.userId}</div>
    </div>
    </>
}