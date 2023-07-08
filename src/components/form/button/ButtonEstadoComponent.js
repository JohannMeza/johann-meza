import React from "react";
import { classNames } from "../../../utils/ClassNames";
import Controls from "../../Controls";

export default function ButtonEstadoComponent({
  className = "",
  colorButton = "",
  colorText = "",
  title = "",
  onClick = () => {},
}) {
  return (
    <div className={classNames("flex items-center gap-2", className)}>
      <div
        onClick={onClick}
        className={classNames("p-1 w-5 h-5 rounded-xl")}
        style={colorButton}
      ></div>
      <span className={classNames("font-semibold")} style={colorText}>
        {title}
      </span>
    </div>
  );
}
