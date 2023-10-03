import React from "react";
import { classNames } from "../../../utils/ClassNames";
import Icon from "../../icon/Icon";

export default function InputComponent({
  label,
  style,
  icon,
  min,
  max,
  textarea,
  name = "empty",
  value = {empty: ""},
  error = {empty: ""},
  placeholder,
  disabled = false,
  type = "text",
  autocomplete = "off",
  onChange,
  onClickIcon,
  className = "",
}) {
  return (
    <div style={{ width: "100%" }}>
      {textarea ? (
        <>
          <label
            htmlFor="price"
            className={classNames(
              error[name] ? "text-red-500" : "text-text",
              "block text-sm font-medium text-start"
            )}
          >
            {label}
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <textarea
              value={value[name]}
              style={{ ...style, minHeight: "90px" }}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              onChange={onChange}
              name={name}
              className={classNames(
                disabled ? "bg-white-200" : "",
                value[name] ? "border-primary" : "",
                error[name] ? "text-red-500 border-red-500 focus:border-red-500" : "",
                "input-base"
              )}
            ></textarea>
            {error[name] && (
              <span className="text-span-1 flex items-center text-red-500 gap-2 mt-1">
                <Icon.Info className="icon-principal" /> {error[name]}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <label
            htmlFor="price"
            className={classNames(
              error[name] ? "text-red-500" : "text-text",
              "block text-sm font-medium text-start"
            )}
          >
            {label}
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            {icon && (
              <div className={classNames(onClickIcon ? "button-icon-base p-0 cursor-pointer" : "pointer-events-none", "absolute inset-y-0 right-0 flex items-center justify-center")}>
                <span 
                  className={classNames(onClickIcon ? "active:bg-white-200 rounded-full" : "", "text-gray-500 sm:text-sm icon-principal text-text")}
                  onClick={onClickIcon}
                >
                  {icon}
                </span>
              </div>
            )}
            <input
              value={value[name]}
              style={style}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              onChange={onChange}
              name={name}
              min={min}
              max={max}
              autoComplete={autocomplete}
              className={classNames(
                "input-base",
                className,
                disabled ? "bg-white-200 border-white-400" : "",
                value[name] ? "border-primary text-text" : "",
                icon ? "pr-10" : "pr-4",
                error[name]
                  ? "text-red-500 border-red-500 focus:border-red-500"
                  : "form-control"
              )}
            />
            {error[name] && (
              <span className="text-span-1 flex items-center text-red-500 gap-2 mt-1">
                <Icon.Info className="icon-principal" /> {error[name]}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
