import React from "react";

export const useToggle = (initialValue) => {
  const [isOpen, setIsOpen] = React.useState(initialValue || false);

  const setHide = () => {
    setIsOpen(false);
  };
  const setShow = () => {
    setIsOpen(true);
  };
  const toggleShow = () => {
    setIsOpen((isOpen) => !isOpen);
  };
  return {
    isOpen,
    setHide,
    setShow,
    toggleShow,
  };
};
