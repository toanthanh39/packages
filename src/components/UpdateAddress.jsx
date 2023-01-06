import React from "react";
import useCheckouts from "../hooks/useCheckouts";
import { UseGlobalContext } from "../contexts/GlobalContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "react-query";
import axios from "axios";
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
  district: yup.string().required("Vui lòng chọn địa chỉ quận/huyện"),
  province: yup.string().required("Vui lòng chọn địa chỉ tỉnh/thành phố"),
  ward: yup.string().required("Vui lòng chọn địa chỉ phường/xã"),
  addressType: yup.number().required("Vui lòng chọn loại địa chỉ"),
});

const UpdateAddress = ({ onClose, isChange }) => {
  const { fetchLocationP, postLocation, postAddress } = useCheckouts();
  const [district, setDistrict] = React.useState([]);
  const [ward, setWard] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { updateAddress } = UseGlobalContext();
  const check = React.useRef(null);
  const { city, dataUpdate } = UseGlobalContext();
  const id = dataUpdate.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
    mode: "all",
  });

  const onSubmit = async (data) => {
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
        isChange(2);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        isChange(2);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  check.current = {
    city: watch("province"),
    district: watch("district"),
  };

  const {
    data: location,
    error,
    isLoading,
  } = useQuery(
    ["location", check.current.city, check.current.district],

    fetchLocationP
  );

  React.useEffect(() => {
    if (check.current.city !== "") {
      location && setDistrict(location.checkouts.available_districts);
      if (check.current.district !== "") {
        location && setWard(location.checkouts.available_wards);
      } else {
        setWard([]);
      }
    } else {
      setDistrict([]);
      setWard([]);
      setValue("district", "");
      setValue("ward", "");
    }
  }, [check.current.city, check.current.district, isLoading, location]);

  React.useEffect(() => {
    setValue("district", dataUpdate.district_name);
    return () => {
      reset();
    };
  }, []);
  return (
    <>
      <form className="w-full h-auto p-[0]" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-8 font-medium text-[2rem] ">Địa chỉ giao hàng</h3>
        <div className="w-full h-full xl:grid xl:grid-cols-2 xl:gap-2">
          <div className="mt-[16px]">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Tên
            </label>
            <input
              type="text"
              placeholder="nam"
              className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
              defaultValue={dataUpdate?.last_name}
              {...register("lastName")}
            />
            <p className="text-red-600 text=[12px]">
              {errors.lastName?.message}
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
              defaultValue={dataUpdate.first_name}
              {...register("firstName")}
            />
            <p className="text-red-600 text=[12px]">
              {errors.firstName?.message}
            </p>
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
          <div className="mt-[16px]">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Địa chỉ
            </label>
            <input
              type="100 Le Van Sy"
              placeholder="nam"
              className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
              defaultValue={dataUpdate.address}
              {...register("address")}
            />
            <p className="text-red-600 text=[12px]">
              {errors.address?.message}
            </p>
          </div>
          <div className="mt-[16px] flex justify-between gap-[8px]">
            <div className="w-full">
              <label className="text-[12px] text-[#898889] block" htmlFor="">
                Tỉnh/Thành phố
              </label>
              <select
                className="border border-x-0 border-t-0 pt-[4px] pb-[4px] focus:outline-none w-full"
                {...register("province", {
                  onChange: () => {
                    setValue("district", "");
                  },
                })}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {city?.length > 0 &&
                  city?.map((item, index) => (
                    <option
                      key={index}
                      value={item.province_name}
                      selected={
                        item.id === parseInt(dataUpdate.province_id)
                          ? true
                          : false
                      }
                    >
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
                    <option
                      key={item.id}
                      value={item.district_name}
                      selected={
                        item.id === parseInt(dataUpdate.district_id)
                          ? true
                          : false
                      }
                    >
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
                    dataUpdate.addressType === "Nhà" ? true : null
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
          <div className="mt-[8px] flex justify-between gap-[8px]">
            <div>
              <button
                style={{ background: "#D72229", color: "#ffffff" }}
                type="submit"
                disabled={loading}
                className="bg-[#d72229] mt-[24px] h-[34px] leading-[34px] rounded-[4px] w-[100%] flex justify-center text-white"
              >
                {loading ? <Progess></Progess> : "Lưu thông tin"}
              </button>
            </div>
            <div>
              <button
                type="reset"
                onClick={() => {
                  onClose();
                }}
                className="bg-white border-solid border-[1px]  mt-[24px] h-[34px] leading-[34px] px-[34px]  rounded-[4px] w-[100%] flex justify-center "
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdateAddress;
