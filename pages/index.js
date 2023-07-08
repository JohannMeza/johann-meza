import { useFormValidation } from "src/hooks/useFormValidation";
import { useState } from "react";
import { useRouter } from "next/router";
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import Controls from "src/components/Controls";
import Icon from "src/components/icon/Icon.js";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Blog", href: "/blog", current: false },
  { name: "Sobre mí", href: "/about", current: false },
  { name: "Calendar", href: "#", current: false },
];

export default function Home() {
  const {data,  handleInputFormChange, errors} = useFormValidation();
  const [isTop, setIsTop] = useState(true);
  const {push} = useRouter()
  return (
    <BodyComponent>
      <div className="w-full bg-banner bg-cover bg-no-repeat">
        <div className="flex items-center justify-start min-h-screen bg-fixed box-base">
          <div className="flex items-start flex-col w-1/2">
            <h1 className="title-banner font-Poppins text-yellow-500">
              Hola!!!
            </h1>
            <hr className="w-full border-yellow-500 border-y-2 mt-4 mb-6" />
            <p className="text-white text-paragraph-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
              voluptatem unde nemo ea consectetur sapiente facilis iusto
              deleniti quam nostrum beatae, repellendus a assumenda magnam
              quibusdam aliquid accusamus possimus totam?
            </p>
            <button className="button-base color-secondary mt-4">
              CONTACTAME
            </button>
          </div>
        </div>
      </div>
      <div className="min-w-screen my-24 bg-gray-200 flex items-center justify-center box-base">
        <div className="w-full max-w-3xl">
          <div className="-mx-2 md:flex">
            <div className="w-full md:w-1/3 px-2">
              <div className="rounded-lg shadow-sm mb-4">
                <div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
                  <div className="px-3 pt-8 pb-10 text-center relative z-10">
                    <span className="font-Poppins text-secondary font-semibold text-title-1 my-3">
                      10 +
                    </span>
                    <p className="font-Poppins text-secondary font-semibold text-span-1">
                      PROYECTOS COMPLETADOS
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-2">
              <div className="rounded-lg shadow-sm mb-4">
                <div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
                  <div className="px-3 pt-8 pb-10 text-center relative z-10">
                    <span className="font-Poppins text-secondary font-semibold text-title-1 my-3">
                      7 +
                    </span>
                    <p className="font-Poppins text-secondary font-semibold text-span-1">
                      CLIENTES SATISFECHOS
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-2">
              <div className="rounded-lg shadow-sm mb-4">
                <div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
                  <div className="px-3 pt-8 pb-10 text-center relative z-10">
                    <span className="font-Poppins text-secondary font-semibold text-title-1 my-3">
                      3 +
                    </span>
                    <p className="font-Poppins text-secondary font-semibold text-span-1">
                      AÑOS DE EXPERIENCIA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box-base">
        <section className="text-gray-600 body-font">
          <div className="container">
            <div className="flex flex-col items-center">
              <h2 className="text-center text-title-3 font-Poppins font-semibold text-secondary">
                Valores
              </h2>
              <h3 className="text-center text-title-2 font-Poppins font-semibold text-primary">
                Mis valores diferenciales
              </h3>
              <p className="text-center w-2/4 font-OpenSans font-normal text-paragraph-1">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod
                facilis et laborum provident quas explicabo aperiam omnis sequi
                voluptate ut iusto, quia distinctio dolorum natus perferendis
                odit aliquid minima enim.
              </p>
            </div>

            <br />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center">
              <div className="hover:shadow-xl hover:z-10 relative border-solid border border-[#D7D7D7] px-4 py-10">
                <div className="flex flex-col items-center  justify-between  rounded-lg bg-white">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h4 className="text-title-3 font-Poppins text-primary text-gray-900 text-lg font-bold mt-6">
                    Total Ballance 1
                  </h4>
                  <p className="font-OpenSans text-paragraph-2 font-normal text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi explicabo veniam voluptates, necessitatibus facilis
                    laboriosam suscipit{" "}
                  </p>
                </div>
              </div>
              <div className="hover:shadow-xl hover:z-10 relative border-solid border border-[#D7D7D7] px-4 py-10">
                <div className="flex flex-col items-center justify-between rounded-lg bg-white">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h4 className="text-title-3 font-Poppins text-primary text-gray-900 text-lg font-bold mt-6">
                    Total Ballance
                  </h4>
                  <p className="font-OpenSans text-paragraph-2 font-normal text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi explicabo veniam voluptates, necessitatibus facilis
                    laboriosam suscipit{" "}
                  </p>
                </div>
              </div>
              <div className="hover:shadow-xl hover:z-10 relative border-solid border border-[#D7D7D7] px-4 py-10">
                <div className="flex flex-col items-center justify-between rounded-lg bg-white">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h4 className="text-title-3 font-Poppins text-primary text-gray-900 text-lg font-bold mt-6">
                    Total Ballance
                  </h4>
                  <p className="font-OpenSans text-paragraph-2 font-normal text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi explicabo veniam voluptates, necessitatibus facilis
                    laboriosam suscipit{" "}
                  </p>
                </div>
              </div>
              <div className="hover:shadow-xl hover:z-10 relative border-solid border border-[#D7D7D7] px-4 py-10">
                <div className="flex flex-col items-center justify-between rounded-lg bg-white">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h4 className="text-title-3 font-Poppins text-primary text-gray-900 text-lg font-bold mt-6">
                    Total Ballance
                  </h4>
                  <p className="font-OpenSans text-paragraph-2 font-normal text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi explicabo veniam voluptates, necessitatibus facilis
                    laboriosam suscipit{" "}
                  </p>
                </div>
              </div>
              <div className="hover:shadow-xl hover:z-10 relative border-solid border border-[#D7D7D7] px-4 py-10">
                <div className="flex flex-col items-center justify-between rounded-lg bg-white">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h4 className="text-title-3 font-Poppins text-primary text-gray-900 text-lg font-bold mt-6">
                    Total Ballance
                  </h4>
                  <p className="font-OpenSans text-paragraph-2 font-normal text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi explicabo veniam voluptates, necessitatibus facilis
                    laboriosam suscipit{" "}
                  </p>
                </div>
              </div>
              <div className="hover:shadow-xl hover:z-10 relative border-solid border border-[#D7D7D7] px-4 py-10">
                <div className="flex flex-col items-center justify-between rounded-lg bg-white">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h4 className="text-title-3 font-Poppins text-primary text-gray-900 text-lg font-bold mt-6">
                    Total Ballance
                  </h4>
                  <p className="font-OpenSans text-paragraph-2 font-normal text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Modi explicabo veniam voluptates, necessitatibus facilis
                    laboriosam suscipit{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="box-base flex justify-center">
        <div
          className="flex items-stretch relative bg-banner-tech bg-no-repeat p-12"
          style={{ width: "85%", height: "450px", backgroundSize: "contain" }}
        >
          <div className="flex justify-center flex-col items-start w-1/2">
            <h2 className="title-banner text-white font-Poppins text-[60px]">
              Node JS
            </h2>
            <p className="text-white font-OpenSans text-paragraph-2 font-normal mt-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
              quae porro commodi suscipit!
            </p>
          </div>
          <div className="flex justify-center items-center w-1/2">
            <div
              className="absolute right-0 rounded-full border-[25px] border-[transparent]"
              style={{ boxShadow: "0 0 0px 1.5px white" }}
            >
              <div
                className="flex justify-center items-center bg-[#8AC400] w-[350px] h-[350px]"
                style={{
                  clipPath:
                    "polygon(50% 0, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
                }}
              >
                <Image
                  src="/assets/imagenes/logo.png"
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box-base">
        <section className="text-gray-600 body-font">
          <div className="container">
            <div className="flex flex-col items-center">
              <h2 className="text-center text-title-3 font-Poppins font-semibold text-secondary">
                Valores
              </h2>
              <h3 className="text-center text-title-2 font-Poppins font-semibold text-primary">
                Mis valores diferenciales
              </h3>
              <p className="text-center w-2/4 font-OpenSans font-normal text-paragraph-1">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod
                facilis et laborum provident quas explicabo aperiam omnis sequi
                voluptate ut iusto, quia distinctio dolorum natus perferendis
                odit aliquid minima enim.
              </p>
            </div>

            <br />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center gap-8 h-[450px]">
              <div className="hover:shadow-xl hover:text-secondary hover:z-10 relative border-solid border border-[#D7D7D7]">
                <div className="flex flex-col rounded-lg bg-white h-full">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <div className="flex flex-col justify-between px-8 h-full">
                    <h4 className="text-title-3 font-Poppins text-gray-900 text-lg font-bold mt-6 text-start">
                      Total Ballance 1
                    </h4>
                    <div className="flex items-center justify-between">
                      <a
                        href="#"
                        className="text-button-1 uppercase font-Poppins font-semibold text-start text-text"
                      >
                        READ MORE
                      </a>
                      <Icon.ArrowRight className="icon-principal text-text" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hover:shadow-xl hover:z-10 relative border-solid border border-[#D7D7D7]">
                <div className="flex flex-col hover:text-secondary rounded-lg bg-white h-full">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <div className="flex flex-col justify-between px-8 h-full">
                    <h4 className="text-title-3 font-Poppins text-gray-900 text-lg font-bold mt-6 text-start">
                      Total Ballance 1
                    </h4>
                    <div className="flex items-center justify-between">
                      <a
                        href="#"
                        className="text-button-1 uppercase font-Poppins font-semibold text-start text-text"
                      >
                        READ MORE
                      </a>
                      <Icon.ArrowRight className="icon-principal text-text" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hover:shadow-xl hover:z-10 relative border-solid border border-[#D7D7D7]">
                <div className="flex flex-col hover:text-secondary rounded-lg bg-white h-full">
                  <Image
                    src="/assets/imagenes/logo.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <div className="flex flex-col justify-between px-8 h-full">
                    <h4 className="text-title-3 font-Poppins text-gray-900 text-lg font-bold mt-6 text-start">
                      Total Ballance 1
                    </h4>
                    <div className="flex items-center justify-between">
                      <a
                        href="#"
                        className="text-button-1 uppercase text-text font-Poppins font-semibold text-start"
                      >
                        READ MORE
                      </a>
                      <Icon.ArrowRight className="icon-principal text-text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="box-base">
        <section className="text-gray-600 body-font">
          <div className="container">
            <div className="flex flex-col items-center">
              <h2 className="text-center text-title-3 font-Poppins font-semibold text-secondary">
                Valores
              </h2>
              <h3 className="text-center text-title-2 font-Poppins font-semibold text-primary">
                Mis valores diferenciales
              </h3>
              <p className="text-center w-2/4 font-OpenSans font-normal text-paragraph-1">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod
                facilis et laborum provident quas explicabo aperiam omnis sequi
                voluptate ut iusto, quia distinctio dolorum natus perferendis
                odit aliquid minima enim.
              </p>
            </div>

            <br />

            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col gap-3 w-2/4">
                <Controls.InputComponent
                  label="Nombre"
                  value={data.NOMBRE}
                  placeholder="Ingresa tu nombre"
                  onChange={handleInputFormChange}
                  name="NOMBRE"
                  error={errors.NOMBRE}
                />
                <Controls.InputComponent
                  label="Email"
                  name="EMAIL"
                  value={data.EMAIL}
                  onChange={handleInputFormChange}
                  placeholder="Ingresa tu correo tu electrónico"
                  error={errors.EMAIL}
                />
                <Controls.InputComponent
                  label="Mensaje"
                  name="MENSAJE"
                  value={data.MENSAJE}
                  onChange={handleInputFormChange}
                  placeholder="Ingresa tu mensaje"
                  error={errors.MENSAJE}
                  textarea
                />
                <Controls.ButtonComponent title="ENVIAR" className="w-full" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <FooterComponent />
    </BodyComponent>
  );
}
