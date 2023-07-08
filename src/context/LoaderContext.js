import React, { createContext, useMemo, useState } from "react";
import Controls from "../components/Controls";
import { CirclesWithBar } from "react-loader-spinner";
import { classNames } from "../utils/ClassNames";

export const LoaderContext = createContext();

export default function LoaderContextProvider({ children }) {
  const [loader, setLoader] = useState(false);
  const onLoaderContext = (value) => setLoader(value)

  const value = useMemo(() => ({ setLoader: onLoaderContext }), []);

  return (
    <LoaderContext.Provider value={value || { setLoader: onLoaderContext }}>
      <div className={classNames(loader ? "loader-base visible" : "visually-hidden absolute")}>
        <CirclesWithBar
          height="100"
          width="100"
          color="#4fa94d"
          wrapperStyle={{}}
          wrapperClass=""
          visible={loader}
          outerCircleColor=""
          innerCircleColor=""
          barColor=""
          ariaLabel="circles-with-bar-loading"
        />
        {loader && <Controls.ButtonComponent onClick={() => setLoader(false)} title="Cancelar" className="color-secondary mt-5" />}
      </div>
      {children}
    </LoaderContext.Provider>
  );
}
