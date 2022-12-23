import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import useLocationForm from "./../hooks/useLocation";

const schema = yup
  .object({
    firstName: yup
      .string("Vui lòng nhập tên")
      .required("Tên không được bỏ trống"),
    lastName: yup.string("Vui lòng nhập họ").required("Họ không được bỏ trống"),
    phone: yup
      .string()
      .matches(
        /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
        "Vui lòng nhập số điện thoại"
      )
      .required("Vui lòng nhập số điện thoại"),
    address: yup.string("Vui lòng nhập địa chỉ").required("Vui lòng địa chỉ"),
    ward: yup
      .string("Vui lòng chọn địa chỉ")
      .required("Vui lòng chọn địa chỉ phường/xã"),
    district: yup
      .string("Vui lòng chọn địa chỉ")
      .required("Vui lòng chọn địa chỉ quận/huyện"),
    province: yup
      .string("Vui lòng chọn địa chỉ")
      .required("Vui lòng chọn địa chỉ tỉnh/thành phố"),
    addressType: yup
      .string("Vui lòng chọn loại địa chỉ")
      .required("Vui lòng chọn loại địa chỉ"),
  })
  .required();

const Address = () => {
  const [location, setLocation] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    // resolver dùng để validate với yup
    // resolver: yupResolver(schema),
  });
  const { fecthLocation } = useLocationForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  const check = {
    city: watch("province"),
    district: watch("district"),
    ward: watch("ward"),
  };
  React.useEffect(() => {
    const data = fecthLocation();
    if (data) {
      data.then((res) => {
        console.log("🚀 ~ file: Address.jsx:62 ~ data.then ~ res", res);
        setLocation(res);
      });
    }
  }, []);
  console.log(process.env);
  return (
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
        <p className="text-red-600 text=[12px]">{errors.firstName?.message}</p>
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
            {...register("province")}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {location &&
              location.map((item) => (
                <option key={item.code} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
          <p className="text-red-600 text=[12px]">{errors.province?.message}</p>
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
            <option value={"1"}>Quận 1</option>
            <option value={"2"}>Quận 2</option>
          </select>
          <p className="text-red-600 text=[12px]">{errors.district?.message}</p>
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
            <option value={"1"}>Phường 1</option>
            <option value={"2"}>Phường 2</option>
            <option value={"3"}>Phường 3</option>
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
              value={"1"}
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
              value={"2"}
              {...register("addressType")}
            />
            <label htmlFor="">Nhà</label>
          </div>
          <div className="flex-shrink-0 w-[25%] relative">
            <input
              type="radio"
              className="text-red form-radio  mr-[11px]"
              name="addressType"
              value={"3"}
              {...register("addressType")}
            />
            <label htmlFor="">Công ty</label>
          </div>
          <div className="flex-shrink-0 w-[20%] relative">
            <input
              type="radio"
              className="form-radio text-indigo-500  mr-[11px]"
              name="addressType"
              value={"4"}
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
            className="bg-white border-solid border-[1px]  mt-[24px] h-[34px] leading-[34px] rounded-[4px] w-[100%] flex justify-center "
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  );
};

export default Address;
