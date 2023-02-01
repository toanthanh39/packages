import { Result, Button } from "antd";
import React from "react";

const ResultCustom = ({
  title = "404",
  sub = "Sorry, the page you visited does not exist.",
  buttonTitle = "Back",
  status = "404",
}) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Result
        status={status}
        title={title}
        subTitle={sub}
        extra={
          <Button
            type="primary"
            onClick={() => {
              window.location.reload();
            }}
          >
            {buttonTitle}
          </Button>
        }
      />
    </div>
  );
};

export default ResultCustom;
