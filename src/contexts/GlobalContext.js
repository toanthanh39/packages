import { createContext, useContext } from "react";
import React from "react";
import useLocalStorage from "use-local-storage";
const Gcontext = createContext(null);
function GlobalContext(props) {
  const [screenLocal, setScreenLocal] = useLocalStorage("screen", "default");
  const [screen, setScreen] = React.useState(screenLocal);
  const [token, setToken] = React.useState("");
  const [dataWindow, setDataWindow] = React.useState({});
  const [dataUpdate, setDataUpdate] = React.useState({});
  const [loginData, setLoginData] = React.useState({});
  const [order, setOrder] = React.useState(null);
  const [coupons, setCoupons] = React.useState({});
  const [inforCheckout, setInforCheckout] = React.useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    pay: 1,
  });
  const value = {
    screen,
    setScreen,
    setScreenLocal,
    token,
    setToken,
    inforCheckout,
    setInforCheckout,
    dataWindow,
    setDataWindow,
    dataUpdate,
    setDataUpdate,
    loginData,
    setLoginData,
    order,
    setOrder,
    coupons,
    setCoupons,
  };
  return <Gcontext.Provider value={value}>{props.children}</Gcontext.Provider>;
}
function UseGlobalContext() {
  const context = useContext(Gcontext);
  if (typeof context === "undefined")
    throw new Error("UseGlobalContext must be use inside GlobalContext");
  return context;
}
export { GlobalContext, UseGlobalContext };
