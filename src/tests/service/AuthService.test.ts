import * as AuthService from "../../service/AuthService.ts"
import {
    accessTokenGetRepository,
    checkIDTokenRepository,
    checkTokenRepository,
    getUserIdRepository
} from "../../repository/AuthRepository.ts";
import {vi} from "vitest";
import {AxiosResponse} from "axios";
import {waitFor} from "@testing-library/react";

vi.mock("../../repository/AuthRepository.ts")

const originalLocalStorage = window.localStorage
const originalLocation = window.location
describe('AuthService.tsxのテスト',()=>{
    afterEach(()=>{
        // Object.defineProperty(window,"location",{
        //     value : originalLocation
        // })
        vi.stubGlobal("localStorage",originalLocalStorage)
        vi.stubGlobal("location",originalLocation)
        vi.restoreAllMocks()
    })

    describe('checkAccessTokenServiceを呼ぶと',()=>{
        test("access_tokenがnullでないかつ,checkTokenRepositoryがundefinedでなければ,getUserIdServiceの返り値を返す",async ()=>{
            vi.mocked(checkTokenRepository)
                .mockImplementation(
                    param => Promise.resolve(param === "test-access-token" ? {
                status: 200,
            } as AxiosResponse : undefined) )
            vi.mocked(getUserIdRepository)
                .mockImplementation(param => Promise.resolve
                    (param === 'test-access-token' ?
                        {sub: "test-user-id"} :
                        undefined
                    )
                )

            const res = await AuthService.checkAccessTokenService('test-access-token')

            expect(res).toEqual({sub:"test-user-id"})
        })
    })

    describe('accessTokenGetServiceを呼ぶと',()=>{

        test('accessTokenGetRepository(code)を呼ぶ',()=>{
            AuthService.accessTokenGetService('abcd')

            expect(accessTokenGetRepository).toHaveBeenCalledWith('abcd')
        })
        test('accessTokenGetRepositoryの返り値がundefined出ない場合は、localStorageにaccess_tokenとid_tokenをセットする',async ()=>{
            vi.mocked(accessTokenGetRepository).mockResolvedValue({
                status: 200,
                data: {
                    access_token: 'test-access-token',
                    id_token: 'test-id-token'
                },
            } as AxiosResponse)
            const spySetItemArg:string[][] = []
            vi.stubGlobal('localStorage', {
                setItem : vi.fn().mockImplementation((param1,param2)=>{
                    spySetItemArg.push([param1,param2])
                })
            })
            let spyHref:string = ""
            vi.stubGlobal("location",{
                get href(){
                    return 'initial-href'
                },
                set href(arg) {
                    spyHref = arg
                }
            })

            AuthService.accessTokenGetService('abcd')

            expect(accessTokenGetRepository).toHaveBeenCalledWith('abcd')
            await waitFor(
                ()=> {
                    expect(spySetItemArg[0]).toEqual(['access_token','test-access-token'])
                    expect(spySetItemArg[1]).toEqual(['id_token','test-id-token'])
                }
            )
            expect(spyHref).toBe(import.meta.env.VITE_REDIRECT_URL)
        })
    })

    describe('checkIDTokenServiceを呼ぶと',()=>{
        describe('idTokenがnullでないとき',()=>{
            test('checkIDTokenRepositoryを正しい引数で呼ぶ',()=>{
                AuthService.checkIDTokenService('abcde')

                expect(checkIDTokenRepository).toHaveBeenCalledWith('abcde')
            })

            test('checkIDTokenRepositoryの返り値がundefined出ない場合localstorageのsetItemメソッドを正しい引数で呼ぶ',async ()=>{
                vi.mocked(checkIDTokenRepository).mockResolvedValue({
                    status: 200,
                    data: {
                        iss : 'test-iss'
                    },
                } as AxiosResponse)
                const spySetItem = vi.fn()
                vi.stubGlobal('localStorage',{
                    setItem: spySetItem
                })

                await AuthService.checkIDTokenService("abcde")

                await waitFor(
                    () => expect(spySetItem).toHaveBeenCalledWith('iss','test-iss')
                )
            })

        })

        test('idTokenがnullのとき、checkIDTokenRepositoryを呼ばない',()=>{
            AuthService.checkIDTokenService(null)

            expect(checkIDTokenRepository).not.toHaveBeenCalled()
        })

    })
})