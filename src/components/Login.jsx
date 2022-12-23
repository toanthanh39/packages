import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";

const schema = yup
  .object({
    phone: yup
      .string("Só điện thoại không đúng định dạng")
      .required("Vui lòng nhập số điện thoại"),
    password: yup
      .string("Password không đúng định dạng")
      .required("Vui lòng nhập password"),
  })
  .required();

const Login = ({ handleChageScreen }) => {
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = React.createRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver dùng để validate với yup
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    console.log(data);
    // recaptchaRef.current.execute();
    // const token = recaptchaRef.current.getValue();
    // console.log("🚀 ~ file: Login.jsx:33 ~ onSubmit ~ token", token);
    handleChageScreen("checkout");
  };
  return (
    <div className="w-full p-[16px]">
      <div>
        <p className="text-center font-bold mb-[24px]">Thanh toán</p>
        <div>
          <h3 className="mb-[8px] font-medium text-[20px]">
            Checkout as guest
          </h3>
          <p className="mb-[16px] text-[12px] text-[#898889]">
            (You will have the option to create an account later)
          </p>
          <a
            href="/"
            className="bg-[#d72229] h-[34px] rounded-[4px] w-[100%] flex justify-center text-white leading-[34px]"
          >
            Checkout as guest
          </a>
        </div>

        <form className="mt-[40px]" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-[16px]  font-medium text-[20px]">Sign in</h3>

          <div className="">
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
          <div className="mt-[24px]">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] pr-[30px] focus:outline-none"
                placeholder="**********"
                {...register("password")}
              />
              <img
                className="absolute right-0 top-0"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                src="/asset/images/show_password.png"
                alt=""
              />
            </div>

            <p className="text-red-600 text=[12px]">{errors.phone?.message}</p>
          </div>
          {/* <label>
            <input
              type="text"
              name="capcha"
              id="capcha"
              // {...register("capcha")}
              className=""
            />
            <ReCAPTCHA
              sitekey="6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM"
              ref={recaptchaRef}
            />
          </label> */}

          <a href="/" className="text-[#004B8F] text-[12px]">
            Quên mật khẩu ?
          </a>
          <button
            style={{ background: "#D72229", color: "#ffffff" }}
            type="submit"
            className="bg-[#d72229] mt-[24px] h-[34px] rounded-[4px] w-[100%] flex justify-center text-white leading-[34px]"
          >
            Signin and checkout
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
