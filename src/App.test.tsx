import {render,screen} from "@testing-library/react";
import App from "./App.tsx";

describe('App.tesxのテスト',()=>{
    test('Appをレンダリングすると、Vite + Reactの文字列が存在する',()=>{
        render(<App/>)

        expect(screen.getByText('Vite + React')).toBeInTheDocument()
    })
})