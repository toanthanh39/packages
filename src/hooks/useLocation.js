import axios from "axios";
import { useEffect, useState } from "react";
function useLocationForm(shouldFetchInitialLocation) {
  const [state, setState] = useState({
    cityOptions: [],
    districtOptions: [],
    wardOptions: [],
    selectedCity: null,
    selectedDistrict: null,
    selectedWard: null,
  });

  useEffect(() => {
    // First-load logic
  }, []);

  function onCitySelect(option) {
    // Logic khi chọn Tỉnh/Thành
  }

  function onDistrictSelect(option) {
    // Logic khi chọn Phường/Xã
  }

  function onWardSelect(option) {
    // Logic khi chọn Quận/Huyện
  }
  async function fecthLocation() {
    try {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=1"
      );
      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
  return { state, onCitySelect, onDistrictSelect, onWardSelect, fecthLocation };
}

export default useLocationForm;
