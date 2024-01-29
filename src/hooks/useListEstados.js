import { useEffect, useState } from "react";
import { SaveRequestData } from "../helpers/helpRequestBackend";
import { ListConstants } from "../constants/ListConstants";
import useLoaderContext from "./useLoaderContext";

export const useListEstados = (estados) => {
  const [data, setData] = useState([]);
  const {setLoader} = useLoaderContext();

  const listEstados = (e) => {
    setLoader(true);
    SaveRequestData({
      queryId: 31,
      body: { ID_ESTADOS: estados },
      success: (resp) => {
        setLoader(false);
        setData([ListConstants.LIST_VACIO, ...resp.dataList]);
      },
      error: (err) => {
        setLoader(false);
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => listEstados(), []);

  return data
};
