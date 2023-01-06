import React from "react";
import { Tooltip } from "antd";
const ToolipCustom = ({ title = "", children, className = "", ...props }) => {
  return (
    <div className={`${className}`}>
      <Tooltip title={title} placement="rightTop">
        {children}
      </Tooltip>
    </div>
  );
};

export default ToolipCustom;
