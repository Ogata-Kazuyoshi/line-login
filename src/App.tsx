import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login.tsx";
import { Home } from "./pages/Home.tsx";
import { useState } from "react";
import { UserPage } from "./pages/UserPage.tsx";

function App() {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home setUserId={setUserId} />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/userpage"
          element={<UserPage userId={userId} setUserId={setUserId} />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
