import * as React from 'react';
import {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {accessTokenGetService, checkAccessTokenService, checkIDTokenService} from "../service/AuthService.ts";

type Props = {
  setUserId :(id:string | null)=>void
}

export const Home:React.FC<Props> = (props) => {

  const navigate = useNavigate()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initial = async () => {
      if (searchParams.get('code')) {
        await accessTokenGetService(searchParams.get('code'))
        await checkIDTokenService(localStorage.getItem('id_token'))
      }
      const checkTokenResult = await checkAccessTokenService(localStorage.getItem('access_token'))
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
    Home画面です
  </>;
};
