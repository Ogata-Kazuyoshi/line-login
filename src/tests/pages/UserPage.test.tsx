import { render, screen, waitFor } from "@testing-library/react";
import { UserPage } from "../../pages/UserPage.tsx";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { logoutRepository } from "../../repository/AuthRepository.ts";
import { AxiosRequestHeaders } from "axios";

vi.mock("react-router-dom");
vi.mock("../../repository/AuthRepository.ts");
describe("UserPage.tsxのテスト", () => {
  test("レンダーされたとき、正しい要素が表示されている", () => {
    vi.mocked(useNavigate).mockReturnValue(() => {});

    render(<UserPage userId={"test-user"} setUserId={() => {}} />);

    expect(
      screen.getByText("Lineから取得したUserIdは下記です"),
    ).toBeInTheDocument();
    expect(screen.getByText("test-user")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログアウトする" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "IDトークンの検証をする" }),
    ).toBeInTheDocument();
  });

  test("ログアウトボタンを押すと、logoutRepositoryを正しい引数で呼び、その返り値のstatusが200の場合、useNavigate()に/を引数として呼ぶ", async () => {
    vi.stubGlobal("localStorage", {
      getItem: vi
        .fn()
        .mockImplementation((params) =>
          params === "access_token" ? "test-access-token" : null,
        ),
    });
    vi.mocked(logoutRepository).mockResolvedValue({
      status: 200,
      data: {}, //axiosResponseに合わせるために、色々なプロパティを定義しないとエラーになる
      statusText: "OK",
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders, // 型アサーションを使用
      },
    });
    const spyNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(spyNavigate);

    render(<UserPage userId={""} setUserId={() => {}} />);
    await userEvent.click(
      screen.getByRole("button", { name: "ログアウトする" }),
    );

    expect(logoutRepository).toHaveBeenCalledWith("test-access-token");
    await waitFor(() => expect(spyNavigate).toHaveBeenCalledWith("/"));
  });
});
