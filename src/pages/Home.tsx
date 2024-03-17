import { useEffect } from 'react';
import axios from 'axios';

export const Home = () => {
  const lineInfoProcess = () => {
    const searchParams = new URLSearchParams(location.search);
    // アクセストークン生成に必要な「code」をURLから取得
    console.log('code : ', searchParams.get('code'));

    // ----------ここから

    PostAccessTokenGet(searchParams.get('code'));
  };
  //
  const PostAccessTokenGet = async (code: string | null) => {
    try {
      const data = {
        grant_type: 'authorization_code',
        code: code,
        client_id: import.meta.env.VITE_LINE_CHANNEL_ID, // チャネルID
        client_secret: import.meta.env.VITE_CLIENT_SECRET, // チャネルシークレット
        redirect_uri: import.meta.env.VITE_REDIRECT_URL, // 「LINEログイン設定」で設定したコールバックURL
      };
      const response = await axios.post(
        'https://api.line.me/oauth2/v2.1/token',
        data,
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          // withCredentials:true
        },

      );
      console.log('GET Seccess:', response);
      // responseの中にアクセストークンが含まれているので
      // useContextなどで保管しておく

      // トップページにリダイレクトさせる
      // window.location.href = import.meta.env.VITE_REDIRECT_URL;
    } catch (error) {
      console.error('GET Error:', error);
    }
  };

  useEffect(() => {
    // console.log('Current URL search params:', location.search); // この行を追加
    // console.log('Current URL:', window.location.href); // この行を追加
    // console.log('Current URL:', window.location.search); // この行を追加
    lineInfoProcess();
  }, []);
  return <>Home画面です</>;
};
