import React from "react";
import { classNames } from "../../utils/ClassNames";
import Controls from "../Controls";
import Image from "next/image";
import Icon from "../icon/Icon";

export default function FrontCardComponent({
  className = "",
  title,
  navigate = () => {},
  img = "/",
  descripcionCorta = "",
}) {
  const styleImage = {
    width: "100%",
    minHeight: "220px",
    position: "relative",
  };

  const ImageNotFound = () => {
    return (
      <div className="bg-primary-100 flex flex-col items-center justify-center h-full">
        <div style={{ width: "140px" }}><Icon.Camera /></div>
        <h4>Imagen no encontrada</h4>
      </div>
    )
  }

  return (
    <article
      className={classNames(
        className,
        "rounded-lg hover:shadow-xl overflow-hidden hover:text-secondary relative w-full max-w-md h-full"
      )}
    >
      <div className="flex flex-col bg-white h-full">
        <div style={styleImage}>
          {img ? (
            <Image
              src={img}
              alt=""
              style={{ objectFit: "cover" }}
              fill={true}
              sizes="(max-width: 768px) 100vw"
            />
          ) : (
            <ImageNotFound />
          )}
        </div>

        <div className="flex flex-col gap-3 justify-between px-8 py-8 h-full">
          <div>
            <h4 className="text-title-3 font-Poppins text-gray-900 text-lg font-bold mb-4 text-start">{title}</h4>
            <p className="text-justify text-paragraph-2 font-OpenSans text-text">{descripcionCorta}</p>
          </div>
          <Controls.ButtonComponent title="Ver Publicación" onClick={navigate} />
        </div>
      </div>
    </article>
  );
}
