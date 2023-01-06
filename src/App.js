import "./App.css";
import React from "react";
import Checkout from "./components/Checkout";
import Infor from "./components/Infor";
import Address from "./components/Address";
import { UseGlobalContext } from "./contexts/GlobalContext";
import useCheckouts from "./hooks/useCheckouts";
import Default from "./components/Default";
import Login from "./components/Login";
import Thankyou from "./components/Thankyou";
import Progess from "./components/child/Progess";

function App() {
  const {
    screen,
    setScreen,
    setScreenLocal,
    setToken,
    setCity,
    setLoginData,
    loginData,
  } = UseGlobalContext();
  const { fetchDataCheckouts, fetDataAccount } = useCheckouts();
  const [loading, setLoading] = React.useState(false);
  const [isFetchingCity, setIsFetchingCity] = React.useState(false);
  const handleChageScreen = (screen) => {
    setScreen(screen);
    setScreenLocal(screen);
  };

  React.useEffect(() => {
    setLoading(true);
    const data = fetchDataCheckouts();
    const data_login = fetDataAccount();

    Promise.all([data, data_login])
      .then((data) => {
        setLoginData({ ...data[1] });
        setLoading(false);
        if (screen !== "thankyou") {
          if (data[0].checkouts !== null) {
            setCity(data[0].checkouts.available_provinces);
            if (screen === "default" || screen === "login") {
              if (data[1].email !== null || data[1].first_name !== null) {
                handleChageScreen("infor");
              } else {
                handleChageScreen("login");
              }
            } else if (screen === "checkout" || screen === "infor") {
              if (data[1].email !== null || data[1].first_name !== null) {
                handleChageScreen("infor");
              } else {
                handleChageScreen("checkout");
              }
            }
          } else {
            handleChageScreen("default");
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        window.alert("some thing went wrong ! Please check your information");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
    // if (data) {
    //   data
    //     .then((res) => {
    //       setLoading(false);
    //       if (screen !== "thankyou") {
    //         if (res.checkouts !== null) {
    //           setLoading(false);
    //           setCity(res.checkouts.available_provinces);

    //           if (screen === "default") {
    //             handleChageScreen("login");
    //           }
    //         } else {
    //           handleChageScreen("default");
    //           setLoading(false);
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       setLoading(false);
    //     });
    // }
    const script = document.createElement("script");

    script.src = "https://hstatic.net/services/countries.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  React.useLayoutEffect(() => {
    const dataAddress = window.Countries;

    // setCity([...dataAddress.countryId]);
  });
  React.useEffect(() => {
    const token = document.getElementsByName("__RequestVerificationToken");
    if (token) {
      setToken(token[0].defaultValue);
    }
  });

  return (
    <React.Fragment>
      {loading ? (
        <Progess className="bg-black"></Progess>
      ) : (
        <div>
          {screen === "thankyou" && (
            <Thankyou handleChageScreen={handleChageScreen} />
          )}
          <div className="xl:w-[60vw] relative left-[50%] translate-x-[-50%] ">
            {screen === "default" && <Default />}
            {screen === "login" && (
              <Login handleChageScreen={handleChageScreen} />
            )}
            {screen === "infor" && (
              <Infor handleChageScreen={handleChageScreen} />
            )}
            {screen === "address" && (
              <Address handleChageScreen={handleChageScreen} />
            )}
            {screen === "checkout" && (
              <Checkout screen={screen} handleChageScreen={handleChageScreen} />
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
