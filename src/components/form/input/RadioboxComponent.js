import React from "react";
import { classNames } from "../../../utils/ClassNames";

export default function RadioboxComponent({
  className,
  onChange = () => {},
  checked,
  disabled = false,
  id = Date.now(),
  label,
  name = "",
  value,
}) {
  return (
    <div className={classNames("w-full input-checkbox-base select-none", className)}>
      <input
        checked={checked[name] === value.toString() || false}
        onChange={onChange}
        disabled={disabled}
        value={value}
        type="radio"
        name={name}
        id={id}
      />
      <label className="w-full" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
