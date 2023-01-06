import { message } from "antd";

const [messageApi] = message.useMessage();

export const openMessage = ({ type = "success", content = "" }) => {
  messageApi.open({
    type: type,
    content: content,
    duration: 5,
    style: {
      position: "relative",
      top: "10vh",
      zIndex: 999999,
    },
  });
};
