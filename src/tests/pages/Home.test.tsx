import {vi} from "vitest";
import {render, waitFor} from "@testing-library/react";
import {Home} from "../../pages/Home.tsx";
import {accessTokenGetService, checkAccessTokenService} from "../../service/AuthService.ts";
import {useNavigate} from "react-router-dom";

vi.mock("../../service/AuthService.ts")
vi.mock('react-router-dom')

const originalLocalStorage = window.localStorage
const originalURLParams = URLSearchParams
const originalLocation = window.location

describe('Home.tsxのテスト',()=>{
    afterEach(() => {
        vi.restoreAllMocks()
        // vi.resetModules();
        Object.defineProperty(window, "localStorage", {
            value: originalLocalStorage,
        })
        Object.defineProperty(window, "location", {
            value: originalLocation,
        })
        Object.defineProperty(window, "URLSearchParams", {
            value: originalURLParams
        })
    })

    describe('クエリパラメーターのチェックテスト',()=>{
        test('クエリパラメーターにcodeが含まれている場合、accessTokenGetServiceを正しい引数で呼ぶ',()=>{

            const spyUrlQuery = vi.fn()
            const mockSearchParams = {
                get: spyUrlQuery.mockReturnValue('abc'),
            };

            //location.searchのプロパティ値をモックする必要は今回のテストではないが、このようにできることも書いておく
            vi.stubGlobal('location', { search: 'mocked_search_string' });
            vi.stubGlobal('URLSearchParams', vi.fn().mockImplementation(() => mockSearchParams));
            vi.mocked(useNavigate).mockReturnValue(()=>{})


            render(<Home setUserId={()=>{}} />)

            expect(spyUrlQuery).toHaveBeenCalledWith('code')
            expect(accessTokenGetService).toHaveBeenCalledWith('abc')

        })
    })

    describe('checkAccessTokenServiceに関するテスト',()=>{

        test('レンダーされるとcheckAccessTokenServiceを正しい引数で呼ぶ',async ()=>{
            Object.defineProperty(window, 'localStorage',{
                value : {
                    getItem : () => 'test-access-token'
                }
            })
            vi.mocked(useNavigate).mockReturnValue(()=>{})

            render(<Home setUserId={()=>{}} />)

            expect(checkAccessTokenService).toHaveBeenCalledWith('test-access-token')
        })

        test('checkAccessTokenServiceの返り値がundefinedでない場合、propsのsetUserIdに返り値のsubプロパティを引数として呼び、useNavigate()に/userpageを引数として呼ぶ',async ()=>{
            vi.mocked(checkAccessTokenService).mockResolvedValue({
                sub:'test-user-data'
            })
            const spyNavigate = vi.fn()
            vi.mocked(useNavigate).mockReturnValue(spyNavigate)
            const spySetUserId = vi.fn()

            render(<Home setUserId={spySetUserId} />)

            await waitFor(
                ()=> expect(spySetUserId).toHaveBeenCalledWith('test-user-data')
            )
            expect(spyNavigate).toHaveBeenCalledWith('/userpage')
        })

        test('checkAccessTokenServiceの返り値がundefinedの場合、useNavigate()に/loginを引数として呼ぶ',async ()=>{
            vi.mocked(checkAccessTokenService).mockResolvedValue(undefined)
            const spyNavigate = vi.fn()
            vi.mocked(useNavigate).mockReturnValue(spyNavigate)

            render(<Home setUserId={()=>{}} />)

            await waitFor(
                () => expect(spyNavigate).toHaveBeenCalledWith('/login')
            )

        })
    })
})