import React from "react";
import { FilePond } from "react-filepond";
import { classNames } from "../../../utils/ClassNames";
import Controls from "../../Controls";
import Icon from "../../icon/Icon";
import Image from "next/image";

export default function FileComponent({
  error = { empty: "" },
  name = { empty: "" },
  value = { empty: "" },
  multiple = false,
  disabled = false,
  server = null,
  label = "",
  setFiles,
  max = 1,
  files,
  setData
}) {
  return (
    <div className="w-full input-file-base">
      <label
        htmlFor="price"
        className={classNames(
          error[name] ? "text-red-500" : "text-text",
          "block text-sm font-medium text-start"
        )}
      >
        {label}
      </label>

      {value[name] ? (
        <div>
          <div>
            <Controls.ButtonIconComponent
              title="Eliminar"
              icon={<Icon.Close />}
              onClick={() => setData(data => { return {...data, [name]: "" } })}
            />
            <a href={value[name]} target="_blank" rel="noreferrer">
              <Controls.ButtonIconComponent
                title="Visualizar"
                icon={<Icon.Eye />}
              />
            </a>
          </div>
          
          <Image
            src={value[name]}
            alt="Portada"
            width={80}
            height={50}
            style={{ minWidth: 80, objectFit: "cover", borderRadius: "10px" }}
          />
        </div>
      ) : (
        <span>
          <FilePond
            labelIdle='Arrastre y suelte sus archivos o <span class="filepond--label-action">navegue</span>'
            instantUpload={false}
            onupdatefiles={setFiles}
            allowMultiple={multiple}
            disabled={disabled}
            maxFiles={max}
            load="http://res.cloudinary.com/daip2rhye/image/upload/v1678903879/i8hcidz8pvq88v76zq6i.png"
            server={server}
            files={files}
            name={name}
            type="png"
          />
          {error[name] && (
            <span className="text-span-1 flex items-center text-red-500 gap-2 -translate-y-2">
              <Icon.Info className="icon-principal" /> {error[name]}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
