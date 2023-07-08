import { useState } from "react";

export const useForm = (initialState = {}) => {
  const [data, setData] = useState(initialState);
  const resetData = () => {
    setData(initialState);
  };

  const handleInputChange = ({ target }) => {
    const { name, type, checked, value } = target;
    setData({
      ...data,
      [name]: type === "checkbox" || type === "radio" ? checked : value,
    });
  };

  return [data, handleInputChange, resetData, setData];
};
