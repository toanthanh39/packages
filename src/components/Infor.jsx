import React from "react";
import useCheckouts from "../hooks/useCheckouts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { message } from "antd";
import {
  CloseCircleOutlined,
  DoubleLeftOutlined,
  LoadingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { BsPencilSquare } from "react-icons/bs";
import ToolipCustom from "./child/ToolipCustom";
import { FcShipped } from "react-icons/fc";
import { UseGlobalContext } from "../contexts/GlobalContext";
import { Skeleton } from "antd";
import PopupCustom from "./child/PopupCustom";
import UpdateAddress from "./UpdateAddress";
import { useToggle } from "../hooks/useToggle";
import CollapseCustom from "./child/CollapseCustom";
import Progess from "./child/Progess";
const schema = yup.object({
  pay: yup.number().required("Please choose status"),
});

const Infor = ({ handleChageScreen }) => {
  // state
  const [cp, setCp] = React.useState("");
  const [data, setData] = React.useState(null);
  const [cartInfor, setCartInfor] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingCP, setLoadingCP] = React.useState(false);
  const [listAddress, setListAddress] = React.useState([]);
  const [change, setChange] = React.useState(1);
  const [inforAddress, setInforAddress] = React.useState({});

  // useHook
  const {
    fetchDataCheckouts,
    getCart,
    getListAddress,
    deleteAddress,
    postPayment,
    completeCheckout,
    postUpdateCart,
  } = useCheckouts();
  const { token, setDataUpdate, loginData } = UseGlobalContext();
  const [messageApi, contextHolder] = message.useMessage();
  const { isOpen, setHide, setShow } = useToggle(false);
  const openMessage = ({ type = "success", content = "" }) => {
    messageApi.open({
      type: type,
      content: content,
      duration: 3,
      style: {
        position: "relative",
        top: "10vh",
        zIndex: 999999,
      },
    });
  };
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email_kh: "",
      address_kh: "",
      company_kh: "",
      tax_kh: "",
      name_kh: "",
    },
  });

  // Funtion
  const onSubmit = async (dataX) => {
    const noteJSON = {
      email_kh: dataX.email_kh,
      address_kh: dataX.address_kh,
      company_kh: dataX.company_kh,
      tax_kh: dataX.tax_kh,
      name_kh: dataX.name_kh,
    };
    if (data.shipping_address.address == null) {
      openMessage({
        type: "warning",
        content: "Bạn chưa có địa chỉ giao hàng! Vui  lòng thêm địa chỉ",
        zInex: "9990",
      });
      return;
    }
    const resPayment = postPayment({
      payID: dataX.pay,
    });
    // if (
    //   dataX.email_kh !== "" &&
    //   dataX.name_kh !== "" &&
    //   dataX.tax_kh !== "" &&
    //   dataX.address_kh !== ""
    // ) {
    var resNote = postUpdateCart({
      note: JSON.stringify(noteJSON),
    });
    // }
    const body = new URLSearchParams();
    body.append("form_type", "checkout");
    body.append("utf8", "true");
    body.append("__RequestVerificationToken", token);
    const res_complete = completeCheckout({ body });

    Promise.all([resPayment, res_complete])
      .then((data) => {
        if (data[0].error === false && data[1].status === 200) {
          setTimeout(() => {
            setLoading(false);
            handleChageScreen("thankyou");
          }, 2500);
        } else {
          window.alert("something went wrong ! Please check your information");
          return;
        }
      })
      .catch((err) => {
        console.log("🚀 ~ file: Infor.jsx:131 ~ onSubmit ~ err", err);
        window.alert("something went wrong ! Please check your information");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onApplyCoupon = async () => {
    if (cp === "") {
      openMessage({
        type: "success",
        content: "Bạn chưa có mã ? mua sắm để nhận ưu đãi !",
        duration: 30,
      });
      return;
    }
    try {
      setLoadingCP(true);
      const response = await axios.post(process.env.REACT_APP_API_DISCOUNT, {
        discount_code: cp,
      });
      if (response) {
        setData(response.data.checkouts);
        setLoadingCP(false);
        openMessage({
          type: "success",
          content: "Áp dụng mã thành công  !",
        });
      }
    } catch (error) {
      setLoadingCP(false);
      openMessage({
        type: "warning",
        content: "Mã khuyến mãi không hợp lệ !",
      });
    }
  };
  const handleDelete = async (id) => {
    const listUpdate = listAddress.filter((item) => item.id !== id);
    setListAddress(listUpdate);
    const res = deleteAddress(id);
    if (res) {
      openMessage({ content: "Delete success !" });
    }
  };
  const handleSetAddressUpdate = (data) => {
    setShow();
    const newName = data.full_name.trim().split(/(\s+)/);

    setDataUpdate({
      id: data.id,
      first_name: newName[2],
      last_name: newName[0],
      phone: data.phone,
      province_name: data.province_name,
      district_name: data.district_name,
      address: data.address,
      addressType: data.company.type,
      email: data.company.email,
      is_default: data.is_default,
      province_id: data.province_id,
      district_id: data.district_id,
    });
  };
  const handleActiveAddress = async (data) => {
    // const resLocation = postLocation({
    //   full_name: data.full_name,
    //   phone: data.phone,
    //   address: data.address,
    //   province_code: parseInt(data.province_id),
    //   district_code: parseInt(data.district_id),
    // });
    // if (resLocation) {
    //   console.log(
    //     "🚀 ~ file: Infor.jsx:153 ~ handleActiveAddress ~ resLocation",
    //     resLocation
    //   );
    // }
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SIGNIN,
        {
          country_code: "VN",
          full_name: data.full_name,
          province_code: data.province_name,
          district_code: data.district_name,
          phone: data.phone,
          address: data.address,
          ward_code: data.ward_name,
          email: data.company.email,
        },
        {
          headers: {
            " Content-Type": " application/json",
          },
        }
      );

      if (response) {
        openMessage({
          type: "success",
          content: "Áp dụng thông tin thành công!",
        });
        setChange(2);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: Infor.jsx:238 ~ handleActiveAddress ~ error",
        error
      );
      openMessage({
        type: "error",
        content: "thông tin k hợp lệ, bạn hãy chọn lại thông tin khác!",
      });
      return error;
    }
  };

  // useEffect
  React.useLayoutEffect(() => {
    setChange(1);
    setLoading(true);
    const res_data = fetchDataCheckouts();
    if (res_data) {
      res_data.then((res) => {
        if (res.checkouts !== null) {
          setData(res.checkouts);
          setInforAddress(res.checkouts.billing_address);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const res_cart = getCart();
    if (res_cart) {
      res_cart.then((res) => {
        setCartInfor(JSON.parse(res.note));
      });
    }
    if (loginData.email !== null) {
      const res_list_address = getListAddress();
      if (res_list_address) {
        res_list_address.then((res) => {
          setListAddress([...res]);
        });
      }
    }
  }, [change]);
  return (
    <div className="w-full h-auto p-[16px] overflow-x-hidden relative">
      {contextHolder}
      {isOpen && (
        <PopupCustom
          isOpen={isOpen}
          showModal={setShow}
          cancel={setHide}
          title=""
        >
          <UpdateAddress onClose={setHide} isChange={setChange}></UpdateAddress>
        </PopupCustom>
      )}
      {loginData.email === null && (
        <ToolipCustom title="Go back" className="absolute  left-[16px]">
          <DoubleLeftOutlined
            className="text-[20pt]   hover:scale-125 transition-all"
            onClick={() => {
              handleChageScreen("checkout");
            }}
          />
        </ToolipCustom>
      )}
      <div className="w-full h-auto  mt-[8px] ">
        <h3 className="text-center mb-[24px] font-[700] xl:text-[20pt]">
          Thanh toán
        </h3>

        <div className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-[16px]"
          >
            <h1 className=" text-[20px]">Thông tin giao hàng</h1>
            <div className="">
              {/* <div className="inline-block bg-[#004B8F] text-white rounded-[4px] text-center mb-[8px] pl-[10px] py-[2px] px-[10px] ">
                <p className="text-[10px]">Văn phòng</p>
              </div> */}
              {data && data.billing_address.address !== null ? (
                <>
                  <div className="flex  items-center justify-start gap-1 mb-[8px]">
                    <p>
                      {data && data.billing_address.full_name !== null
                        ? data.billing_address.full_name + "-"
                        : ""}
                    </p>

                    <p className="font-[700]">
                      {data && data.billing_address.phone !== null
                        ? data.billing_address.phone
                        : ""}
                    </p>
                  </div>
                  <p>
                    {data && data.billing_address.full_name !== null
                      ? data.billing_address.address +
                        "," +
                        (loginData.email == null
                          ? data.billing_address.ward_name +
                            "," +
                            data.billing_address.district_name +
                            "," +
                            data.billing_address.province_name
                          : "")
                      : ""}
                  </p>
                </>
              ) : (
                <div className="w-auto  flex-shrink-0 h-auto relative flex items-center gap-2">
                  <WarningOutlined className="text-yellow-500  " />
                  <h4 className="text-red-600">
                    Bạn chưa có địa chỉ giao hàng ! Vui lòng thêm địa chỉ
                  </h4>
                </div>
              )}
            </div>
            <div
              id="slide"
              className="w-full h-full overflow-hidden relative  "
            >
              <div
                id="slide_address"
                className="flex gap-[8px] overflow-x-scroll  relative"
              >
                {loading ? (
                  <Skeleton active></Skeleton>
                ) : listAddress.length > 0 ? (
                  listAddress.map((item) => (
                    <div
                      key={item.id}
                      className="group w-[293px] text-[14px] flex-shrink-0 h-auto min-h-[137px] bg-white rounded-tl-[8px] relative p-[18px] border-solid border-[1px] border-[#D8D7D8]"
                    >
                      <div className="absolute inset-0  transition-all duration-100 bg-black bg-opacity-60  flex justify-center items-center invisible  group-hover:visible rounded-tl-[8px]  ">
                        <button
                          type="button"
                          className="p-3 rounded-md bg-green-500 text-white"
                          onClick={() => {
                            handleActiveAddress(item);
                          }}
                        >
                          Dùng địa chỉ này
                        </button>
                      </div>
                      <CloseCircleOutlined
                        className="absolute top-0 left-0 font-bold z-10 group-hover:text-yellow-50 transition-all group-hover:scale-150   "
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                      />
                      <BsPencilSquare
                        className="absolute right-[16px] top-[18px] cursor-pointer z-10 group-hover:text-yellow-50 transition-all group-hover:scale-150  "
                        onClick={() => {
                          handleSetAddressUpdate(item);
                        }}
                      ></BsPencilSquare>
                      <p>{item.full_name}</p>
                      <p>{item.phone}</p>
                      <p>
                        {item.district_name}
                        {"-"}
                        {item.province_name}-
                      </p>
                      <p>{item.address}</p>
                    </div>
                  ))
                ) : (
                  <div className="w-auto  flex-shrink-0 h-auto relative flex items-center gap-2">
                    <WarningOutlined className="text-yellow-500  " />
                    <h4 className="text-red-600">
                      Bạn chưa có địa chỉ thanh toán ! Vui lòng thêm địa chỉ
                    </h4>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                handleChageScreen("address");
              }}
              className="w-fit  bg-transparent border border-x-0 border-t-0 border-slate-700 leading-[20px] text-[#3A393A] font-[400] mb-[8px]"
            >
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
                className="h-[50px] w-full pl-[16px] border border-1 border-[#D8D7D8] "
                type="text"
                placeholder="Nhập ghi chú (nếu có)"
                {...register("note")}
              />
            </div>
            <div className="mt-[24px]">
              <h3 className="mb-[16px] font-[500] text-[20px] text-[#3A393A] leading-[24px]">
                Phương thức vận chuyển
              </h3>
              <div className="h-[72px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] ">
                <div>
                  <FcShipped className="text-[16pt]"></FcShipped>
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
            <div className="mt-[24px] relative">
              <h3 className="mb-[16px] font-[500] text-[20px] text-[#3A393A] leading-[24px]">
                Phương thức thanh toán
              </h3>
              <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] mb-[8px]  cursor-pointer select-none  ">
                <input
                  type="radio"
                  name="pay"
                  id="pays"
                  className="cursor-pointer "
                  value={1}
                  // checked={inforCheckout.pay === 1 ? true : null}
                  // checked={data && data.payment_method_id === 1 ? true : null}
                  {...register("pay", {
                    onChange: (e) => {
                      // handleOnchangeValue(e);
                    },
                  })}
                />
                <div className="">
                  <p className="text-[12px] leading-[15px] text-[#3A393A]">
                    <strong className="font-[700] leading-[17px]">COD </strong>
                    (Thanh toán khi nhận hàng)
                  </p>
                </div>
              </label>
              <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] mb-[8px] cursor-pointer select-none ">
                <input
                  type="radio"
                  name="pay"
                  id="pays"
                  className="cursor-pointer "
                  value={2}
                  {...register("pay")}
                />

                <div className="">
                  <p className="text-[12px] leading-[15px] text-[#3A393A]">
                    <strong className="font-[700] leading-[17px]">
                      CHUYỂN KHOẢN
                    </strong>
                    (Thanh toán bằng chuyển khoản)
                  </p>
                </div>
              </label>
              <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] mb-[8px] cursor-pointer select-none  ">
                <input
                  type="radio"
                  name="pay"
                  id="pays"
                  className="cursor-pointer "
                  value={3}
                  disabled
                  {...register("pay")}
                />

                <div className="">
                  <p className="text-[12px] leading-[15px] text-[#3A393A]">
                    <strong className="font-[700] leading-[17px]">
                      NGÂN HÀNG
                    </strong>
                    (Thanh toán qua ngân hàng)
                  </p>
                </div>
              </label>
              {errors?.pay && (
                <p className="text-red-500 absolute right-0 top-0">*</p>
              )}
            </div>
            <div className="mt-[24px]">
              <h3 className="mb-[16px] font-[500] text-[20px] text-[#3A393A] leading-[24px]">
                Thông tin xuất hoá đơn
              </h3>
              <div className=" border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] ">
                <CollapseCustom>
                  <div id="xhd">
                    <form action="">
                      <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8]  ">
                        <input
                          type="email"
                          placeholder="1"
                          className=" relative h-full w-full p-1  bg-transparent hover:outline-none "
                          id="email"
                          {...register("email_kh")}
                        />
                        <label
                          htmlFor="email"
                          className="group-focus:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                        >
                          Email nhận hoá đơn
                        </label>
                        {errors?.email_kh && (
                          <p className="text-red-500 absolute right-0 top-0">
                            *
                          </p>
                        )}
                      </div>
                      <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8]  ">
                        <input
                          type="text"
                          placeholder="1"
                          className=" relative h-full w-full p-1  bg-transparent hover:outline-none "
                          id="name"
                          {...register("name_kh")}
                        />
                        <label
                          htmlFor="name"
                          className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                        >
                          Tên người nhận hoá đơn
                        </label>
                        {errors?.name_kh && (
                          <p className="text-red-500 absolute right-0 top-0">
                            *
                          </p>
                        )}
                      </div>
                      <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8] ">
                        <input
                          type="text"
                          placeholder="1"
                          className=" relative h-full w-full p-1  bg-transparent hover:outline-none "
                          id="company"
                          {...register("company_kh")}
                        />
                        <label
                          htmlFor="company"
                          className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                        >
                          Tên công ty
                        </label>
                        {errors?.company_kh && (
                          <p className="text-red-500 absolute right-0 top-0">
                            *
                          </p>
                        )}
                      </div>
                      <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8] ">
                        <input
                          type="number"
                          placeholder="1"
                          className=" relative h-full w-full p-1  bg-transparent hover:outline-none "
                          id="tax"
                          {...register("tax_kh")}
                        />
                        <label
                          htmlFor="tax"
                          className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                        >
                          Mã số thuế
                        </label>
                        {errors?.tax_kh && (
                          <p className="text-red-500 absolute right-0 top-0">
                            *
                          </p>
                        )}
                      </div>
                      <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8] ">
                        <input
                          type="text"
                          placeholder="1"
                          className=" relative h-full w-full p-1  bg-transparent hover:outline-none "
                          id="address"
                          {...register("address_kh")}
                        />
                        <label
                          htmlFor="address"
                          className="group-hover:text-red-600  absolute top-[40%] left-0 z-[5] group-hover:top-[-10px] group-hover:left-0 transition-all"
                        >
                          Địa chỉ công ty
                        </label>
                        {errors?.address_kh && (
                          <p className="text-red-500 absolute right-0 top-0">
                            *
                          </p>
                        )}
                      </div>
                    </form>
                  </div>
                </CollapseCustom>
                {/* <div className="flex gap-[10px] items-start ">
                  <img src="/asset/images/success.png" alt="" />
                  <p>
                    <strong className="font-[700]">Xuất hoá đơn</strong> (Quý
                    khách cần xuất hoá đơn mua hàng, vui lòng nhập thông tin tại
                    đây)
                  </p>
                </div> */}
              </div>
            </div>

            <div className="group mt-[24px] border-solid border-[1px] border-[#D8D7D8] py-[8px] px-[16px] ">
              <p className="font-[700]">Đơn hàng</p>
              {data &&
                data.line_items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] h-auto min-h-[103px] gap-[8px]"
                  >
                    <div className="w-[87px] h-[87px] ">
                      <img src={item.image} alt="" />
                    </div>
                    <div className="p-[4px] text-[12px] ">
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
            <div className="">
              <h4>Mã giảm giá</h4>
              <div className="flex gap-[8px] mt-[8px] h-[31px]">
                <input
                  type="text"
                  className="gradient rounded-[4px] border-solid border-[1px] border-[#898889] h-full flex-1 p-[2px] text-pink-500    "
                  onChange={(e) => {
                    setCp(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="w-[65px] h-full bg-[#898889] text-white border-none hover:bg-blue-500"
                  disabled={loadingCP}
                  onClick={() => {
                    onApplyCoupon();
                  }}
                >
                  {loadingCP ? <LoadingOutlined /> : "Áp dụng"}
                </button>
              </div>
            </div>
            <div className="border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8]">
              <div className="mb-[16px]">
                <p className="inline">Tạm tính</p>
                <p className="inline-block float-right ">
                  {data &&
                    data.subtotal_price_original.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                </p>
              </div>
              <div className="mb-[16px]">
                <p className="inline">Phí vận chuyển</p>
                <p className="inline float-right">Free</p>
              </div>
            </div>
            <div className="">
              <p className="inline">Tổng cộng</p>
              <p className="inline float-right text-[#D72229] font-[700]">
                {data &&
                  data.total_price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
              </p>
              <button
                style={{
                  background: loadingCP ? "#f7676f" : "red",
                  color: "white",
                }}
                type="submit"
                className={` block w-full border-none text-white rounded-[4px] h-[34px] bg-[#D72229] my-[40px] ${
                  loadingCP === true ? "bg-green-400" : ""
                }`}
                disabled={loading || loadingCP ? true : false}
              >
                {loading ? <Progess></Progess> : "Thanh toán"}
              </button>
              <div className="text-[14px] font-[400]">
                <p className="mb-[16px]">
                  Prices do not include import duties, which must be paid upon
                  delivery
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
