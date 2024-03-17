import './App.css'
import {Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login.tsx";
import {Home} from "./pages/Home.tsx";

function App() {

  return (
    <>
        <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/home" element={<Home />}></Route>
        </Routes>
    </>
  )
}

export default App
