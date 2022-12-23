import "./App.css";
import React from "react";
import Login from "./components/Login";
import Checkout from "./components/Checkout";
import Infor from "./components/Infor";
import Address from "./components/Address";
import { UseGlobalContext } from "./contexts/GlobalContext";
import useCheckouts from "./hooks/useCheckouts";
import Default from "./components/Default";

function App() {
  const { screen, setScreen } = UseGlobalContext();
  const { fetchDataCheckouts, fetDataAccount } = useCheckouts();
  const handleChageScreen = (screen) => {
    setScreen(screen);
  };
  React.useEffect(() => {
    const data = fetDataAccount();
    if (data) {
      data.then((res) => {
        if (res.email !== null) {
          setScreen("login");
        } else {
          setScreen("login");
        }
      });
    }
  }, []);

  return (
    <div>
      {/* <div className="flex gap-5">
        <button onClick={() => setScreen("login")}>Login</button>
        <button onClick={() => setScreen("infor")}>Infor</button>
        <button onClick={() => setScreen("address")}>Address</button>
        <button onClick={() => setScreen("checkout")}>Checkout</button>
      </div> */}
      {screen === "default" && <Default />}
      {screen === "login" && <Login handleChageScreen={handleChageScreen} />}
      {screen === "infor" && <Infor />}
      {screen === "address" && <Address />}
      {screen === "checkout" && (
        <Checkout handleChageScreen={handleChageScreen} />
      )}
    </div>
  );
}

export default App;
