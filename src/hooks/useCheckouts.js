import React from "react";
import axios from "axios";

export default function useCheckouts() {
  const [checkout, setCheckout] = React.useState(null);

  async function fetchDataCheckouts() {
    try {
      const response = await axios.get(process.env.REACT_APP_API_CHECKOUTS);
      if (response) return response.data;
    } catch (error) {
      return error;
    }
  }

  async function fetDataAccount() {
    try {
      const response = await axios.get(process.env.REACT_APP_API_ACCOUNT);
      if (response) return response.data;
    } catch (error) {
      return error;
    }
  }
  return {
    fetchDataCheckouts,
    fetDataAccount,
  };
}
