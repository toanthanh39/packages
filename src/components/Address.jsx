import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "react-query";
import useCheckouts from "./../hooks/useCheckouts";
import { message } from "antd";
import { UseGlobalContext } from "../contexts/GlobalContext";
import Progess from "./child/Progess";

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
});

const Address = ({ handleChageScreen }) => {
  const { fetchLocationP, postLocation, postAddress } = useCheckouts();
  const { city } = UseGlobalContext();

  // State

  const [district, setDistrict] = React.useState([]);
  const [ward, setWard] = React.useState([]);
  const [enable, setEnable] = React.useState(false);
  const check = React.useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

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
            handleChageScreen("infor");
          }, 2500);
        })
        .catch((error) => {
          window.alert("some thing went wrong ! Please check your information");
          return;
        });
    }
  };
  check.current = {
    city: watch("province"),
    district: watch("district"),
    ward: watch("ward"),
  };

  // useQuery
  const {
    data: location,
    error,
    isLoading,
  } = useQuery(
    [
      "location",
      check.current.city,
      check.current.district,
      check.current.ward,
    ],

    fetchLocationP,
    {
      enabled: enable,
    }
  );

  // useEffect
  React.useEffect(() => {
    if (check.current.city !== "") {
      location && setDistrict(location.checkouts.available_districts);
      if (check.current.district !== "") {
        location && setWard(location.checkouts.available_wards);
      } else {
        setWard([]);
      }
    } else {
      setWard([]);
      setDistrict([]);
      setValue("ward", "");
      setValue("district", "");
    }
  }, [check.current.city, check.current.district, isLoading, location]);

  React.useEffect(() => {
    setValue("ward", "");
    setValue("district", "");
    setWard([]);
  }, [check.current.city]);
  React.useEffect(() => {}, []);
  //   React.useEffect(() => {
  //     var countries = null;
  // 	const addressData = window.Countries;

  // 	/* Get list countries */
  // 	countries = addressData.countries;

  // 	let countryId = 241;
  // 	let provinces = addressData[countryId];

  // 	// Để render tỉnh thành thì for từ provinces.provinces

  // 	// Xong trong event on change của tình thành
  // 	// get countryId và provinceId
  // 	async function getDistrict(provinceId){
  //    const districts = await addressData.getProvince(countryId, provinceId);

  //     if(Object.keys(districts).length !== 0){
  //     	//district là object có các trường là i <=> id, n <=> name
  //     }
  // 	}
  // 	getDistrict();
  // 	/* Kết thúc sự kiện chọn tỉnh thành, render quận */
  // //Object.keys(districts).length === 0
  // 	// rồi đến sự kiện change quận để render ra phường xã
  // 	// thì cứ get id của country, province, district
  // 	// xong cũng sẽ có hàm trong hàm như trên
  // 	async function getWard(districtId,provinceId){
  // 	const	districts = await addressData.getProvince(countryId, provinceId);

  // 		if(Object.keys(districts).length !== 0){
  // 	 		let wards = districts[districtId].wards;
  // 	 		// ward cũng sẽ lần lượt là object có i <=> id, n <=> name
  //     }
  // 	}
  // 	getWard();
  //   },[])
  return (
    <>
      {contextHolder}
      {isLoading && <Progess className="bg-transparent"></Progess>}
      <form className="w-full p-[16px]" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-center font-bold">Thanh toán</p>
        <h3 className="mb-8 font-medium text-[20px] mt-[24px]">
          Địa chỉ giao hàng
        </h3>
        <div className="mt-[16px]">
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
        <div className="mt-[16px]">
          <label className="text-[12px] text-[#898889] block" htmlFor="">
            Họ
          </label>
          <input
            type="text"
            placeholder="nam"
            className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
            {...register("lastName")}
          />
          <p className="text-red-600 text=[12px]">{errors.lastName?.message}</p>
        </div>
        <div className="mt-[16px]">
          <label className="text-[12px] text-[#898889] block" htmlFor="">
            Email
          </label>
          <input
            style={{ padding: 0, borderBottom: "1px solid #898889" }}
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
        <div className="mt-[16px] flex justify-between gap-[8px]">
          <div className="w-full">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Tỉnh/Thành phố
            </label>
            <select
              className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
              {...register("province", {
                onBlur: () => {
                  setEnable(true);
                },
              })}
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {city?.length > 0 &&
                city?.map((item, index) => (
                  <option key={index} value={item.province_name}>
                    {item.province_name}
                  </option>
                ))}
            </select>
            <p className="text-red-600 text=[12px]">
              {errors.province?.message}
            </p>
          </div>
        </div>
        <div className="mt-[16px] flex justify-between gap-[8px]">
          <div className="w-[50%]">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Quận/Huyện
            </label>
            <select
              className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
              {...register("district")}
            >
              <option value="">Chọn quận/huyện</option>
              {district !== null &&
                district.length > 0 &&
                district.map((item, index) => (
                  <option key={item.id} value={item.district_name}>
                    {item.district_name}
                  </option>
                ))}
            </select>
            <p className="text-red-600 text=[12px]">
              {errors.district?.message}
            </p>
          </div>
          <div className="w-[50%]">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Phường/Xã
            </label>
            <select
              className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
              {...register("ward")}
            >
              <option value="">Chọn phường/xã</option>
              {ward !== null &&
                ward?.length > 0 &&
                ward.map((item) => (
                  <option key={item.id} value={item.ward_name}>
                    {item.ward_name}
                  </option>
                ))}
            </select>
            <p className="text-red-600 text=[12px]">{errors.ward?.message}</p>
          </div>
        </div>
        <div className="overflow-hidden relative w-full mt-[28px]">
          <div className="flex overflow-x-scroll">
            <div className="flex-shrink-0 w-[35%] relative">
              <input
                type="radio"
                className=" text-red bg-red checked:bg-red mr-[11px]"
                name="addressType"
                value={1}
                {...register("addressType")}
                defaultChecked
              />
              <label htmlFor="">Địa chỉ mặc định</label>
            </div>
            <div className="flex-shrink-0 w-[20%] relative">
              <input
                type="radio"
                className=" text-red bg-red checked:bg-red  mr-[11px]"
                name="addressType"
                value={2}
                {...register("addressType")}
              />
              <label htmlFor="">Nhà</label>
            </div>
            <div className="flex-shrink-0 w-[25%] relative">
              <input
                type="radio"
                className="text-red form-radio  mr-[11px]"
                name="addressType"
                value={3}
                {...register("addressType")}
              />
              <label htmlFor="">Công ty</label>
            </div>
            <div className="flex-shrink-0 w-[20%] relative">
              <input
                type="radio"
                className="form-radio text-indigo-500  mr-[11px]"
                name="addressType"
                value={4}
                {...register("addressType")}
              />
              <label htmlFor="">Khác</label>
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
              type="submit"
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
                handleChageScreen("infor");
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
