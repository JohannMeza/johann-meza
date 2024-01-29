import { useState } from "react";

export const useForm = (initialState = {}) => {
  const [data, setData] = useState(initialState);
  const resetData = () => {
    setData(initialState);
  };

  const handleInputChange = ({ target }) => {
    const { name, type, checked, value } = target;
    if (type === "checkbox") {
      return setData((data) => {
        let arrCheckbox = Object.entries({ ...data, [name]: checked }).filter(el => el[1]);
        let objCheckbox = {};

        Array.from(arrCheckbox, el => ({ [el[0]]: el[1] })).forEach(el => Object.assign(objCheckbox, el));
        return objCheckbox;
      });
    }
    setData({ ...data, [name]: value });
  };

  return [data, handleInputChange, resetData, setData];
};
