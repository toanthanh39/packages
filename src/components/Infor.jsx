import React, { useCallback } from "react";
import useCheckouts from "../hooks/useCheckouts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Pagination, message } from "antd";
import {
  CloseCircleOutlined,
  DoubleLeftOutlined,
  LoadingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import ToolipCustom from "./child/ToolipCustom";
import { AiFillTag } from "react-icons/ai";
import { CiCircleRemove } from "react-icons/ci";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { UseGlobalContext } from "../contexts/GlobalContext";
import { Skeleton } from "antd";
import UpdateAddress from "./UpdateAddress";
import { useToggle } from "../hooks/useToggle";
import CollapseCustom from "./child/CollapseCustom";
import Progess from "./child/Progess";
import Address from "./Address";
import "./component.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
const schema = yup.object({
  pay: yup.number().required("Please choose status"),
});

const Infor = ({ handleChageScreen }) => {
  // state
  const [cp, setCp] = React.useState("");
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingCP, setLoadingCP] = React.useState(false);
  // const [loadingSubmit, setLoadingSubmit] = React.useState(false);

  const [listAddress, setListAddress] = React.useState([]);
  const [change, setChange] = React.useState(1);
  const [inforAddress, setInforAddress] = React.useState({});
  const [isActive, setIsActive] = React.useState(null);
  const itemActive = React.useRef(null);
  const [addressFinal, setAddressFinal] = React.useState("");
  const [isCurrent, setIsCurrent] = React.useState(false);
  // useHook
  const {
    fetchDataCheckouts,
    getListAddress,
    deleteAddress,
    postPayment,
    completeCheckout,
    postUpdateCart,
    postLocation,
  } = useCheckouts();
  const { token, setDataUpdate, loginData, order, setOrder } =
    UseGlobalContext();
  const [messageApi, contextHolder] = message.useMessage();
  const { isOpen, setHide, setShow, toggleShow } = useToggle(false);
  const {
    isOpen: openUpdateAddress,
    setHide: setHideUpdateAddress,
    setShow: setShowUpdateAddress,
    toggleShow: toggleUpdateAddress,
  } = useToggle(false);

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
    formState: { errors, isValid },

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
    mode: "all",
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
    const resLocation = postLocation({
      full_name: addressFinal.full_name,
      province_code: addressFinal.province_name,
      district_code: addressFinal.district_name,
      phone: addressFinal.phone,
      address: addressFinal.address,
      ward_code: addressFinal.ward_name,
      email: addressFinal.company.email,
    });

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

    Promise.all([resPayment, res_complete, resLocation])
      .then((data) => {
        console.log(data[1]);
        if (
          data[0].error === false &&
          data[1].status === 200 &&
          data[2].error === false
        ) {
          setTimeout(() => {
            setLoading(false);
            handleChageScreen("thankyou");
          }, 2500);
        } else {
          if (data[2].error !== false) {
            openMessage({
              type: "error",
              content: "địa chỉ không hợp lệ, bạn hãy chọn lại địa chỉ khác!",
            });
          } else {
            window.alert(
              "something went wrong ! Please check your information"
            );
          }
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
        setOrder(response.data.checkouts);
        setLoadingCP(false);
        openMessage({
          type: "success",
          content: "Áp dụng mã thành công  !",
        });
        setChange(2);
      }
    } catch (error) {
      setLoadingCP(false);
      openMessage({
        type: "warning",
        content: "không tìm thấy mã khuyến mãi !",
      });
    }
  };
  const removeCoupon = async () => {
    try {
      setLoadingCP(true);
      const response = await axios.post(process.env.REACT_APP_API_DISCOUNT, {
        discount_code: "",
      });
      if (response) {
        setLoadingCP(false);
        setData(response.data.checkouts);
        setOrder(response.data.checkouts);
        openMessage({
          type: "success",
          content: "Xóa mã thành công!",
        });
        setChange(2);
      }
    } catch (error) {
      console.log(error);
      setLoadingCP(false);
      openMessage({
        type: "warning",
        content: "Không thành công !",
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
  const handleSetAddressUpdate = ({ item: data, current = null }) => {
    if (current) {
      current === 1 ? setIsCurrent(true) : setIsCurrent(false);
    }
    toggleShow();
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
      ward_name: data.ward_name,
      ward_id: data.ward_id,
    });
  };
  const handleActiveAddress = async (dataActive) => {
    setAddressFinal(dataActive);

    // try {
    //   setLoading(true);
    //   const response = await axios.post(
    //     process.env.REACT_APP_API_SIGNIN,
    //     {
    //       country_code: "VN",
    //       full_name: dataActive.full_name,
    //       province_code: dataActive.province_name,
    //       district_code: dataActive.district_name,
    //       phone: dataActive.phone,
    //       address: dataActive.address,
    //       ward_code: dataActive.ward_name,
    //       email: dataActive.company.email,
    //     },
    //     {
    //       headers: {
    //         " Content-Type": " application/json",
    //       },
    //     }
    //   );

    //   if (response) {
    //     setLoading(false);
    //     openMessage({
    //       type: "success",
    //       content: "Áp dụng thông tin thành công!",
    //     });
    //     setChange(2);
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   openMessage({
    //     type: "error",
    //     content: "thông tin k hợp lệ, bạn hãy chọn lại thông tin khác!",
    //   });

    //   return error;
    // }
  };
  const handleSetAddressFinal = useCallback((props) => {
    setAddressFinal({ ...addressFinal, ...props });
  });
  const handleScroll = () => {
    const form = document.querySelector("#add_address");
  };

  // useEffect
  React.useEffect(() => {
    const form = document.querySelector("#add_address");
    if (form) {
      form.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [openUpdateAddress]);
  React.useEffect(() => {
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
  }, [change]);
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  React.useEffect(() => {
    if (loginData.email !== null) {
      const res_list_address = getListAddress();
      if (res_list_address) {
        res_list_address.then((res) => {
          setListAddress([...res]);
        });
      }
    }
  }, [change]);

  React.useEffect(() => {
    if (addressFinal === "" && listAddress.length > 0) {
      const addDefault = listAddress.find((item) => item.is_default === true);

      setAddressFinal(addDefault);
    }
  }, [change, listAddress.length]);
  React.useEffect(() => {
    if (addressFinal && listAddress.length > 0) {
      const { address, district_id, ward_id, full_name } = addressFinal;
      console.log(listAddress);
      listAddress
        .filter((item) => !Object.keys(item.company).length == "0")
        .forEach((item) => {
          if (
            item.district_id == district_id &&
            item.ward_id == ward_id &&
            item.full_name === full_name &&
            item.address.replace(/^\s+|\s+$/gm, "") ===
              address.replace(/^\s+|\s+$/gm, "")
          ) {
            setIsActive(item.id);
          } else {
          }
        });
    }
  }, [change, listAddress.length, addressFinal]);

  React.useEffect(() => {
    const item_active = document.querySelector(".address_active");
    if (item_active) {
      item_active.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [isActive, change]);

  return (
    <div className="w-full h-auto p-[16px] overflow-x-hidden flex-1 ">
      {loading && <Progess className="bg-transparent"></Progess>}
      {contextHolder}

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
      <div className="w-full h-auto max-w-[1220px] mx-auto  mt-[8px] ">
        <h3 className="text-center md:text-left mb-[24px] md:mb-[40px] font-[700] xl:text-[20pt]">
          Thanh toán
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-[16px] w-full "
        >
          <div className="w-full flex flex-col gap-[16px]  overflow-x-hidden">
            <h1 className=" text-[20px]">Thông tin giao hàng</h1>
            <div className="">
              {/* <div className="inline-block bg-[#004B8F] text-white rounded-[4px] text-center mb-[8px] pl-[10px] py-[2px] px-[10px] ">
                  <p className="text-[10px]">Văn phòng</p>
                </div> */}
              {/* // <Skeleton active paragraph={{ row: 1 }}></Skeleton>
                <Skeleton.Input active size="small" block={true} /> */}
              <Skeleton active paragraph={{ rows: 2 }} loading={loading}>
                {addressFinal ? (
                  <>
                    {addressFinal.type && addressFinal.type !== "" ? (
                      <div className="mb-[8px] bg-[#004B8F] rounded-[4px] text-white inline-block py-[2px] px-[10px] ">
                        <div className="">
                          <p>{addressFinal.type}</p>
                        </div>
                      </div>
                    ) : addressFinal.company?.type !== "" ? (
                      <div className="mb-[8px] bg-[#004B8F] rounded-[4px] text-white inline-block py-[2px] px-[10px] ">
                        <div className="">
                          <p>{addressFinal.company?.type}</p>
                        </div>
                      </div>
                    ) : (
                      addressFinal.is_default === true && (
                        <div className="mb-[8px] bg-[#004B8F] rounded-[4px] text-white inline-block py-[2px] px-[10px] ">
                          <div className="">
                            <p>Địa chỉ mặc định</p>
                          </div>
                        </div>
                      )
                    )}
                    <div className="flex font-[700]  items-center justify-start gap-1 mb-[8px]">
                      <p>
                        {addressFinal && addressFinal.full_name !== null
                          ? addressFinal.full_name
                          : ""}
                      </p>
                      <span>-</span>
                      <p className="font-[500]">
                        {addressFinal && addressFinal.phone !== null
                          ? addressFinal.phone
                          : ""}
                      </p>
                    </div>
                    <p>{addressFinal && addressFinal.address}</p>
                  </>
                ) : (
                  <div className="w-auto  flex-shrink-0 h-auto relative flex items-center gap-2">
                    <WarningOutlined className="text-yellow-500  " />
                    <h4 className="text-red-600">
                      Bạn chưa có địa chỉ giao hàng ! Vui lòng thêm địa chỉ
                    </h4>
                  </div>
                )}
              </Skeleton>
            </div>
            {/* id="slide" id="slide_address" */}
            <div className="w-full h-full relative   ">
              <div className=" relative">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 3 }}></Skeleton>
                ) : listAddress.length > 0 ? (
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    breakpoints={{
                      414: {
                        slidesPerView: 1,
                        spaceBetween: 8,
                      },
                      768: {
                        slidesPerView: 2,
                        spaceBetween: 8,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                      },
                      1440: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                      },
                    }}
                  >
                    {listAddress
                      .filter(
                        (item) => !Object.keys(item.company).length == "0"
                      )
                      .map((item) => (
                        <SwiperSlide key={item.id}>
                          <div
                            ref={isActive && itemActive}
                            className={`group min-w-[293px]  w-full  text-[14px]  h-auto min-h-[137px] bg-white  relative p-[18px] border-solid border-[1px] border-[#D8D7D8] flex gap-[10px] cursor-pointer ${
                              item.id === isActive
                                ? " border-[2px] border-[#DC0719] address_active shadow-md"
                                : ""
                            }`}
                          >
                            <div className="absolute right-[16px] top-[8px] p-[10px] cursor-pointer transition-all z-20   ">
                              <img
                                src="https://theme.hstatic.net/1000340570/1000964732/14/edit.svg"
                                onClick={() => {
                                  handleSetAddressUpdate({
                                    item,
                                    current: item.id === isActive ? 1 : 0,
                                  });
                                }}
                                alt=""
                              />
                              {/* <BsPencilSquare
                                  className=""
                                  onClick={() => {
                                    handleSetAddressUpdate(item);
                                  }}
                                ></BsPencilSquare> */}
                            </div>
                            <div className="isActive_wrapper cursor-pointer">
                              {/* <input type="radio" name="isActive" id="isActive" /> */}
                              {item.id === isActive ? (
                                <RiCheckboxCircleFill
                                  style={{ width: "16px", height: "16px" }}
                                ></RiCheckboxCircleFill>
                              ) : (
                                <RiCheckboxBlankCircleLine
                                  onClick={() => {
                                    handleActiveAddress(item);
                                  }}
                                  style={{ width: "16px", height: "16px" }}
                                ></RiCheckboxBlankCircleLine>
                              )}
                            </div>
                            <div>
                              <p>{item.full_name}</p>
                              <p>{item.phone}</p>
                              <p>
                                {item.district_name}
                                {"-"}
                                {item.province_name}-
                              </p>
                              <p>{item.address}</p>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                  </Swiper>
                ) : (
                  <div className="w-auto  flex-shrink-0 h-auto relative flex items-center gap-2">
                    <WarningOutlined className="text-yellow-500  " />
                    <h4 className="text-red-600">Bạn chưa có địa chỉ khác !</h4>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toggleUpdateAddress();
                handleScroll();
              }}
              className="w-fit  bg-transparent border border-x-0 border-t-0 border-slate-700 leading-[20px] text-[#3A393A] font-[400] mb-[8px]"
            >
              Thêm địa chỉ
            </button>
            {isOpen && (
              <div className="relative mb-[16px]">
                <UpdateAddress
                  onClose={setHide}
                  isChange={setChange}
                  isCurrent={isCurrent}
                  setFinalAddress={handleSetAddressFinal}
                ></UpdateAddress>
              </div>
            )}
            {openUpdateAddress && (
              <Address
                setHide={setHideUpdateAddress}
                setChange={setChange}
              ></Address>
            )}
            <div className="flex flex-col gap-[16px]">
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
                <div className="h-[72px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[16px] py-[18px] max-w-[301px]">
                  <div>
                    {/* <FcShipped className="text-[16pt]"></FcShipped> */}
                    <img
                      src="https://theme.hstatic.net/1000340570/1000964732/14/co_box.svg"
                      alt=""
                    />
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
                <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[16px] py-[18px] mb-[8px]  cursor-pointer select-none  ">
                  <input
                    type="radio"
                    style={{ margin: 0 }}
                    name="pay"
                    id="pays"
                    className="cursor-pointer "
                    value={1}
                    // checked={inforCheckout.pay === 1 ? true : null}
                    // checked={data && data.payment_method_id === 1 ? true : null}
                    defaultChecked
                    {...register("pay", {
                      onChange: (e) => {
                        // handleOnchangeValue(e);
                      },
                    })}
                  />
                  <div className="">
                    <p className="text-[12px] leading-[15px] text-[#3A393A]">
                      <strong className="font-[700] leading-[17px]">
                        COD{" "}
                      </strong>
                      (Thanh toán khi nhận hàng)
                    </p>
                  </div>
                </label>
                <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[16px] py-[18px] mb-[8px] cursor-pointer select-none relative ">
                  <input
                    type="radio"
                    style={{ margin: 0 }}
                    name="pay"
                    id="pays"
                    className="cursor-pointer "
                    value={2}
                    {...register("pay")}
                  />
                  <div className="">
                    <p className="text-[12px] leading-[15px] text-[#3A393A]">
                      <strong className="font-[700] leading-[17px]">
                        CHUYỂN KHOẢN{" "}
                      </strong>
                      (Thanh toán bằng chuyển khoản)
                    </p>
                  </div>
                </label>
                <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[16px] py-[18px] mb-[8px] cursor-pointer select-none  ">
                  <input
                    type="radio"
                    style={{ margin: 0 }}
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
                        NGÂN HÀNG{" "}
                      </strong>
                      (Thanh toán qua ngân hàng)
                    </p>
                  </div>
                  <div className="absolute right-[16px] w-auto h-full  flex justify-end items-center gap-[8px] invisible md:visible  ">
                    <img
                      src="https://theme.hstatic.net/1000340570/1000964732/14/co_paya.svg"
                      alt=""
                    />
                    <img
                      src="https://theme.hstatic.net/1000340570/1000964732/14/co_payj.svg"
                      alt=""
                    />
                    <img
                      src="https://theme.hstatic.net/1000340570/1000964732/14/co_payo.svg"
                      alt=""
                    />
                    <img
                      src="https://theme.hstatic.net/1000340570/1000964732/14/co_payp.svg"
                      alt=""
                    />
                    <img
                      src="https://theme.hstatic.net/1000340570/1000964732/14/co_payv.svg"
                      alt=""
                    />
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
                      <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8]  ">
                        <input
                          style={{
                            borderBottom: "1px solid #D8D7D8",
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                            padding: "4px 0",
                          }}
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
              <div className="if_order  flex-col gap-[16px]">
                <div className="group inline-block mt-[24px] border-solid border-[1px] border-[#D8D7D8] py-[8px] px-[16px] w-full      ">
                  <p className="font-[700]">Đơn hàng</p>
                  {data &&
                    data.line_items.map((item) => (
                      <div
                        id="order_item"
                        key={item.product_id}
                        className="flex xl:w-max  border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] h-auto min-h-[103px] gap-[8px] last:border-none  pt-[16px]"
                      >
                        <div className="w-[87px] h-[87px] my-auto ">
                          <img
                            className="w-full h-full"
                            src={item.image}
                            alt=""
                          />
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
                <div className="mt-[16px]">
                  <h4>Mã giảm giá</h4>
                  <div className="flex gap-[8px] mt-[8px] h-[31px]">
                    <input
                      type="text"
                      className="gradient rounded-[4px] border-solid border-[1px] border-[#898889] h-full w-full flex-1 py-[2px] px-[16px] font-[700] text-pink-500   "
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
                {data?.discount_code !== null && (
                  <div className="w-full h-auto">
                    <p className="inline">Mã giảm giá</p>
                    <p className="inline-flex float-right font-[700] text-[14px] items-center  ">
                      <AiFillTag className="inline mx-[4px] text-red-500"></AiFillTag>
                      {data?.discount_code}
                      <CiCircleRemove
                        onClick={() => {
                          removeCoupon();
                        }}
                        className="inline cursor-pointer  ml-[4px] text-[18px] text-red-400"
                      ></CiCircleRemove>
                    </p>
                  </div>
                )}
                <div className="border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8]">
                  <div className="my-[16px]">
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
                  <div className="mb-[16px]">
                    <p className="inline">Giảm giá</p>
                    <p className="inline float-right text-[#004B8F]">
                      {order &&
                        order.discount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                </div>
                <div className="mt-[16px]">
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
                      Prices do not include import duties, which must be paid
                      upon delivery.
                    </p>
                    <p>
                      By completing the order process, I declare that I have
                      read and understand the General Terms & Conditions, the
                      Return Policy and the Privacy Policy as stated on
                      NAMPERFUME.NET.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="tk_order min-w-[293px] h-auto flex-1   ">
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
                        <img
                          className="w-full h-full"
                          src={item.image}
                          alt=""
                        />
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
              <div className="my-[16px]">
                <h4>Mã giảm giá</h4>
                <div className="flex gap-[8px] mt-[8px] h-[31px]">
                  <input
                    type="text"
                    className="gradient rounded-[4px] border-solid border-[1px] border-[#898889] h-full w-full flex-1 py-[2px] px-[16px] font-[700] text-pink-500    "
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
              {data?.discount_code !== null && (
                <div className="w-full h-auto">
                  <p className="inline">Mã giảm giá</p>
                  <p className="inline-flex float-right font-[700] text-[14px] items-center  ">
                    <AiFillTag className="inline mx-[4px] text-red-500"></AiFillTag>
                    {data?.discount_code}
                    <CiCircleRemove
                      onClick={() => {
                        removeCoupon();
                      }}
                      className="inline cursor-pointer  ml-[4px] text-[18px] text-red-400"
                    ></CiCircleRemove>
                  </p>
                </div>
              )}
              <div className="border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] mt-[16px]">
                <div className="mb-[16px]">
                  <p className="inline">Tạm tính</p>
                  <p className="inline-block float-right ">
                    {order &&
                      order.subtotal_price_original.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </p>
                </div>
                <div className="mb-[16px]">
                  <p className="inline">Phí vận chuyển</p>
                  <p className="inline float-right">
                    {order && order.shipping_price === 0
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
                    {order &&
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
                  {order &&
                    order.total_price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                </p>
                <button
                  type="submit"
                  style={{
                    background: "#D72229",
                    color: "white",
                  }}
                  className={` block w-full border-none text-white rounded-[4px] h-[34px] bg-[#D72229] my-[40px] cursor-pointer ${
                    loadingCP === true || isValid === false
                      ? "bg-[#D8D7D8]"
                      : "bg-[#D72229]"
                  }`}
                  disabled={loading || loadingCP || isValid ? true : false}
                >
                  {loading ? <Progess></Progess> : "Thanh toán"}
                </button>
                {/* <div className="text-[14px] font-[400]">
                <p className="mb-[16px]">
                  Prices do not include import duties, which must be paid upon
                  delivery.import { AiFillEye } from 'react-icons/ai';


                </p>
                <p>
                  By completing the order process, I declare that I have read
                  and understand the General Terms & Conditions, the Return
                  Policy and the Privacy Policy as stated on NAMPERFUME.NET.
                </p>
              </div> */}
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Infor;
