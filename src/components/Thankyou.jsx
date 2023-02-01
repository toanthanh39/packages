import React from "react";
import "./component.css";
import { UseGlobalContext } from "../contexts/GlobalContext";
import axios from "axios";
import Swiper, { SwiperSlide } from "swiper/react";
const Thankyou = ({ handleChageScreen }) => {
  const { order, loginData } = UseGlobalContext();
  const [html, setHTML] = React.useState({ __html: "" });

  //useEffect
  React.useEffect(() => {
    // const wrapper = document.getElementById("tk_wrapper");
    // function getCanvas() {
    //   const c = document.getElementById("canvas");
    //   const ctx = c.getContext("2d");

    //   let cwidth, cheight;
    //   let shells = [];
    //   let pass = [];

    //   const colors = [
    //     "#FF5252",
    //     "#FF4081",
    //     "#E040FB",
    //     "#7C4DFF",
    //     "#536DFE",
    //     "#448AFF",
    //     "#40C4FF",
    //     "#18FFFF",
    //     "#64FFDA",
    //     "#69F0AE",
    //     "#B2FF59",
    //     "#EEFF41",
    //     "#FFFF00",
    //     "#FFD740",
    //     "#FFAB40",
    //     "#FF6E40",
    //   ];

    //   window.onresize = function () {
    //     reset();
    //   };
    //   reset();
    //   function reset() {
    //     cwidth = window.innerWidth;
    //     cheight = window.innerHeight;
    //     c.width = cwidth;
    //     c.height = cheight;
    //   }

    //   function newShell() {
    //     const left = Math.random() > 0.5;
    //     const shell = {};
    //     shell.x = 1 * left;
    //     shell.y = 1;
    //     shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
    //     shell.yoff = 0.01 + Math.random() * 0.007;
    //     shell.size = Math.random() * 6 + 3;
    //     shell.color = colors[Math.floor(Math.random() * colors.length)];

    //     shells.push(shell);
    //   }

    //   function newPass(shell) {
    //     const pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

    //     for (let i = 0; i < pasCount; i++) {
    //       const pas = {};
    //       pas.x = shell.x * cwidth;
    //       pas.y = shell.y * cheight;

    //       const a = Math.random() * 4;
    //       const s = Math.random() * 6;

    //       pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
    //       pas.yoff = s * Math.sin(a * (Math.PI / 2));

    //       pas.color = shell.color;
    //       pas.size = Math.sqrt(shell.size);

    //       if (pass.length < 1000) {
    //         pass.push(pas);
    //       }
    //     }
    //   }

    //   let lastRun = 0;
    //   Run();
    //   function Run() {
    //     let dt = 1;
    //     if (lastRun !== 0) {
    //       dt = Math.min(50, performance.now() - lastRun);
    //     }
    //     lastRun = performance.now();

    //     //ctx.clearRect(0, 0, cwidth, cheight);
    //     ctx.fillStyle = "rgba(0,0,0,0.25)";
    //     ctx.fillRect(0, 0, cwidth, cheight);

    //     if (shells.length < 10 && Math.random() > 0.96) {
    //       newShell();
    //     }

    //     for (let ix in shells) {
    //       const shell = shells[ix];

    //       ctx.beginPath();
    //       ctx.arc(
    //         shell.x * cwidth,
    //         shell.y * cheight,
    //         shell.size,
    //         0,
    //         2 * Math.PI
    //       );
    //       ctx.fillStyle = shell.color;
    //       ctx.fill();

    //       shell.x -= shell.xoff;
    //       shell.y -= shell.yoff;
    //       shell.xoff -= shell.xoff * dt * 0.001;
    //       shell.yoff -= (shell.yoff + 0.2) * dt * 0.00005;

    //       if (shell.yoff < -0.005) {
    //         newPass(shell);
    //         shells.splice(ix, 1);
    //       }
    //     }

    //     for (let ix in pass) {
    //       const pas = pass[ix];

    //       ctx.beginPath();
    //       ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
    //       ctx.fillStyle = pas.color;
    //       ctx.fill();

    //       pas.x -= pas.xoff;
    //       pas.y -= pas.yoff;
    //       pas.xoff -= pas.xoff * dt * 0.001;
    //       pas.yoff -= (pas.yoff + 5) * dt * 0.0005;
    //       pas.size -= dt * 0.002 * Math.random();

    //       if (pas.y > cheight || pas.y < -50 || pas.size <= 0) {
    //         pass.splice(ix, 1);
    //       }
    //     }
    //     requestAnimationFrame(Run);
    //   }
    // }
    // getCanvas();

    return () => {
      return;
    };
  }, []);

  React.useEffect(() => {
    const Test = async () => {
      try {
        const response = await axios.get(
          "https://namperfume.net/search?view=checkout"
        );
        if (response) {
          setHTML({ __html: response.data });
        }
      } catch (error) {
        console.log(error);
      }
    };
    Test();
  }, []);

  React.useEffect(() => {
    
    setTimeout(() => {
      window.location.reload();
      handleChageScreen("default");
    }, 6000);
  }, []);
  return (
    // <div
    //   id="tk_wrapper"
    //   className=" relative min-h-[80vh] w-full  z-[980] bg-black text-white text-center"
    // >
    //   <canvas className="absolute inset-0 z-[-1] " id="canvas"></canvas>
    //   <div className="absolute top-[5vh] left-[5vh] px-5 py-2 rounded-md text-center bg-green-500 text-white font-semibold inline-block  hover:scale-125 transition-all cursor-pointer   ">
    //     <button
    //       className=""
    //       onClick={() => {
    //         handleChageScreen("default");
    //       }}
    //     >
    //       BACK
    //     </button>
    //   </div>
    //   <div className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center p-5 ">
    //     <h1 id="thanks">
    //       <strong>NAMPERFUME</strong>
    //     </h1>
    //     <h1 id="thanks" className="font-[700] ">
    //       THANK YOU !
    //     </h1>
    //   </div>
    // </div>
    <div className="tk_wrapper w-full h-auto">
      {/* <div className="header_title h-[49px] w-full   border-[1px] border-x-0 border-[#D8D7D8]  ">
        <h2 className="text-red-500">NAMPERFUME</h2>
      </div> */}
      <div className="tk_title max-w-[1220px] m-[16px] lg:mx-auto  ">
        <h2 className="text-[#3A393A]  inline">Đặt hàng thành công</h2>
      </div>
      <div className="tk_body max-w-[1220px] mx-auto  h-auto flex flex-col md:flex-row gap-[16px]    ">
        <section className="flex-1 tk_body--left">
          <div className="tk_body--content ">
            <div className="w-full h-auto min-h-[203px] bg-[#F7F7F7] text-left  font-[400] p-[16px] md:py-[24px] md:px-[16px]">
              <p className="tk_heading mb-[16px] ">
                Xin chào{" "}
                <strong className="font-[700]">{loginData?.name + "!"}</strong>
              </p>
              <p className=" mb-[16px] ">
                Cảm ơn bạn đã mua hàng tại{" "}
                <strong className="text-[#D72229]">namperfume.</strong>
              </p>
              <p>
                Mã đơn hàng của bạn là 2WMZ22. Chúng tôi đã nhận được đơn đặt
                hàng và sẽ gửi cho bạn trong thời gian sớm nhất.
                {/* <br></br> Mời
                bạn theo dõi đơn hàng{" "}
                <a
                  style={{ textDecoration: "underline" }}
                  href="#"
                  className="text-[#0186FF] "
                >
                  tại đây
                </a> */}
              </p>
              <div className="tk_body--contact w-full mt-[16px]    ">
                <div className="flex-1 h-[34px] border-[1px] border-[#3a393a] rounded-[4px]">
                  <a className="w-full h-full" href="https://namperfume.net">
                    <button className="w-full h-full ">
                      Tiếp tục mua hàng
                    </button>
                  </a>
                </div>
                <a
                  href="tel:19000129"
                  className="flex justify-center items-center gap-[6px] flex-1 h-[34px] border-[1px] border-[#D72229] text-[#D72229] rounded-[4px]"
                >
                  <div className="flex gap-1">
                    <img
                      src="https://theme.hstatic.net/1000340570/1000964732/14/co_phone.svg"
                      alt=""
                    />
                    <div className="w-full h-full">
                      1900 0129 (9:00 - 21:00)
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="tk_order w-full md:w-[293px]   h-full tk_body--right">
          <div className="tk_order--content">
            <div className="group  border-solid border-[1px] border-[#D8D7D8] pt-[8px] px-[16px] ">
              <p className="font-[700]">Đơn hàng</p>

              {order?.line_items.length > 0 &&
                order.line_items.map((item) => (
                  <div
                    key={item.product_id}
                    id="order_item"
                    className="flex border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] h-auto min-h-[103px] gap-[8px]  first:pt-[8px] last:border-none pt-[16px]"
                  >
                    <div className="w-[87px] h-[87px] my-auto ">
                      <img className="w-full h-full" src={item.image} alt="" />
                    </div>
                    <div className="p-[4px] text-[12px] flex-1 ">
                      <h2 className="font-[700] min-h-[15px]  leading-[15px] mb-[4px]">
                        {item.product_title}
                      </h2>

                      <p className="text-[1em] leading-[15px] mb-[4px]">
                        {item.title.slice(0, item.title.length - 5)}
                      </p>
                      <p className="text-[1em] leading-[15px] mb-[4px]">
                        Capacity: {item.title.slice(-5)}
                      </p>
                      <p className="text-[1em] leading-[15px] inline-block mb-[4px]">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-[#D72229] inline-block float-right">
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            {order !== null && (
              <>
                <div className="border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] mt-[16px]">
                  <div className="mb-[16px]">
                    <p className="inline">Tạm tính</p>
                    <p className="inline-block float-right ">
                      {order !== null &&
                        order.subtotal_price_original.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                  <div className="mb-[16px]">
                    <p className="inline">Phí vận chuyển</p>
                    <p className="inline float-right">
                      {order !== null && order.shipping_price === 0
                        ? "Free"
                        : order.shipping_price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                    </p>
                  </div>
                  <div className="mb-[16px]">
                    <p className="inline">Giảm giá</p>
                    <p className="inline float-right text-[#004B8F]">
                      {order !== null &&
                        order.discount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                </div>
                <div className="mt-[24px]">
                  <p className="inline">Tổng cộng</p>
                  <p className="inline float-right text-[#D72229] font-[700]">
                    {order !== null &&
                      order.total_price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </p>
                  {/* <button
                    style={{ background: "#D72229", color: "#ffffff" }}
                    type="button"
                    disabled
                    className=" cursor-pointer block w-full border-none text-white rounded-[4px] h-[34px] bg-[#D72229] my-[40px]"
                  >
                    Thanh toán
                  </button> */}
                  {/* <div className="text-[14px] font-[400]">
                <p className="mb-[16px]">
                  Prices do not include import duties, which must be paid upon
                  delivery.import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper } from 'swiper';
import { Swiper } from 'swiper/react';
import { SwiperSlide } from 'swiper/react';
import { Swiper } from 'swiper/react';
import { Swiper } from 'swiper';
import { Swiper } from 'swiper/react';
import { Swiper } from 'swiper';

                </p>
                <p>
                  By completing the order process, I declare that I have read
                  and understand the General Terms & Conditions, the Return
                  Policy and the Privacy Policy as stated on NAMPERFUME.NET.
                </p>
              </div> */}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="max-w-[1220px] mx-auto mt-[16px] px-[16px] xl:p-0">
        <h1 className="text-[18px] font-[600]">Sản phầm liên quan</h1>
        <div
          dangerouslySetInnerHTML={html}
          id="related"
          className="w-full h-auto"
        ></div>
      </div>
    </div>
  );
};

export default Thankyou;
