import React from "react";
import { Spin } from "antd";
const Progess = ({ className = "" }) => {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-[99999999999]  bg-opacity-50 select-none ${className}`}
    >
      {/* <div className="w-10 h-10 rounded-full border-[3px] border-blue-600  border-t-transparent animate-spin  "></div> */}
      <Spin size="large" />
    </div>
  );
};

export default Progess;
