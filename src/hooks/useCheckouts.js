import axios from "axios";

export default function useCheckouts() {
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
  async function Signin() {
    try {
      const response = await axios.post(process.env.REACT_APP_API_SIGNIN, {
        fullname: "",
        email: "",
      });
    } catch (error) {}
  }
  async function fetchLocationP(props) {
    const response = await axios.post(
      "https://namperfume.net/checkouts/shipping_address.js",
      {
        country_code: "VN",
        province_code: props.queryKey[1] || "",
        district_code: props.queryKey[2] || "",
        ward_code: props.queryKey[3] || "",
      }
    );

    if (response) {
      return response.data;
    }
  }
  async function postLocation(props) {
    try {
      const response = await axios.post(process.env.REACT_APP_API_SIGNIN, {
        country_code: "VN",
        full_name: props.full_name
          ? props.full_name
          : props.first_name && props.last_name
          ? props.first_name + " " + props.last_name
          : "",
        email: props.email ? props.email : "",
        phone: props.phone ? props.phone : "",
        address: props.address ? props.address : "",
        province_code: props.province_code || "",
        district_code: props.district_code || "",
        ward_code: props.ward_code || "",
      });

      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
  async function postPayment(props) {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_PAYMENT_METHOD,
        {
          payment_method_id: props.payID,
        }
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
  async function postUpdateCart(props) {
    try {
      const response = await axios.post(
        "https://namperfume.net/cart/update.js",
        {
          ...props,
        }
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
  async function getCart() {
    try {
      const response = await axios.get("https://namperfume.net/cart/update.js");

      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
  async function postAddress(bodyFormData) {
    try {
      const response = await axios.post(
        "https://namperfume.net/account/addresses",
        bodyFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
  async function getListAddress() {
    try {
      const response = axios.get(
        "https://namperfume.net/account?view=list-addresses",
        {
          withCredentials: true,
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (response) {
        return (await response).data;
      }
    } catch (error) {
      return error;
    }
  }
  async function deleteAddress(id) {
    const bodyForm = new FormData();
    bodyForm.append("_method", "delete");
    try {
      const response = await axios.post(
        `https://namperfume.net/account/addresses/${id}`,
        bodyForm,
        {
          withCredentials: true,
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response) {
        return response;
      }
    } catch (error) {
      return error;
    }
  }
  async function updateAddress({ id, bodyFormData }) {
    try {
      const response = await axios.post(
        `https://namperfume.net/account/addresses/${id}`,
        bodyFormData,
        {
          withCredentials: true,
          headers: { "Content-type": "application/x-www-form-urlencoded" },
        }
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
  async function completeCheckout({ body }) {
    const response = await axios.post(
      "https://namperfume.net/checkouts/complete",
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response) {
      return response;
    }
  }
  return {
    fetchDataCheckouts,
    fetDataAccount,
    fetchLocationP,
    postLocation,
    postPayment,
    postUpdateCart,
    getCart,
    postAddress,
    getListAddress,
    deleteAddress,
    updateAddress,
    completeCheckout,
  };
}
