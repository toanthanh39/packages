import React from "react";

const Infor = () => {
  return (
    <div className="w-full h-auto p-[16px] overflow-x-hidden">
      <div className="w-full h-auto mt-[8px]">
        <h3 className="text-center mb-[24px]">Thanh toán</h3>
        <div className="w-full">
          <form action="" className="w-full flex flex-col gap-[16px]">
            <h1 className=" text-[20px]">Thông tin giao hàng</h1>
            <div className="">
              <div className="inline-block bg-[#004B8F] text-white rounded-[4px] text-center mb-[8px] pl-[10px] py-[2px] px-[10px] ">
                <p className="text-[10px]">Văn phòng</p>
              </div>
              <div className="flex  items-center justify-start gap-1 mb-[8px]">
                <p>Nam Nguyen</p>
                <p>-</p>
                <p>0123456789</p>
              </div>
              <p>420/6 Lê Văn Sỹ P.14, Q3, TP. Hồ Chí Minh</p>
            </div>
            <div
              id="slide"
              className="w-full h-full overflow-hidden relative  "
            >
              <div className="flex gap-5 overflow-x-scroll relative ">
                <div className="w-[293px] flex-shrink-0 h-[137px] bg-blue-300  relative"></div>
                <div className="w-[293px]  flex-shrink-0 h-[137px] bg-blue-300  relative"></div>
                <div className="w-[293px] flex-shrink-0  h-[137px] bg-blue-300  relative"></div>
                <div className="w-[293px] flex-shrink-0  h-[137px] bg-blue-300  relative"></div>
                <div className="w-[293px]  flex-shrink-0 h-[137px] bg-blue-300  relative"></div>
              </div>
            </div>
            <button className="w-fit  bg-transparent border border-x-0 border-t-0 border-slate-700 leading-[20px] text-[#3A393A] font-[400] mb-[8px]">
              Thêm địa chỉ
            </button>
            <div className="">
              <label
                className="block mb-[8px] text-[#3A393A] font-[700]"
                htmlFor="note"
              >
                Ghi chú
              </label>
              <input
                id="note"
                className="h-[50px] w-full pl-[16px] border-1 border-[#D8D7D8] "
                type="text"
                placeholder="Nhập ghi chú (nếu có)"
              />
            </div>
            <div className="mt-[24px]">
              <h3 className="mb-[16px] font-[500] text-[20px] text-[#3A393A] leading-[24px]">
                Phương thức vận chuyển
              </h3>
              <div className="h-[72px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] ">
                <div className="">
                  <img src="/asset/images/Box_light.png " alt="" />
                </div>
                <div className="">
                  <p className="font-[700] text-[14px]">
                    Giao hàng miễn phí toàn quốc
                  </p>
                  <p className="text-[12px] leading-[15px] text-[#3A393A]">
                    Giao nhanh 2H TP.HCM
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[24px]">
              <h3 className="mb-[16px] font-[500] text-[20px] text-[#3A393A] leading-[24px]">
                Phương thức thanh toán
              </h3>
              <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] mb-[8px]  ">
                <input type="radio" name="pay" id="pay" disabled checked />
                <div className="">
                  <p className="text-[12px] leading-[15px] text-[#3A393A]">
                    <strong className="font-[700] leading-[17px]">COD </strong>
                    (Thanh toán khi nhận hàng)
                  </p>
                </div>
              </label>
              <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] mb-[8px]">
                <input type="radio" name="pay" id="pay" disabled />
                <div className="">
                  <p className="text-[12px] leading-[15px] text-[#3A393A]">
                    <strong className="font-[700] leading-[17px]">
                      CHUYỂN KHOẢN
                    </strong>
                    (Thanh toán bằng chuyển khoản)
                  </p>
                </div>
              </label>
              <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] mb-[8px] ">
                <input type="radio" name="pay" id="pay" disabled />
                <div className="">
                  <p className="text-[12px] leading-[15px] text-[#3A393A]">
                    <strong className="font-[700] leading-[17px]">
                      NGÂN HÀNG{" "}
                    </strong>
                    (Thanh toán qua ngân hàng)
                  </p>
                </div>
              </label>
            </div>
            <div className="mt-[24px]">
              <h3 className="mb-[16px] font-[500] text-[20px] text-[#3A393A] leading-[24px]">
                Thông tin xuất hoá đơn
              </h3>
              <div className=" border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] p-[16px]">
                <div className="flex gap-[10px] items-start ">
                  <img src="/asset/images/success.png" alt="" />
                  <p>
                    <strong className="font-[700]">Xuất hoá đơn</strong> (Quý
                    khách cần xuất hoá đơn mua hàng, vui lòng nhập thông tin tại
                    đây)
                  </p>
                </div>
                <div className="">
                  <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8] ">
                    <input
                      type="email"
                      className=" relative h-full w-full p-1 border-x-0 border-t-0 bg-transparent hover:outline-none "
                      id="email"
                    />
                    <label
                      htmlFor="email"
                      className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                    >
                      Email nhận hoá đơn
                    </label>
                  </div>
                  <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8]">
                    <input
                      type="text"
                      className=" relative h-full w-full p-1 border-x-0 border-t-0 bg-transparent hover:outline-none "
                      id="name"
                    />
                    <label
                      htmlFor="name"
                      className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                    >
                      Tên người nhận hoá đơn
                    </label>
                  </div>
                  <div className="group relative h-[40px] mt-[16px]border border-x-0 border-t-0 border-[#D8D7D8] ">
                    <input
                      type="text"
                      className=" relative h-full w-full p-1 border-x-0 border-t-0 bg-transparent hover:outline-none "
                      id="company"
                    />
                    <label
                      htmlFor="company"
                      className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                    >
                      Tên công ty
                    </label>
                  </div>
                  <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8]">
                    <input
                      type="number"
                      className=" relative h-full w-full p-1 border-x-0 border-t-0 bg-transparent hover:outline-none "
                      id="tax"
                    />
                    <label
                      htmlFor="tax"
                      className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                    >
                      Mã số thuế
                    </label>
                  </div>
                  <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8]">
                    <input
                      type="text"
                      className=" relative h-full w-full p-1 border-x-0 border-t-0 bg-transparent hover:outline-none "
                      id="address"
                    />
                    <label
                      htmlFor="address"
                      className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                    >
                      Địa chỉ công ty
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="group mt-[24px]  py-[8px] px-[16px] border border-x-0 border-t-0 border-[#D8D7D8] ">
              <p className="font-[700]">Đơn hàng</p>
              <div className="flex border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] h-[103px] gap-[8px]">
                <div className="w-[87px] h-[87px]    ">
                  <img src="/asset/images/product.png" alt="" />
                </div>
                <div className="p-[4px] text-[12px]">
                  <h2 className="font-[700] h-[15px]  leading-[15px]">
                    DOLCE & GABBANA
                  </h2>

                  <p className="text-[1em] leading-[15px]">
                    Dolce & Gabbana Dolce Lily Intense Eau de Toilette
                  </p>
                  <p className="text-[1em] leading-[15px]">Capacity: 100ml</p>
                  <p className="text-[1em] leading-[15px] inline-block">
                    Quantity: 1
                  </p>
                  <p className="text-[#D72229] inline-block float-right">
                    1,290,000đ
                  </p>
                </div>
              </div>
              <div className="flex border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] h-[103px] gap-[8px]">
                <div className="w-[87px] h-[87px]    ">
                  <img src="/asset/images/product.png" alt="" />
                </div>
                <div className="p-[4px] text-[12px]">
                  <h2 className="font-[700] h-[15px]  leading-[15px]">
                    DOLCE & GABBANA
                  </h2>

                  <p className="text-[1em] leading-[15px]">
                    Dolce & Gabbana Dolce Lily Intense Eau de Toilette
                  </p>
                  <p className="text-[1em] leading-[15px]">Capacity: 100ml</p>
                  <p className="text-[1em] leading-[15px] inline-block">
                    Quantity: 1
                  </p>
                  <p className="text-[#D72229] inline-block float-right">
                    1,290,000đ
                  </p>
                </div>
              </div>
              <div className="flex border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] h-[103px] gap-[8px]">
                <div className="w-[87px] h-[87px]    ">
                  <img src="/asset/images/product.png" alt="" />
                </div>
                <div className="p-[4px] text-[12px]">
                  <h2 className="font-[700] h-[15px]  leading-[15px]">
                    DOLCE & GABBANA
                  </h2>

                  <p className="text-[1em] leading-[15px]">
                    Dolce & Gabbana Dolce Lily Intense Eau de Toilette
                  </p>
                  <p className="text-[1em] leading-[15px]">Capacity: 100ml</p>
                  <p className="text-[1em] leading-[15px] inline-block">
                    Quantity: 1
                  </p>
                  <p className="text-[#D72229] inline-block float-right">
                    1,290,000đ
                  </p>
                </div>
              </div>
              <div className=" flex border-solid border-x-0 border-t-0 border-[#D8D7D8] h-[103px] gap-[8px] last:border-y-0">
                <div className="w-[87px] h-[87px]    ">
                  <img src="/asset/images/product.png" alt="" />
                </div>
                <div className="p-[4px] text-[12px]">
                  <h2 className="font-[700] h-[15px]  leading-[15px]">
                    DOLCE & GABBANA
                  </h2>

                  <p className="text-[1em] leading-[15px]">
                    Dolce & Gabbana Dolce Lily Intense Eau de Toilette
                  </p>
                  <p className="text-[1em] leading-[15px]">Capacity: 100ml</p>
                  <p className="text-[1em] leading-[15px] inline-block">
                    Quantity: 1
                  </p>
                  <p className="text-[#D72229] inline-block float-right">
                    1,290,000đ
                  </p>
                </div>
              </div>
            </div>
            <div className="">
              <h4>Mã giảm giá</h4>
              <div className="flex gap-[8px] mt-[8px] h-[31px]">
                <input
                  type="text"
                  className="rounded-[4px] border-solid border-[1px] border-[#898889] h-full flex-1"
                />
                <button className="w-[65px] h-full bg-[#898889] text-white border-none hover:bg-blue-500">
                  Áp dụng
                </button>
              </div>
            </div>
            <div className="border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8]">
              <div className="mb-[16px]">
                <p className="inline">Tạm tính</p>
                <p className="inline-block float-right ">3,200,000đ</p>
              </div>
              <div className="mb-[16px]">
                <p className="inline">Phí vận chuyển</p>
                <p className="inline float-right">Free</p>
              </div>
            </div>
            <div className="">
              <p className="inline">Tổng cộng</p>
              <p className="inline float-right text-[#D72229] font-[700]">
                3,200,000đ
              </p>
              <button className=" block w-full border-none text-white rounded-[4px] h-[34px] bg-[#D72229] my-[40px]">
                Thanh toán
              </button>
              <div className="text-[14px] font-[400]">
                <p className="mb-[16px]">
                  Prices do not include import duties, which must be paid upon
                  delivery.
                </p>
                <p>
                  By completing the order process, I declare that I have read
                  and understand the General Terms & Conditions, the Return
                  Policy and the Privacy Policy as stated on NAMPERFUME.NET.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Infor;
