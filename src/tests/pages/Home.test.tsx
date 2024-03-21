import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { Home } from "../../pages/Home.tsx";
import {
  accessTokenGetService,
  checkAccessTokenService,
  checkIDTokenService,
} from "../../service/AuthService.ts";
import { useNavigate } from "react-router-dom";

vi.mock("../../service/AuthService.ts");
vi.mock("react-router-dom");

const originalLocalStorage = window.localStorage;
const originalURLParams = URLSearchParams;
const originalLocation = window.location;

describe("Home.tsxのテスト", () => {
  afterEach(() => {
    // Object.defineProperty(window, 'localStorage', {
    //     value: originalLocalStorage,
    // });
    vi.restoreAllMocks();
    vi.stubGlobal("localStorage", originalLocalStorage);
    vi.stubGlobal("location", originalLocation);
    vi.stubGlobal("URLSearchParams", originalURLParams);
  });

  describe("クエリパラメーターのチェックテスト", () => {
    test("クエリパラメーターにcodeが含まれている場合、accessTokenGetServiceを正しい引数で呼ぶ", async () => {
      const spyURLSearchParams = vi.fn();
      const mockSearchParams = {
        get: vi
          .fn()
          .mockImplementation((params) => (params === "code" ? "abc" : null)),
      };

      vi.stubGlobal("location", { search: "mocked_search_string" });
      vi.stubGlobal(
        "URLSearchParams",
        spyURLSearchParams.mockReturnValue(mockSearchParams),
      );
      vi.stubGlobal("localStorage", {
        getItem: vi
          .fn()
          .mockImplementation((params) =>
            params === "id_token" ? "test-id-token" : null,
          ),
      });
      vi.mocked(useNavigate).mockReturnValue(() => {});

      render(<Home setUserId={() => {}} />);

      expect(spyURLSearchParams).toHaveBeenCalledWith("mocked_search_string");
      expect(accessTokenGetService).toHaveBeenCalledWith("abc");
      //実装側でaccessTokenGetServiceをawaitしてから実行するので、こっちの結果は待たないと、呼び出されない
      await waitFor(() =>
        expect(checkIDTokenService).toHaveBeenCalledWith("test-id-token"),
      );
    });
  });

  describe("checkAccessTokenServiceに関するテスト", () => {
    test("レンダーされるとcheckAccessTokenServiceを正しい引数で呼ぶ", async () => {
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: () => "test-access-token",
        },
      });
      vi.mocked(useNavigate).mockReturnValue(() => {});

      render(<Home setUserId={() => {}} />);

      expect(checkAccessTokenService).toHaveBeenCalledWith("test-access-token");
    });

    test("checkAccessTokenServiceの返り値がundefinedでない場合、propsのsetUserIdに返り値のsubプロパティを引数として呼び、useNavigate()に/userpageを引数として呼ぶ", async () => {
      vi.mocked(checkAccessTokenService).mockResolvedValue({
        sub: "test-user-data",
      });
      const spyNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(spyNavigate);
      const spySetUserId = vi.fn();

      render(<Home setUserId={spySetUserId} />);

      await waitFor(() =>
        expect(spySetUserId).toHaveBeenCalledWith("test-user-data"),
      );
      expect(spyNavigate).toHaveBeenCalledWith("/userpage");
    });

    test("checkAccessTokenServiceの返り値がundefinedの場合、useNavigate()に/loginを引数として呼ぶ", async () => {
      vi.mocked(checkAccessTokenService).mockResolvedValue(undefined);
      const spyNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(spyNavigate);

      render(<Home setUserId={() => {}} />);

      await waitFor(() => expect(spyNavigate).toHaveBeenCalledWith("/login"));
    });
  });
});
