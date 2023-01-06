import React, { Children } from "react";
import { Collapse } from "antd";
import { MinusCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const CollapseCustom = ({ children, ...props }) => {
  return (
    <div>
      <Collapse
        bordered={false}
        defaultActiveKey={["0"]}
        expandIcon={({ isActive }) =>
          isActive ? (
            <CheckCircleOutlined style={{ color: "green" }} />
          ) : (
            <MinusCircleOutlined />
          )
        }
        className="site-collapse-custom-collapse"
      >
        {/* "(Quý
                    khách cần xuất hoá đơn mua hàng, vui lòng nhập thông tin tại
                    đây)" */}
        <Panel
          header={
            <p>
              <strong>Xuất hoá đơn</strong>
              (Quý khách cần xuất hoá đơn mua hàng, vui lòng nhập thông tin tại
              đây)
            </p>
          }
          key="1"
          className="site-collapse-custom-panel"
        >
          {children}
        </Panel>
      </Collapse>
    </div>
  );
};

export default CollapseCustom;
