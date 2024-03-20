import {render, screen} from "@testing-library/react";
import {Login} from "../../pages/Login.tsx";
import {userEvent} from "@testing-library/user-event";

describe('Login.tsxのテスト',()=>{
    describe('レンダーされた時',()=>{
        test('ボタンとbaseの画像が表示される',()=>{
            render(<Login />)

            const loginButton = screen.getByRole('button')
            expect(loginButton).toBeInTheDocument()
            expect(loginButton.children[0]).toHaveAttribute('src','/src/assets/LineLoginButton/btn_login_base.png')
        })
    })

    describe('ボタンをホバーした際',()=>{

        test('hoverの画像が表示される',async ()=>{
            render(<Login />)

            const loginButton = screen.getByRole('button')
            await userEvent.hover(loginButton)

            expect(loginButton.children[0]).toHaveAttribute('src','/src/assets/LineLoginButton/btn_login_hover.png')
        })

        test('ホバー後に離脱するとbaseの画像が表示される',async ()=>{
            render(<Login />)

            const loginButton = screen.getByRole('button')
            await userEvent.hover(loginButton)
            await userEvent.unhover(loginButton)

            expect(loginButton.children[0]).toHaveAttribute('src','/src/assets/LineLoginButton/btn_login_base.png')
        })
    })

    describe('ボタンを押下すると',()=>{
        test('window.location.hrefが正しい値に変更されていること',async ()=>{
            let hrefArg = ""
            Object.defineProperty(window,"location",{
                value : {
                    get href() {
                        return 'initial-href';
                    },
                    set href(path) {
                        hrefArg = path;
                    },
                }
            })

            render(<Login />)
            const loginButton = screen.getByRole('button')
            await userEvent.click(loginButton)

            const lineId = import.meta.env.VITE_LINE_CHANNEL_ID
            const redirecturl = import.meta.env.VITE_REDIRECT_URL
            const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineId}&redirect_uri=${redirecturl}&state=12345abcde&scope=openid&nonce=09876xyz&max_age=30`
            expect(hrefArg).toBe(url)
        })
    })
})