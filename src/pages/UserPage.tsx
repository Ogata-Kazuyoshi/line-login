import * as React from "react";
import { useEffect } from "react";
import {
  accessTokenGetService,
  checkAccessTokenService,
  checkIDTokenService,
} from "../service/AuthService.ts";
import { useNavigate } from "react-router-dom";
import { logoutRepository } from "../repository/AuthRepository.ts";

type Props = {
  userId: string | null;
  setUserId: (id: string | null) => void;
};

export const UserPage: React.FC<Props> = (props) => {
  const logoutHandler = async () => {
    const res = await logoutRepository(localStorage.getItem("access_token"));
    if (res!.status === 200) navigate("/");
  };

  const checkIDToken = async () => {
    const res = await checkIDTokenService(localStorage.getItem("id_token"));
    console.log("IDTokenRes : ", res);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initial = async () => {
      if (searchParams.get("code")) {
        await accessTokenGetService(searchParams.get("code"));
        await checkIDTokenService(localStorage.getItem("id_token"));
      }
      const checkTokenResult = await checkAccessTokenService(
        localStorage.getItem("access_token"),
      );
      if (checkTokenResult) {
        props.setUserId(checkTokenResult.sub);
        navigate("/userpage");
      } else {
        navigate("/login");
      }
    };
    initial();
  }, [navigate, props]);
  return (
    <>
      <div>
        <div>Lineから取得したUserIdは下記です</div>
        <br />
        <div>{props.userId}</div>
        <br />
        <br />
        <button onClick={logoutHandler}>ログアウトする</button>

        <button onClick={checkIDToken}>IDトークンの検証をする</button>
      </div>
    </>
  );
};
