import { Modal } from "antd";
import React from "react";

const PopupCustom = ({
  isOpen = false,
  showModal,
  cancel,
  title = "",
  children = "",
}) => {
  return (
    <Modal
      title={title}
      centered
      open={isOpen}
      onOk={cancel}
      onCancel={cancel}
      okButtonProps={{ disabled: true, hidden: true }}
      cancelButtonProps={{ disabled: true, hidden: true }}
      width={950}
      zIndex={1000000}
      style={{ height: "auto" }}
    >
      {children}
    </Modal>
  );
};

export default PopupCustom;
