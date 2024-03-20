import {act, render} from "@testing-library/react";
import App from "../App.tsx";
import {BrowserRouter} from "react-router-dom";
import {Home} from "../pages/Home.tsx";
import {vi} from "vitest";
import {useState} from "react";
import {Login} from "../pages/Login.tsx";
import {UserPage} from "../pages/UserPage.tsx";

vi.mock("../pages/Home.tsx")
vi.mock("../pages/Login.tsx")
vi.mock("../pages/UserPage.tsx")
vi.mock("react",  () => {
    return {
        ...(vi.importActual('react')),
        useState: vi.fn((initialValue) => [initialValue, vi.fn()]),
    }
})
describe('App.tesxのテスト',()=>{
    describe('ルーティングに関して',()=>{

        test('/にアクセスした時、正しいPropsを含んでHomeコンポーネントを呼んでいること',async ()=>{
            const spySetUserId = vi.fn()
            vi.mocked(useState).mockReturnValue([null,spySetUserId])
            await renderWrappedApp('/')

            expect(Home).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        setUserId:spySetUserId
                    }
                ),
                {}
            )
        })
        test('/loginにアクセスした時、Loginコンポーネントを呼んでいること',async ()=>{

            await renderWrappedApp('/login')

            expect(Login).toHaveBeenCalled()
        })

        test('/userpageにアクセスした時、正しいPropsを含んでUserPageコンポーネントを呼んでいること',async ()=>{
            const spySetUserId = vi.fn()
            vi.mocked(useState).mockReturnValue(['test-user',spySetUserId])

            await renderWrappedApp('/userpage')

            expect(UserPage).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        userId : 'test-user',
                        setUserId : spySetUserId
                    }
                ),
                {}
            )
        })
    })
})

const renderWrappedApp = async (url: string) => {
    return await act(async () => {
        window.history.pushState({}, "", url)
        const { unmount } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        )
        return unmount
    })
}