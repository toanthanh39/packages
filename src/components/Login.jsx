import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
// const schema = yup
//   .object({
//     login_phone: yup
//       .string()
//       .email("email không đúng định dạng")
//       .required("Vui lòng nhập số điện thoại"),
//     login_password: yup
//       .string()
//       .required("Vui lòng nhập password")
//       .min(6, "Độ dài tối thiểu 6 ký tự")
//       .max(12, "Độ dài tối đa 12 ký tự"),
//   })
//   .required();

const Login = ({ handleChageScreen }) => {
  const [showPassword, setShowPassword] = useState(false);
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });
  // const onSubmit = (data) => {
  //   console.log(data);
  //   // recaptchaRef.current.execute();
  //   // const token = recaptchaRef.current.getValue();
  //   // console.log("🚀 ~ file: Login.jsx:33 ~ onSubmit ~ token", token);
  //   // handleChageScreen("checkout");
  // };
  return (
    <div className="w-full p-[16px] max-w-[768px] mx-auto">
      <div>
        <p className="text-center font-bold mb-[24px]">Thanh toán</p>
        <div>
          <h3 className="mb-[8px] font-medium text-[20px]">
            Checkout as guest
          </h3>
          <p className="mb-[16px] text-[12px] text-[#898889]">
            (You will have the option to create an account later)
          </p>
          <button
            onClick={() => handleChageScreen("checkout")}
            className="bg-[#d72229] h-[34px] rounded-[4px] w-[100%] flex justify-center text-white leading-[34px]"
          >
            Checkout as guest
          </button>
        </div>

        <form className="mt-[40px]" id="login_form" name="login_form">
          <h3 className="mb-[16px]  font-medium text-[20px]">Sign in</h3>

          <div className="">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Email
            </label>
            <input
              type="email"
              style={{
                borderBottom: "1px solid #D8D7D8",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                padding: "4px 0",
                borderRadius: 0,
              }}
              id="login_phone"
              required
              name="customer[email]"
              placeholder="your email"
              className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] focus:outline-none"
            />
            {/* <p className="text-red-600 text=[12px]">
              {errors.login_phone?.message}
            </p> */}
          </div>
          <div className="mt-[24px]">
            <label className="text-[12px] text-[#898889] block" htmlFor="">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="login_password"
                required
                name="customer[password]"
                className="border border-x-0 border-t-0 w-full pt-[4px] pb-[4px] pr-[30px] focus:outline-none"
                placeholder="your password"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-0 top-0"
                  onClick={() => {
                    setShowPassword(false);
                  }}
                ></AiFillEyeInvisible>
              ) : (
                <AiFillEye
                  className="absolute right-0 top-0"
                  onClick={() => {
                    setShowPassword(true);
                  }}
                ></AiFillEye>
              )}
            </div>

            {/* <p className="text-red-600 text=[12px]">
              {errors.login_password?.message}
            </p> */}
          </div>
          <input
            type="hidden"
            style={{ display: "none" }}
            className="invisible"
            id="g-recaptcha-response"
            name="g-recaptcha-response"
            value=""
          />
          <input
            type="hidden"
            style={{ display: "none" }}
            name="return_to"
            value="/pages/checkouts"
          ></input>
          <div className="mt-[16px]">
            <a
              href="https://namperfume.net/account/login"
              onClick="showRecoverPasswordForm();return false;"
              className="text-[#004B8F] text-[12px] font-[700] "
            >
              Quên mật khẩu ?
            </a>
          </div>
          <button
            style={{ background: "#D72229", color: "#ffffff" }}
            type="submit"
            id="login_submit"
            name="login_submit"
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
