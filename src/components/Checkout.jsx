import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCheckouts from "../hooks/useCheckouts";
import ToolipCustom from "./child/ToolipCustom";
import { DoubleLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import CollapseCustom from "./child/CollapseCustom";
import { AiFillTag } from "react-icons/ai";
import { CiCircleRemove } from "react-icons/ci";
import { UseGlobalContext } from "../contexts/GlobalContext";
import Progess from "./child/Progess";
import { message } from "antd";
import "./component.css";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import axios from "axios";

const schema = yup.object({
  firstname: yup.string().required("Tên không được bỏ trống"),
  lastname: yup.string().required("Họ không được bỏ trống"),
  phone: yup
    .string()
    .matches(
      /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
      "Vui lòng nhập số điện thoại"
    )
    .required("Vui lòng nhập số điện thoại"),
  address: yup.string("Vui lòng nhập địa chỉ").required("Vui lòng địa chỉ"),
  district: yup.string().required("Vui lòng chọn địa chỉ quận/huyện"),
  ward: yup.string().required("Vui lòng chọn địa chỉ phường/xã"),
  province: yup.string().required("Vui lòng chọn địa chỉ tỉnh/thành phố"),
  // another: yup.string().required("choose another "),
  // sale: yup.number(),
  pay: yup.number().required("Please choose status"),
  // address_kh: yup.string().required("Vui lòng chọn loại địa chỉ"),
  // company_kh: yup.string().required("Vui lòng chọn loại địa chỉ công ty"),
  // email_kh: yup.string().required("Vui lòng nhập email công ty"),
  // tax_kh: yup.number().required("Vui lòng nhập mã thuế"),
  // name_kh: yup.string().required("Vui lòng nhập tên "),
});
const Checkout = ({ screen, handleChageScreen }) => {
  const {
    fetchDataCheckouts,
    fetchLocationP,
    postLocation,
    postPayment,
    postUpdateCart,
    completeCheckout,
  } = useCheckouts();
  const { inforCheckout, setInforCheckout, token, dataWindow, setOrder } =
    UseGlobalContext();

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

  // State
  const [data, setData] = React.useState(null);
  const [province, setProvince] = React.useState([]);
  const [district, setDistrict] = React.useState([]);
  const [ward, setWard] = React.useState([]);
  const [cp, setCp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingCP, setLoadingCP] = React.useState(false);
  const [loadingAD, setLoaingAD] = React.useState(false);
  const [isCreate, setIsCreate] = React.useState(false);
  const check = React.useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  // useForm
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      province: "",
      district: "",
      ward: "",
      firstname: "",
      lastname: "",
      address: "",
      phone: "",
      email_kh: "",
      address_kh: "",
      company_kh: "",
      tax_kh: "",
      name_kh: "",
    },
    mode: "all",
  });

  check.current = {
    province: watch("province"),
    district: watch("district"),
    ward: watch("ward"),
    firstname: watch("firstname"),
    lasttname: watch("lastname"),
    phone: watch("phone"),
    address: watch("address"),
  };

  // useQuery

  // Function
  const onSubmit = async (data) => {
    setLoading(true);
    const noteJSON = {
      email_kh: data.email_kh,
      address_kh: data.address_kh,
      company_kh: data.company_kh,
      tax_kh: data.tax_kh,
      name_kh: data.name_kh,
    };
    const resPayment = postPayment({
      payID: data.pay,
    });
    const resLocation = postLocation({
      first_name: data.firstname,
      last_name: data.lastname,
      phone: data.phone,
      address: data.address,
      province_code: data.province,
      district_code: data.district,
      ward_code: data.ward,
    });
    var resNote = postUpdateCart({
      note: JSON.stringify(noteJSON),
    });
    const body = new URLSearchParams();
    body.append("form_type", "checkout");
    body.append("utf8", "true");
    body.append("__RequestVerificationToken", token);
    const res_complete = completeCheckout({ body });
    Promise.all([resPayment, resLocation, resNote, res_complete])
      .then((data) => {
        if (
          data[0].error === false &&
          data[1].error === false &&
          data[3].status === 200
        ) {
          setTimeout(() => {
            setLoading(false);
            handleChageScreen("thankyou");
          }, 2500);
        } else {
          setLoading(false);
          window.alert("some thing went wrong ! Please check your information");
          return;
        }
      })
      .catch((err) => {
        setLoading(false);
        window.alert("some thing went wrong ! Please check your information");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleOnchangeValue = (e) => {
    setInforCheckout({
      ...inforCheckout,
      [e.target.name]: e.target.value,
    });
  };
  const handleReset = (opt) => {
    reset({
      ...opt,
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
      }
    } catch (error) {
      setLoadingCP(false);
      openMessage({
        type: "warning",
        content: "Mã khuyến mãi không hợp lệ !",
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
  const handleChangeAddress = async (e, opt = null) => {
    const option = {
      province: "PROVINCE",
      district: "DISTRICT",
    };
    const value = e.target.value;
    setLoaingAD(true);
    switch (opt) {
      case option.province:
        if (value !== "") {
          const res = await dataWindow.getProvince(241, value);
          if (res) {
            setDistrict(res.districts);
            setWard([]);
            setLoaingAD(false);
          } else {
            openMessage({
              type: "error",
              content: "something went wrong! Please choose city again",
            });
            setValue("ward", "");
            setValue("district", "");
            setWard([]);
            setDistrict([]);
          }
        }
        break;
      case option.district:
        const res = await dataWindow.getProvince(241, check.current.province);
        setValue("ward", "");
        if (res && value !== "") {
          setWard(res[value].wards);
          setLoaingAD(false);
        } else {
          setWard([]);
          setLoaingAD(false);
        }
        break;
      default:
        break;
    }
  };
  const handleToggleCreate = () => {
    setIsCreate((prev) => !prev);
  };
  // useEffect
  React.useEffect(() => {
    const res_data = fetchDataCheckouts();
    if (res_data) {
      res_data.then((res) => {
        if (res.checkouts !== null) {
          setData(res.checkouts);
        } else {
          handleChageScreen("default");
          return;
        }
      });
    }
  }, [screen]);

  React.useEffect(() => {
    if (check.current.province === "" || check.current.province === undefined) {
      setWard([]);
      setDistrict([]);
      setValue("ward", "");
      setValue("district", "");
    }
  }, [check.current.province]);

  React.useEffect(() => {
    if (JSON.stringify(dataWindow) !== "{}") {
      setProvince(dataWindow[241].provinces);
    }
  }, [province.length]);

  return (
    <div className="w-full h-auto p-[16px] overflow-x-hidden ">
      {contextHolder}
      {loadingAD && <Progess className="bg-transparent"></Progess>}

      <div className="w-full h-auto max-w-[1220px] mx-auto  mt-[8px] relative">
        <ToolipCustom
          title="Go back"
          className="absolute  left-0 md:left-full md:-translate-x-full"
        >
          <DoubleLeftOutlined
            className="text-[20pt]   hover:scale-125 transition-all"
            onClick={() => {
              handleChageScreen("login");
            }}
          />
        </ToolipCustom>
        <h3 className="text-center md:text-left mb-[24px] md:mb-[40px] font-[700] xl:text-[20pt]">
          Thanh toán
        </h3>
        <div className="w-full ">
          <h1 className=" text-[20px]">Thông tin giao hàng</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full  flex  gap-[16px]"
          >
            <div className="w-full flex flex-col gap-[16px]">
              <div className="">
                <div className="mt-[16px] relative">
                  <label
                    className="text-[12px] text-[#898889] block"
                    htmlFor=""
                  >
                    Tên
                  </label>
                  <input
                    type="text"
                    className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
                    name="firstname"
                    id="firstname"
                    placeholder="first name"
                    defaultValue={inforCheckout.firstname}
                    {...register("firstname", {
                      onChange: (e) => {
                        handleOnchangeValue(e);
                      },
                    })}
                  />
                  {errors?.firstname && (
                    <p className="text-red-500 absolute right-0 top-[50%]">*</p>
                  )}
                </div>
                <div className="mt-[16px] relative">
                  <label
                    className="text-[12px] text-[#898889] block"
                    htmlFor=""
                  >
                    Họ
                  </label>
                  <input
                    type="text"
                    placeholder="last name"
                    className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
                    name="lastname"
                    id="lastname"
                    defaultValue={inforCheckout.lastname}
                    {...register("lastname", {
                      onChange: (e) => {
                        handleOnchangeValue(e);
                      },
                    })}
                  />
                  {errors?.lastname && (
                    <p className="text-red-500 absolute right-0 top-[50%]">*</p>
                  )}
                </div>
                <div className="mt-[16px] relative">
                  <label
                    className="text-[12px] text-[#898889] block"
                    htmlFor=""
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
                    name="phone"
                    id="phone"
                    pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                    placeholder="phone"
                    defaultValue={inforCheckout.phone}
                    {...register("phone", {
                      onChange: (e) => {
                        handleOnchangeValue(e);
                      },
                    })}
                  />
                  {errors?.phone && (
                    <p className="text-red-500 absolute right-0 top-[50%]">*</p>
                  )}
                </div>
                <div className="mt-[16px] relative">
                  <label
                    className="text-[12px] text-[#898889] block"
                    htmlFor=""
                  >
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    placeholder="nam"
                    className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
                    name="address"
                    id="address"
                    defaultValue={inforCheckout.address}
                    {...register("address", {
                      onChange: (e) => {
                        handleOnchangeValue(e);
                      },
                    })}
                  />
                  {errors?.address && (
                    <p className="text-red-500 absolute right-0 top-[50%]">*</p>
                  )}
                </div>
                <div className="mt-[16px] flex justify-between gap-[8px]">
                  <div className="w-full relative">
                    <label
                      className="text-[12px] text-[#898889] block"
                      htmlFor=""
                    >
                      Tỉnh/Thành phố
                    </label>
                    <select
                      className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
                      name="province"
                      // defaultValue={
                      //   inforCheckout.province !== ""
                      //     ? inforCheckout.province
                      //     : ""
                      // }
                      {...register("province", {
                        onChange: (e) => {
                          handleChangeAddress(e, "PROVINCE");
                          handleReset({ district: "", ward: "" });
                        },
                      })}
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {province.length > 0 &&
                        province.map((item) => (
                          <option
                            key={item.i}
                            value={item.c}
                            // selected={
                            //   item.province_code === inforCheckout.province
                            //     ? true
                            //     : false
                            // }
                          >
                            {item.n}
                          </option>
                        ))}
                    </select>
                    {errors?.province && (
                      <p className="text-red-500 absolute right-0 top-0">*</p>
                    )}
                  </div>
                </div>
                <div className="mt-[16px] flex justify-between gap-[8px]">
                  <div className="w-[50%] relative">
                    <label
                      className="text-[12px] text-[#898889] block"
                      htmlFor=""
                    >
                      Quận/Huyện
                    </label>
                    <select
                      className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
                      name="district"
                      // defaultValue={
                      //   inforCheckout.district !== ""
                      //     ? inforCheckout.district
                      //     : ""
                      // }
                      {...register("district", {
                        onChange: (e) => {
                          handleChangeAddress(e, "DISTRICT");
                        },
                      })}
                    >
                      <option value="">Chọn quận huyện</option>
                      {district.length > 0 &&
                        district.map((item) => (
                          <option key={item.i} value={item.c}>
                            {item.n}
                          </option>
                        ))}
                    </select>
                    {errors?.district && (
                      <p className="text-red-500 absolute right-0 top-0">*</p>
                    )}
                  </div>
                  <div className="w-[50%] relative">
                    <label
                      className="text-[12px] text-[#898889] block"
                      htmlFor=""
                    >
                      Phường/Xã
                    </label>
                    <select
                      className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
                      name="ward"
                      // defaultValue={
                      //   inforCheckout.ward !== "" ? inforCheckout.ward : ""
                      // }
                      {...register("ward", {
                        onChange: (e) => {
                          // handleOnchangeValue(e);
                        },
                      })}
                    >
                      <option value="">Chọn phường xã</option>
                      {ward.length > 0 &&
                        ward.map((item) => (
                          <option key={item.i} value={item.c}>
                            {item.n}
                          </option>
                        ))}
                    </select>
                    {errors?.ward && (
                      <p className="text-red-500 absolute right-0 top-0">*</p>
                    )}
                  </div>
                </div>
                <div className="overflow-hidden relative w-full mt-[28px]">
                  <div className="flex gap-[2rem]">
                    <div className=" relative  flex justify-center items-center gap-[1rem]">
                      <input
                        type="radio"
                        style={{ margin: 0 }}
                        className=" text-red bg-red checked:bg-red mr-[11px]"
                        name="another"
                        value="home"
                        {...register("another")}
                      />
                      <label style={{ margin: 0 }} htmlFor="">
                        nhà
                      </label>
                    </div>
                    <div className=" relative flex justify-center items-center gap-[1rem]">
                      <input
                        type="radio"
                        style={{ margin: 0 }}
                        className=" text-red bg-red checked:bg-red  mr-[11px]"
                        name="another"
                        value="company"
                        {...register("another")}
                      />
                      <label style={{ margin: 0 }} htmlFor="">
                        Công ty
                      </label>
                    </div>
                    <div className=" relative flex justify-center items-center gap-[1rem]">
                      <input
                        type="radio"
                        style={{ margin: 0 }}
                        className="text-red form-radio  mr-[11px]"
                        name="another"
                        value="another"
                        {...register("another")}
                      />
                      <label htmlFor="" style={{ margin: 0 }}>
                        khác
                      </label>
                    </div>
                  </div>
                  {errors?.another && (
                    <p className="text-red-500 absolute right-0 top-0">*</p>
                  )}
                </div>
                {/* <div className="mt-[16px] flex justify-between gap-[8px]">
                  <div className="w-[50%]">
                    <button
                      type="submit"
                      className="bg-[#d72229] mt-[24px] h-[34px] rounded-[4px] w-[100%] flex justify-center text-white leading-[34px]"
                    >
                      Lưu địa chỉ
                    </button>
                  </div>
                  <div className="w-[50%]">
                    <button className="bg-white border-solid border-[1px]  mt-[24px] h-[34px] rounded-[4px] w-[100%] flex justify-center leading-[34px]">
                      Hủy
                    </button>
                  </div>
                </div> */}
              </div>
              <div className="mt-[16px]">
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
                <p className="mb-[24px]">* Chưa có tài khoản</p>
                <div
                  className="flex gap-[16px] items-center"
                  onClick={() => {
                    handleToggleCreate();
                  }}
                >
                  {isCreate ? (
                    <RiCheckboxCircleFill
                      className="cursor-pointer text-red-500"
                      style={{ width: "16px", height: "16px" }}
                    ></RiCheckboxCircleFill>
                  ) : (
                    <RiCheckboxBlankCircleLine
                      className="cursor-pointer "
                      style={{ width: "16px", height: "16px" }}
                    ></RiCheckboxBlankCircleLine>
                  )}
                  <p className="text-[#3A393A] cursor-pointer">
                    Lưu thông tin và tạo tài khoản
                  </p>
                </div>
              </div>
              <div className="mt-[24px]">
                <h3 className="mb-[16px] font-[500] text-[20px] text-[#3A393A] leading-[24px]">
                  Phương thức vận chuyển
                </h3>
                <div className="h-[72px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[22px] py-[18px] max-w-[301px]">
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
                    defaultChecked
                    // checked={data && data.payment_method_id === 1 ? true : null}
                    {...register("pay", {
                      onChange: (e) => {
                        handleOnchangeValue(e);
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
                <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[16px] py-[18px] mb-[8px] cursor-pointer select-none ">
                  <input
                    type="radio"
                    style={{ margin: 0 }}
                    name="pay"
                    id="pays"
                    className="cursor-pointer "
                    value={2}
                    // checked={data && data.payment_method_id === 2 ? true : null}
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
                <label className="h-[49px] w-full border-solid border-[1px] border-[#D8D7D8] bg-[#F7F7F7] flex items-center gap-[8px] px-[16px] py-[18px] mb-[8px] cursor-pointer select-none  relative ">
                  <input
                    type="radio"
                    style={{ margin: 0 }}
                    name="pay"
                    id="pays"
                    className="cursor-pointer "
                    value={3}
                    disabled
                    // checked={data && data.payment_method_id === 3 ? true : null}
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
                  <div className="absolute right-[16px] w-auto h-full flex  justify-end items-center gap-[8px] invisible md:visible  ">
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
                      <form action="">
                        <div className="group relative h-[40px] mt-[16px] border border-x-0 border-t-0 border-[#D8D7D8]  ">
                          <input
                            type="email"
                            style={{ border: "none" }}
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
              <div className=" block md:hidden">
                <div className="group mt-[24px] border-solid border-[1px] border-[#D8D7D8] py-[8px] px-[16px] ">
                  <p className="font-[700]">Đơn hàng</p>
                  {data &&
                    data.line_items.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] h-auto min-h-[103px] gap-[8px]  first:pt-[8px] last:border-none pt-[16px]"
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
                <div className="mt-[16px]">
                  <h4>Mã giảm giá</h4>
                  <div className="flex gap-[8px] mt-[8px] h-[31px]">
                    <input
                      type="text"
                      className="gradient rounded-[4px] border-solid border-[1px] border-[#898889] h-full w-full flex-1 py-[2px] px-[16px] font-[700] pl-[16px] text-pink-500    "
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
                <div className="border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] flex flex-col gap-[16px] mt-[16px] pb-[16px]">
                  <div className="">
                    <p className="inline">Tạm tính</p>
                    <p className="inline-block float-right ">
                      {data &&
                        data.subtotal_price_original.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                  <div className="">
                    <p className="inline">Phí vận chuyển</p>
                    <p className="inline float-right">
                      {/* {data &&
                      data.shipping_price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) === 0
                        ? "Free"
                        : data.shipping_price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })} */}
                      0
                    </p>
                  </div>
                  <div className="">
                    <p className="inline">Giảm giá</p>
                    <p className="inline float-right text-[#004B8F]">
                      {data &&
                        data.discount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                </div>
                <div className="pt-[16px]">
                  <p className="inline">Tổng cộng</p>
                  <p className="inline float-right text-[#D72229] font-[700]">
                    {data &&
                      data.total_price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </p>
                  <button
                    style={{ background: "#D72229", color: "#ffffff" }}
                    type="submit"
                    disabled={loading || loadingCP ? true : false}
                    className=" block w-full border-none text-white rounded-[4px] h-[34px] bg-[#D72229] my-[40px]"
                  >
                    {loading ? (
                      <div className="w-10 h-10 rounded-full border-[3px] border-blue-600  border-t-transparent animate-spin  "></div>
                    ) : (
                      " Thanh toán"
                    )}
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
            <section className="tk_order min-w-[293px] h-auto flex-1  ">
              <div className=" ">
                <div className="group  border-solid border-[1px] border-[#D8D7D8] py-[8px] px-[16px] ">
                  <p className="font-[700]">Đơn hàng</p>
                  {data &&
                    data.line_items.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] h-auto min-h-[103px] gap-[8px] last:border-none"
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
                <div className="border-solid border-[1px] border-x-0 border-t-0 border-[#D8D7D8] flex flex-col gap-[16px] mt-[16px] pb-[16px]">
                  <div className="">
                    <p className="inline">Tạm tính</p>
                    <p className="inline-block float-right ">
                      {data &&
                        data.subtotal_price_original.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                  <div className="">
                    <p className="inline">Phí vận chuyển</p>
                    <p className="inline float-right">
                      {/* {data &&
                      data.shipping_price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) === 0
                        ? "Free"
                        : data.shipping_price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })} */}
                      0
                    </p>
                  </div>
                  <div className="">
                    <p className="inline">Giảm giá</p>
                    <p className="inline float-right text-[#004B8F]">
                      {data &&
                        data.discount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                </div>
                <div className="pt-[16px]">
                  <p className="inline">Tổng cộng</p>
                  <p className="inline float-right text-[#D72229] font-[700]">
                    {data &&
                      data.total_price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </p>
                  <button
                    style={{ background: "#D72229", color: "#ffffff" }}
                    type="submit"
                    disabled={loading ? true : false}
                    className=" block w-full border-none text-white rounded-[4px] h-[34px] bg-[#D72229] my-[40px]"
                  >
                    {loading ? (
                      <div className="w-10 h-10 rounded-full border-[3px] border-blue-600  border-t-transparent animate-spin  "></div>
                    ) : (
                      " Thanh toán"
                    )}
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
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
