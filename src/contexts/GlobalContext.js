import { createContext, useContext } from "react";
import React from "react";
const Gcontext = createContext(null);
function GlobalContext(props) {
  const [screen, setScreen] = React.useState("login");
  const value = { screen, setScreen };
  return <Gcontext.Provider value={value}>{props.children}</Gcontext.Provider>;
}
function UseGlobalContext() {
  const context = useContext(Gcontext);
  if (typeof context === "undefined")
    throw new Error("UseGlobalContext must be use inside GlobalContext");
  return context;
}
export { GlobalContext, UseGlobalContext };
