import React from "react";
import useCheckouts from "../hooks/useCheckouts";
import { UseGlobalContext } from "../contexts/GlobalContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Progess from "./child/Progess";
import { message } from "antd";
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
  district: yup.string().required("Vui lòng chọn địa chỉ quận/huyện"),
  province: yup.string().required("Vui lòng chọn địa chỉ tỉnh/thành phố"),
  // ward: yup.string().required("Vui lòng chọn địa chỉ phường/xã"),
  addressType: yup.number().required("Vui lòng chọn loại địa chỉ"),
  email: yup.string().required("Vui lòng nhập email công ty"),
});

const UpdateAddress = ({ onClose, isChange, isCurrent, setFinalAddress }) => {
  //State
  const [province, setProvince] = React.useState([]);
  const [district, setDistrict] = React.useState([]);

  const [ward, setWard] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const check = React.useRef(null);
  const { dataUpdate, dataWindow } = UseGlobalContext();
  const [loadingAD, setLoaingAD] = React.useState(false);
  const id = dataUpdate.id;

  //useHook
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  //useForm
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
      firstName: "",
      lastName: "",
      address: "",
    },
    mode: "all",
  });
  //Function

  check.current = {
    province: watch("province"),
    district: watch("district"),
  };

  //Function
  const openMessageSuccess = () => {
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
  const handleFirstChangeAddress = async () => {
    const res = await dataWindow.getProvince(241, dataUpdate.province_name);
    if (res) {
      setDistrict(res.districts);
      setWard(res[dataUpdate.district_name].wards);
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
  };

  //onSubmit
  const onSubmit = async (data) => {
    if (isCurrent === true) {
      setFinalAddress({
        full_name: data.lastName + " " + data.firstName,
        province_code: data.province,
        district_code: data.district,
        phone: data.phone,
        address:
          data.address +
          ", " +
          data.ward +
          ", " +
          data.district +
          ", " +
          data.province,
        ward_code: data.ward,
        email: data.email,
        type:
          data.addressType === 1
            ? "Địa chỉ mặc định"
            : data.addressType === 2
            ? "Nhà"
            : data.addressType === 3
            ? "Công ty"
            : "Khác",
      });
    }
    setLoading(true);
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
    // const res = updateAddress({ id, bodyFormData });
    // if (res) {
    //   res
    //     .then((data) => {})
    //     .catch((error) => {
    //       window.alert("some thing went wrong ! Please check your information");
    //       return;
    //     });
    // }
    await axios
      .post(`https://namperfume.net/account/addresses/${id}`, bodyFormData, {
        withCredentials: true,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        setLoading(false);
        openMessageSuccess();
        onClose();
        isChange(2);
      })
      .catch((err) => {
        openMessage({
          type: "error",
          content: "something went wrong! Please check your information.",
        });
        return;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //useEffect
  React.useEffect(() => {
    if (check.current.province === "" || check.current.province === undefined) {
      setWard([]);
      setDistrict([]);
      setValue("ward", "");
      setValue("district", "");
    }
  }, [check.current.province]);
  React.useEffect(() => {
    if (dataWindow !== undefined && dataWindow !== null) {
      setProvince(dataWindow[241].provinces);
    }
  }, [dataWindow]);
  React.useEffect(() => {
    reset({
      firstName: dataUpdate.first_name,
      lastName: dataUpdate.last_name,
      email: dataUpdate.email,
      province: dataUpdate.province_name,
      district: dataUpdate.district_name,
      ward: dataUpdate.ward_name,
      address: dataUpdate.address.split(",")[0],
    });

    handleFirstChangeAddress();
    return () => {
      reset();
    };
  }, []);
  return (
    <>
      {contextHolder}
      {loadingAD && <Progess className="bg-transparent"></Progess>}
      <form className="w-full h-auto p-[0]">
        <h3 className="mb-8 font-medium text-[2rem] ">
          Cập nhật thông tin giao hàng
        </h3>
        <div className="w-full h-auto  gap-[8px]">
          <div className="mt-[16px] flex flex-col md:flex-row gap-[16px] w-full">
            <div className=" flex-1">
              <label className="text-[12px] text-[#898889] block" htmlFor="">
                Tên
              </label>
              <input
                type="text"
                placeholder="nam"
                className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
                defaultValue={dataUpdate.last_name}
                {...register("lastName")}
              />
              <p className="text-red-600 text=[12px]">
                {errors.lastName?.message}
              </p>
            </div>
            <div className=" flex-1">
              <label className="text-[12px] text-[#898889] block" htmlFor="">
                Họ
              </label>
              <input
                type="text"
                placeholder="nam"
                className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
                defaultValue={dataUpdate.first_name}
                {...register("firstName")}
              />
              <p className="text-red-600 text=[12px]">
                {errors.firstName?.message}
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
              className=" w-full pt-[4px] pb-[4px] focus:outline-none"
              defaultValue={dataUpdate.email}
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
              defaultValue={dataUpdate.phone}
              {...register("phone")}
            />
            <p className="text-red-600 text=[12px]">{errors.phone?.message}</p>
          </div>
          <div className="mt-[16px] ">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Địa chỉ
            </label>
            <input
              type="text"
              placeholder="nam"
              className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
              defaultValue={dataUpdate.address.split(",")[0]}
              {...register("address")}
            />
            <p className="text-red-600 text=[12px]">
              {errors.address?.message}
            </p>
          </div>
          <div className="w-full mt-[16px] flex flex-col md:flex-row gap-[8px]">
            <div className="flex-1">
              <label className="text-[12px] text-[#898889] block" htmlFor="">
                Tỉnh/Thành phố
              </label>
              <select
                className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
                {...register("province", {
                  onChange: (e) => {
                    setValue("district", "");
                    handleChangeAddress(e, "PROVINCE");
                  },
                })}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {province?.length > 0 &&
                  province?.map((item) => (
                    <option
                      key={item.i}
                      value={item.n}
                      selected={item.i == dataUpdate.province_id ? true : false}
                    >
                      {item.n}
                    </option>
                  ))}
              </select>
              <p className="text-red-600 text=[12px]">
                {errors.province?.message}
              </p>
              <div className="mt-[16px] flex justify-between gap-[8px]"></div>
            </div>
            <div className="flex-1 ">
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
                    <option
                      key={item.i}
                      value={item.n}
                      selected={item.i == dataUpdate.district_id ? true : false}
                    >
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
                    <option
                      key={item.i}
                      value={item.n}
                      selected={item.i == dataUpdate.ward_id ? true : false}
                    >
                      {item.n}
                    </option>
                  ))}
              </select>
              <p className="text-red-600 text=[12px]">{errors.ward?.message}</p>
            </div>
          </div>

          <div className="relative w-full mt-[28px]">
            <div id="webkit-scroll" className="flex gap-[1.2rem] ">
              <div className="relative flex items-center gap-[0.5rem]  ">
                <input
                  type="radio"
                  style={{ margin: 0 }}
                  className=" text-red bg-red checked:bg-red mr-[11px]"
                  name="addressType"
                  value={1}
                  defaultChecked={dataUpdate.is_default === true ? true : null}
                  {...register("addressType")}
                />
                <label htmlFor="" style={{ margin: 0 }}>
                  Mặc định
                </label>
              </div>
              <div className=" relative flex items-center gap-[0.5rem]  ">
                <input
                  type="radio"
                  style={{ margin: 0 }}
                  className=" text-red bg-red checked:bg-red  mr-[11px]"
                  name="addressType"
                  value={2}
                  defaultChecked={
                    dataUpdate.addressType === "Nhà" &&
                    dataUpdate.is_default !== true
                      ? true
                      : null
                  }
                  {...register("addressType")}
                />
                <label htmlFor="" style={{ margin: 0 }}>
                  Nhà
                </label>
              </div>
              <div className="  relative flex items-center gap-[0.5rem]  ">
                <input
                  type="radio"
                  style={{ margin: 0 }}
                  className="text-red form-radio  mr-[11px]"
                  name="addressType"
                  value={3}
                  defaultChecked={
                    dataUpdate.addressType === "Công Ty" ? true : null
                  }
                  {...register("addressType")}
                />
                <label htmlFor="" style={{ margin: 0 }}>
                  Công ty
                </label>
              </div>
              <div className="  relative flex items-center gap-[0.5rem]  ">
                <input
                  type="radio"
                  className="form-radio text-indigo-500  mr-[11px]"
                  name="addressType"
                  value={4}
                  defaultChecked={
                    dataUpdate.addressType === "Khác" ? true : null
                  }
                  style={{ margin: 0 }}
                  {...register("addressType")}
                />
                <label htmlFor="" style={{ margin: 0 }}>
                  Khác
                </label>
              </div>
            </div>
            <p className="text-red-600 text=[12px]">
              {errors.addressType?.message}
            </p>
          </div>
        </div>
        <div className="mt-[8px] flex justify-between gap-[8px] w-full">
          <div className="flex-1">
            <button
              style={{ background: "#D72229", color: "#ffffff" }}
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className=" w-full bg-[#d72229] mt-[24px] h-[34px] leading-[34px] rounded-[4px]  flex justify-center text-white"
            >
              {loading ? <Progess></Progess> : "Lưu thông tin"}
            </button>
          </div>
          <div className="flex-1">
            <button
              type="reset"
              onClick={() => {
                onClose();
              }}
              className="w-full bg-white border-solid border-[1px]  mt-[24px] h-[34px] leading-[34px] px-[34px]  rounded-[4px] flex justify-center "
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdateAddress;
