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
import { useToggle } from "./hooks/useToggle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ResultCustom from "./components/child/ResultCustom";

function App() {
  const {
    screen,
    setScreen,
    setScreenLocal,
    setToken,
    setDataWindow,
    setLoginData,
  } = UseGlobalContext();
  const { isOpen: loadingData, setHide, setShow } = useToggle(true);
  const { fetchDataCheckouts, fetDataAccount } = useCheckouts();
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  console.log("ma");
  //useHook
  const { setOrder, order } = UseGlobalContext();
  //Function
  const handleChageScreen = (screen) => {
    setScreen(screen);
    setScreenLocal(screen);
  };
  // useEffect
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://hstatic.net/services/countries.js";
    script.async = true;
    document.body.appendChild(script);
    const getCity = (ms) => {
      return new Promise((resolve, reject) =>
        setTimeout(async function () {
          if (window.Countries !== undefined) {
            const dataAddress = window.Countries;
            setDataWindow({ ...dataAddress });
            resolve();
          } else {
            reject();
          }
        }, ms)
      );
    };
    const fetch = async () => {
      setShow();
      await getCity(4000)
        .then(() => {})
        .catch((error) => {
          setIsError(true);
        })
        .finally(() => {
          setHide();
        });
    };
    fetch();
  }, []);
  React.useEffect(() => {
    setLoading(true);

    const data = fetchDataCheckouts();
    const data_login = fetDataAccount();

    Promise.all([data, data_login])
      .then((data) => {
        setLoginData({ ...data[1] });
        setLoading(false);
        if (data[0].checkouts !== null) {
          setOrder(data[0].checkouts);
          if (screen !== "thankyou") {
            if (data[0].checkouts !== null) {
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
        } else {
          handleChageScreen("default");
        }
      })
      .catch((err) => {
        window.alert("some thing went wrong ! Please check your information");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    const token = document.getElementsByName("__RequestVerificationToken");
    if (token) {
      // console.log(token[0].defaultValue);
      setToken(token[0].defaultValue);
    }
  });

  return (
    <React.Fragment>
      {loading || loadingData ? (
        <Progess className="bg-black"></Progess>
      ) : isError ? (
        <ResultCustom
          title="Your connection has a problem"
          sub="Sorry, please click reload !"
          buttonTitle="Reload"
        ></ResultCustom>
      ) : (
        <div>
          {screen !== "login" && (
            <div className="w-full h-[41px] flex justify-center items-center text-red-500 border-[1px] border-x-0 border-t-0 border-[#D8D7D8]">
              <a href="https://namperfume.net/">
                <img
                  src="https://theme.hstatic.net/1000340570/1000964732/14/co_logo.svg"
                  alt="logo"
                  lazy
                />
              </a>
            </div>
          )}
          {screen === "thankyou" && (
            <Thankyou handleChageScreen={handleChageScreen} />
          )}
          <div className="w-full h-auto">
            {screen === "default" && <Default />}
            {screen === "login" && (
              <Login handleChageScreen={handleChageScreen} />
            )}
            {screen === "infor" && (
              <Infor handleChageScreen={handleChageScreen} />
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
