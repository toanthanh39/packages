import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCheckouts from "./../hooks/useCheckouts";
import { message } from "antd";
import { UseGlobalContext } from "../contexts/GlobalContext";
import Progess from "./child/Progess";
import "./component.css";
const schema = yup.object({
  firstName: yup.string().required("Tên không được bỏ trống"),
  lastName: yup.string("Vui lòng nhập họ").required("Họ không được bỏ trống"),
  phone: yup
    .string()
    .matches(
      /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
      "Vui lòng nhập số điện thoại"
    )
    .required("Vui lòng nhập số điện thoại"),
  address: yup.string().required("Vui lòng địa chỉ"),
  ward: yup.string().required("Vui lòng chọn địa chỉ phường/xã"),
  district: yup.string().required("Vui lòng chọn địa chỉ quận/huyện"),
  province: yup.string().required("Vui lòng chọn địa chỉ tỉnh/thành phố"),
  addressType: yup.number().required("Vui lòng chọn loại địa chỉ"),
  email: yup.string().required("Vui lòng nhập email công ty"),
});

const Address = ({ setHide, setChange }) => {
  const { postAddress } = useCheckouts();
  const { dataWindow } = UseGlobalContext();

  // State
  const [province, setProvince] = React.useState([]);
  const [district, setDistrict] = React.useState([]);
  const [ward, setWard] = React.useState([]);
  const check = React.useRef(null);
  const [loadingAD, setLoaingAD] = React.useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      province: "",
      district: "",
      ward: "",
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
    },
  });
  const onSubmit = async (data) => {
    const bodyFormData = new FormData();
    bodyFormData.append("form_type", "customer_address");
    bodyFormData.append("utf8", "true");
    bodyFormData.append("address[country]", "Vietnam");
    bodyFormData.append("address[last_name]", data.lastName);
    bodyFormData.append("address[first_name]", data.firstName);
    bodyFormData.append("address[phone]", data.phone);
    bodyFormData.append("address[province]", data.province);
    bodyFormData.append("address[district]", data.district);
    bodyFormData.append("address[address1]", data.address);
    bodyFormData.append("address[ward]", data.ward);
    if (data.addressType === 1) {
      bodyFormData.append("address[default]", 1);
      bodyFormData.append(
        "address[company]",
        "__" + data.email + "__type-__gender-__birthday-"
      );
      bodyFormData.append("address-type", 1);
    } else if (data.addressType === 3) {
      bodyFormData.append("address[default]", "");
      bodyFormData.append(
        "address[company]",
        "__" + data.email + "__type-Công Ty__gender-__birthday-"
      );
      bodyFormData.append("address-type", "Công Ty");
    } else if (data.addressType === 2) {
      bodyFormData.append("address[default]", "");
      bodyFormData.append(
        "address[company]",
        "__" + data.email + "__type-Nhà__gender-__birthday-"
      );
      bodyFormData.append("address-type", "Nhà");
    } else if (data.addressType === 4) {
      bodyFormData.append("address[default]", "");
      bodyFormData.append(
        "address[company]",
        "__" + data.email + "__type-Khác__gender-__birthday-"
      );
      bodyFormData.append("address-type", "Khác");
    }
    const res = postAddress(bodyFormData);
    if (res) {
      res
        .then((data) => {
          openMessage();
          setTimeout(() => {
            setChange(2);
            setHide();
          }, 2500);
        })
        .catch((error) => {
          window.alert("some thing went wrong ! Please check your information");
          return;
        });
    }
  };
  check.current = {
    province: watch("province"),
    district: watch("district"),
    ward: watch("ward"),
  };

  // Function
  const openMessage = () => {
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
      style: {
        position: "relative",
        top: "10vh",
        zIndex: 999999,
      },
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: "success",
        content: "Save address success!",
        duration: 2,
      });
    }, 1000);
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

  // useEffect
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
  }, [dataWindow]);

  // React.useEffect(() => {
  //   setValue("ward", "");
  //   setValue("district", "");
  //   setWard([]);
  // }, [check.current.province]);

  return (
    <>
      {contextHolder}
      {loadingAD && <Progess className="bg-transparent"></Progess>}
      <form id="add_address" className="w-full h-full">
        <h3 className="mb-8 font-medium text-[2rem] ">
          Thêm địa thông tin giao hàng
        </h3>
        <div className="w-full flex flex-col md:flex-row gap-[1rem]">
          <div className="flex-1">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Tên
            </label>
            <input
              type="text"
              placeholder="nam"
              className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
              {...register("firstName")}
            />
            <p className="text-red-600 text=[12px]">
              {errors.firstName?.message}
            </p>
          </div>
          <div className="flex-1">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Họ
            </label>
            <input
              type="text"
              placeholder="nam"
              className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
              {...register("lastName")}
            />
            <p className="text-red-600 text=[12px]">
              {errors.lastName?.message}
            </p>
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid #D8D7D8" }}
          className="mt-[16px]"
        >
          <label className="text-[12px] text-[#898889] block" htmlFor="">
            Email
          </label>
          <input
            style={{
              border: "none",
              padding: "4px 0",
            }}
            type="email"
            placeholder="email"
            className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
            {...register("email")}
          />
          <p className="text-red-600 text=[12px]">{errors.email?.message}</p>
        </div>
        <div className="mt-[16px]">
          <label className="text-[12px] text-[#898889] block" htmlFor="">
            Số điện thoại
          </label>
          <input
            type="text"
            placeholder="0987654321"
            className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
            {...register("phone")}
          />
          <p className="text-red-600 text=[12px]">{errors.phone?.message}</p>
        </div>
        <div className="mt-[16px]">
          <label className="text-[12px] text-[#898889] block" htmlFor="">
            Địa chỉ
          </label>
          <input
            type="100 Le Van Sy"
            placeholder="nam"
            className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
            {...register("address")}
          />
          <p className="text-red-600 text=[12px]">{errors.address?.message}</p>
        </div>
        <div className="mt-[16px] w-full h-auto flex flex-col md:flex-row gap-[16px]">
          <div className=" flex-1">
            <div className="w-full">
              <label className="text-[12px] text-[#898889] block" htmlFor="">
                Tỉnh/Thành phố
              </label>
              <select
                className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
                {...register("province", {
                  onChange: (e) => {
                    handleChangeAddress(e, "PROVINCE");
                  },
                })}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {province?.length > 0 &&
                  province?.map((item) => (
                    <option key={item.i} value={item.n}>
                      {item.n}
                    </option>
                  ))}
              </select>
              <p className="text-red-600 text=[12px]">
                {errors.province?.message}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Quận/Huyện
            </label>
            <select
              className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
              {...register("district", {
                onChange: (e) => {
                  handleChangeAddress(e, "DISTRICT");
                },
              })}
            >
              <option value="">Chọn quận/huyện</option>
              {district.length > 0 &&
                district.map((item) => (
                  <option key={item.i} value={item.n}>
                    {item.n}
                  </option>
                ))}
            </select>
            <p className="text-red-600 text=[12px]">
              {errors.district?.message}
            </p>
          </div>
          <div className="flex-1">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Phường/Xã
            </label>
            <select
              className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
              {...register("ward")}
            >
              <option value="">Chọn phường/xã</option>
              {ward?.length > 0 &&
                ward.map((item) => (
                  <option key={item.i} value={item.n}>
                    {item.n}
                  </option>
                ))}
            </select>
            <p className="text-red-600 text=[12px]">{errors.ward?.message}</p>
          </div>
        </div>
        <div className="overflow-hidden relative w-full mt-[28px]">
          <div className="flex gap-[2rem] ">
            <div className="relative flex items-center  justify-center gap-[0.5rem]  ">
              <input
                type="radio"
                style={{ margin: 0 }}
                className=" text-red bg-red checked:bg-red mr-[11px]"
                name="addressType"
                value={1}
                {...register("addressType")}
                defaultChecked
              />
              <label style={{ margin: 0 }} htmlFor="">
                Địa chỉ mặc định
              </label>
            </div>
            <div className=" relative flex items-center   justify-center gap-[0.5rem] ">
              <input
                type="radio"
                style={{ margin: 0 }}
                className=" text-red bg-red checked:bg-red  mr-[11px]"
                name="addressType"
                value={2}
                {...register("addressType")}
              />
              <label style={{ margin: 0 }} htmlFor="">
                Nhà
              </label>
            </div>
            <div className=" relative flex items-center  justify-center gap-[0.5rem]  ">
              <input
                type="radio"
                style={{ margin: 0 }}
                className="text-red form-radio  mr-[11px]"
                name="addressType"
                value={3}
                {...register("addressType")}
              />
              <label style={{ margin: 0 }} htmlFor="">
                Công ty
              </label>
            </div>
            <div className=" relative flex items-center  justify-center gap-[0.5rem]  ">
              <input
                type="radio"
                style={{ margin: 0 }}
                className="form-radio text-indigo-500  mr-[11px]"
                name="addressType"
                value={4}
                {...register("addressType")}
              />
              <label style={{ margin: 0 }} htmlFor="">
                Khác
              </label>
            </div>
          </div>
          <p className="text-red-600 text=[12px]">
            {errors.addressType?.message}
          </p>
        </div>
        <div className="mt-[16px] flex justify-between gap-[8px]">
          <div className="w-[50%]">
            <button
              style={{ background: "#D72229", color: "#ffffff" }}
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="bg-[#d72229] mt-[24px] h-[34px] leading-[34px] rounded-[4px] w-[100%] flex justify-center text-white"
            >
              Lưu địa chỉ
            </button>
          </div>
          <div className="w-[50%]">
            <button
              type="reset"
              onClick={() => {
                reset();
                setHide();
              }}
              className="bg-white border-solid border-[1px]  mt-[24px] h-[34px] leading-[34px] rounded-[4px] w-[100%] flex justify-center "
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Address;
