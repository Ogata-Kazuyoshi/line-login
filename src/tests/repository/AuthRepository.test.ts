import axios from "axios";
import {
  accessTokenGetRepository,
  checkIDTokenRepository,
  checkTokenRepository,
  getUserIdRepository,
  logoutRepository,
} from "../../repository/AuthRepository.ts";
import { vi } from "vitest";

vi.mock("axios");
describe("AuthRepository.tsのテスト", () => {
  test("checkTokenRepositoryを呼ぶと、正しい引数でaxios.getを呼ぶ", async () => {
    const spyAxiosGet = vi.spyOn(axios, "get");

    await checkTokenRepository("abcd");

    expect(spyAxiosGet).toHaveBeenCalledWith(
      `https://api.line.me/oauth2/v2.1/verify?access_token=abcd`,
    );

    vi.restoreAllMocks();
  });

  test("accessTokenGetRepositoryを呼ぶと、正しい引数でaxios.postを呼ぶ", async () => {
    const spyAxiosPost = vi.spyOn(axios, "post");
    const testArg = {
      grant_type: "authorization_code",
      code: "abcd",
      client_id: import.meta.env.VITE_LINE_CHANNEL_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      redirect_uri: import.meta.env.VITE_REDIRECT_URL,
    };

    await accessTokenGetRepository("abcd");

    expect(spyAxiosPost).toHaveBeenCalledWith(
      "https://api.line.me/oauth2/v2.1/token",
      testArg,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      },
    );

    vi.restoreAllMocks();
  });

  test("getUserIdRepositoryを呼ぶと、正しい引数でaxios.getを呼ぶ", async () => {
    const spyAxiosGet = vi.spyOn(axios, "get");

    await getUserIdRepository("test-access-token");

    expect(spyAxiosGet).toHaveBeenCalledWith(
      "https://api.line.me/oauth2/v2.1/userinfo",
      {
        headers: {
          Authorization: "Bearer " + "test-access-token",
        },
      },
    );

    vi.restoreAllMocks();
  });

  test("logoutRepositoryを呼ぶと、正しい引数でaxios.postを呼ぶ", async () => {
    const spyAxiosPost = vi.spyOn(axios, "post");
    const testArg = {
      access_token: "test-access-token",
      client_id: import.meta.env.VITE_LINE_CHANNEL_ID, // チャネルID
      client_secret: import.meta.env.VITE_CLIENT_SECRET, // チャネルシークレット
    };

    await logoutRepository("test-access-token");

    expect(spyAxiosPost).toHaveBeenCalledWith(
      "https://api.line.me/oauth2/v2.1/revoke",
      testArg,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      },
    );

    vi.restoreAllMocks();
  });

  test("checkIDTokenRepositoryを呼ぶと、正しい引数でaxios.postを呼ぶ", async () => {
    const spyAxiosPost = vi.spyOn(axios, "post");
    const testArg = {
      id_token: "test-id-token",
      client_id: import.meta.env.VITE_LINE_CHANNEL_ID, // チャネルID
    };

    await checkIDTokenRepository("test-id-token");

    expect(spyAxiosPost).toHaveBeenCalledWith(
      "https://api.line.me/oauth2/v2.1/verify",
      testArg,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      },
    );

    vi.restoreAllMocks();
  });
});
