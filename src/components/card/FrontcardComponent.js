import { classNames } from "../../utils/ClassNames";
import Image from "next/image";
import Icon from "../icon/Icon";
import DateUtil from 'src/utils/DateUtil';
import { useRouter } from "next/router";
import Link from "next/link";

export const CardHorizontalComponent = ({
  fechaCreacion = "Sin Fecha",
  descripcionCorta = "",
  cantComments = 0,
  className = "",
  slug = "",
  img = "/",
  title,
}) => {
  const { push } = useRouter();
  const styleImage = {
    width: "100%",
    minHeight: "420px",
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
        "rounded-lg overflow-hidden relative w-full h-full"
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

        <div className="flex flex-col items-start gap-1 py-8 px-4 h-full">
          <h4 onClick={() => push(slug)} className="cursor-pointer text-title-3 font-Poppins text-gray-900 text-lg font-bold text-start">{title}</h4>
          <Link href={`${slug}#comments`} className="text-span-1 cursor-pointer">{DateUtil().FormatDate(fechaCreacion)} / {cantComments} comentarios</Link>
          <p className="text-justify text-paragraph-2 font-OpenSans text-text">{descripcionCorta}</p>
          <span onClick={() => push(slug)} className="cursor-pointer font-bold text-secondary">Leer más</span>
        </div>
      </div>
    </article>
  );
}

export const CardVerticalComponent = ({
  fechaCreacion = "Sin Fecha",
  descripcionCorta = "",
  cantComments = 0,
  className = "",
  slug = "",
  img = "/",
  title,
}) => {
  const { push } = useRouter();
  const styleImage = {
    width: "100%",
    minHeight: "200px",
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
        "rounded-lg overflow-hidden relative w-full h-full"
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

        <div className="flex flex-col items-start gap-1 py-8 px-4 h-full">
          <h4 onClick={() => push(slug)} className="cursor-pointer text-title-3 font-Poppins text-gray-900 text-lg font-bold text-start">{title}</h4>
          <Link href={`${slug}#comments`} className="text-span-1 cursor-pointer">{DateUtil().FormatDate(fechaCreacion)} / {cantComments} comentarios</Link>
          <p className="text-justify text-paragraph-2 font-OpenSans text-text">{descripcionCorta}</p>
          <span onClick={() => push(slug)} className="cursor-pointer font-bold text-secondary">Leer más</span>
        </div>
      </div>
    </article>
  );
}