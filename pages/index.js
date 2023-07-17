import { useFormValidation } from "src/hooks/useFormValidation";
import { useState } from "react";
import { useRouter } from "next/router";
import { classNames } from "src/utils/ClassNames";
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import frontStyles from "src/styles/Frontpage.module.css";
import Controls from "src/components/Controls";
import IconAwesome from 'src/components/icon/IconAwesome'
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [technology, setTechnology] = useState('BackEnd')
  const handleChangeTech = (tech) => setTechnology(tech)
  
  return (
    <BodyComponent>
      <div className={frontStyles.mainContent}>
        <div className="w-full bg-banner-opacity bg-cover bg-no-repeat border-[2px] border-white" style={{backgroundAttachment: "fixed"}}>
          <div className="flex items-center justify-center min-h-screen bg-fixed box-base">
            <div className="flex items-center flex-col gap-5 lg:w-1/2">
              <Image priority alt="Johann Meza" className="rounded-full border-[2px] border-white w-[150px] h-[150px] object-cover object-top" src="/assets/imagenes/me.png" width={130} height={60} />
              <h1 className="text-title-2 font-Poppins font-semibold text-white">Hola, soy Johann</h1>
              <p className="text-paragraph-1 font-Poppins text-white text-center">Soy un desarrollador Fullstack entusiasta por la creación de soluciones web innovadoras y funcionales. ¡Creando soluciones web que marcan la diferencia!</p>
              <span className="flex gap-5 text-button-1">
                <Link href="https://www.linkedin.com/in/johann-meza-salazar-33b5701b6/" passHref target="_blank">
                  <Controls.ButtonIconComponent icon={IconAwesome.LINKEDIN} />
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-screen flex items-center justify-start bg-gradient-blue-400 border-[2px] border-white relative overflow-hidden">
          <Image src="/assets/svg/background-icon.svg" width={500} height={500} property alt="Icono" className="absolute -right-[5%] -bottom-[40%]" />
          <div className="w-full flex items-center lg:px-12 relative z-10">
            <div className="md:flex flex-wrap flex-grow justify-center shrink-0">
              <div className="md:w-1/2 p-6">
                <div className="rounded-lg shadow-sm border-2 border-white hover:border-secondary hover:text-secondary">
                  <div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
                    <div className="px-3 pt-8 pb-10 text-center relative z-10">
                      <span className="font-Poppins text-inherit font-semibold text-title-1 my-3">
                        10 +
                      </span>
                      <p className="font-Poppins text-inherit font-semibold text-span-1">
                        PROYECTOS COMPLETADOS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="rounded-lg shadow-sm border-2 border-white hover:border-secondary hover:text-secondary">
                  <div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
                    <div className="px-3 pt-8 pb-10 text-center relative z-10">
                      <span className="font-Poppins text-inherit font-semibold text-title-1 my-3">
                        7 +
                      </span>
                      <p className="font-Poppins text-inherit font-semibold text-span-1">
                        CLIENTES SATISFECHOS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="rounded-lg shadow-sm border-2 border-white hover:border-secondary hover:text-secondary">
                  <div className="rounded-lg bg-white shadow-lg md:shadow-xl relative overflow-hidden">
                    <div className="px-3 pt-8 pb-10 text-center relative z-10">
                      <span className="font-Poppins text-inherit font-semibold text-title-1 my-3">
                        3 +
                      </span>
                      <p className="font-Poppins text-inherit font-semibold text-span-1">
                        AÑOS DE EXPERIENCIA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-full hide lg:flex lg:justify-center ">
              <Image width="1000" height="1000" alt="Projects" src="/assets/imagenes/projects.png" className="w-3/4 min-w-[450px] max-w-[750px]" />
            </div>
          </div>
        </div>

        <div className="min-w-screen flex items-center justify-start bg-primary border-[2px] border-white relative overflow-hidden">
          <Image src="/assets/svg/background-icon.svg" width={500} height={500} property alt="Icono" className="absolute -right-[5%] -bottom-[40%]" />
          <div className="flex gap-5 items-center w-full h-2/3 px-12 relative z-10 flex-col lg:flex-row">
            <section className="flex flex-col gap-8 lg:gap-3 text-center lg:text-start">
              <h2 className="text-title-2 font-Poppins font-semibold text-white">Tecnologias en las que he trabajado</h2>
              <div className="flex flex-wrap gap-3 items-end justify-center lg:justify-start">
                <span className={classNames(technology === "BackEnd" && "text-title-3 font-bold", "text-paragraph-3 font-Poppins text-white")} onClick={() => handleChangeTech('BackEnd')}>BackEnd</span>
                <span className={classNames(technology === "FrontEnd" && "text-title-3 font-bold", "text-paragraph-3 font-Poppins text-white")} onClick={() => handleChangeTech('FrontEnd')}>FrontEnd</span>
                <span className={classNames(technology === "Servidores" && "text-title-3 font-bold", "text-paragraph-3 font-Poppins text-white")} onClick={() => handleChangeTech('Servidores')}>Servidores</span>
                <span className={classNames(technology === "Base de Datos" && "text-title-3 font-bold", "text-paragraph-3 font-Poppins text-white")} onClick={() => handleChangeTech('Base de Datos')}>Base de Datos</span>
                <span className={classNames(technology === "Diseño Gráfico" && "text-title-3 font-bold", "text-paragraph-3 font-Poppins text-white")} onClick={() => handleChangeTech('Diseño Gráfico')}>Diseño Gráfico</span>
                <span className={classNames(technology === "Otros" && "text-title-3 font-bold", "text-paragraph-3 font-Poppins text-white")} onClick={() => handleChangeTech('Otros')}>Otros</span>
              </div>

              {/* BACKEND */}
              {
                technology === "BackEnd" &&
                <div className={frontStyles.techContentImg}>
                  <Image src='/assets/tech/nodejs.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/laravel.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/php.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/net.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/typescript.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/nextjs.png' width={100} height={100} alt="tech" property />
                </div>
              }

              {/* FRONTEND */}
              {
                technology === "FrontEnd" &&
                <div className={frontStyles.techContentImg}>
                  <Image src='/assets/tech/html5.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/css.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/javascript.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/reactjs.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/mui.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/vuejs.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/tailwind.png' width={100} height={100} alt="tech" property />
                </div>
              }
              
              {/* SERVIDORES */}
              {
                technology === "Servidores" &&
                <div className={frontStyles.techContentImg}>
                  <Image src='/assets/tech/xampp.png' width={100} height={100} alt="tech" property />
                </div>
              }
              
              {/* BASE DE DATOS */}
              {
                technology === "Base de Datos" &&
                <div className={frontStyles.techContentImg}>
                  <Image src='/assets/tech/mongodb.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/sql.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/mysql.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/postgresql.png' width={100} height={100} alt="tech" property />
                </div>
              }

              {/* DISEÑO GRAFICO */}
              {
                technology === "Diseño Gráfico" &&
                <div className={frontStyles.techContentImg}>
                  <Image src='/assets/tech/figma.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/adobe-photoshop.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/adobe-illustrator.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/adobe-xd.png' width={100} height={100} alt="tech" property />
                  <Image src='/assets/tech/corel-draw.png' width={100} height={100} alt="tech" property />
                </div>
              }

              {/* OTROS */}
              {
                technology === "Otros" &&
                <div className={frontStyles.techContentImg}>
                  <Image src='/assets/tech/wordpress.png' width={100} height={100} alt="tech" property />
                </div>
              }
            </section>
            <div className="w-full h-full hide lg:flex lg:justify-end">
              <Image width="1000" height="1000" alt="Projects" src="/assets/imagenes/tech.png" className="w-5/6" />
            </div>
          </div>
        </div>

        <div className="border-[2px] border-white"><FooterComponent fullScreen={true} /></div>
      </div>
    </BodyComponent>
  );
}
