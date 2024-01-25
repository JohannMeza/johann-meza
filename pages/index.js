import { useState } from "react";
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import FrontCardComponent from "src/components/card/FrontcardComponent";
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import frontStyles from "src/styles/Frontpage.module.css";
import Controls from "src/components/Controls";
import IconAwesome from 'src/components/icon/IconAwesome'
import Image from "next/image";
import Link from "next/link";
import { classNames } from "../src/utils/ClassNames";

const ServicesInformation = [
  {
    title: "Desarrollo de aplicaciones web",
    description: "Desarrollo de aplicaciones web a medida, adaptadas a las necesidades específicas de mis clientes.",
    image: "/assets/iconos/developer.png",
    bonnus: ["Calidad", "Personalización", "Seguridad", "Escalabilidad"],
    alt: "tech"
  },
  {
    title: "Sitios web personalizados",
    description: "Desarrollo sitios web de presentación y blogs hasta soluciones de comercio electrónico completas.",
    image: "/assets/iconos/web-sites.png",
    bonnus: ["Funcionalidad", "Adaptabilidad", "Confianza", "Profesionalismo"],
    alt: "tech"
  },
  {
    title: "Mantenimiento y actualización de sitios web",
    description: "Mantenimiento y actualización de sitios web que permiten a mis clientes mantener sus presencias en línea de manera efectiva y actualizada.",
    image: "/assets/iconos/diseno-ux.png",
    bonnus: ["Seguridad", "Funcionalidad", "Confianza", "Mejora continua"],
    alt: "tech"
  },
]

export default function Home() {
  const [technology, setTechnology] = useState('BackEnd')
  const handleChangeTech = (tech) => setTechnology(tech)
  
  return (
    <BodyComponent>
      <div className={frontStyles.mainContent}>
        <div className="w-full bg-banner-opacity bg-cover bg-no-repeat" style={{backgroundAttachment: "fixed"}}>
          <div className="flex items-center justify-center min-h-screen bg-fixed box-base">
            <div className="flex items-center flex-col gap-5 lg:w-1/2">
              <Image priority alt="Johann Meza" className="rounded-full border-[2px] border-white w-[150px] h-[150px] object-cover object-top" src="/assets/imagenes/me.png" width={130} height={60} />
              <h1 className="text-title-2 font-Poppins font-semibold text-white">Hola, soy Johann</h1>
              <p className="text-paragraph-1 font-Poppins text-white text-center">Soy desarrollador Fullstack entusiasta por la creación de soluciones web innovadoras y funcionales. ¡Creando soluciones web que marcan la diferencia!</p>
              <span className="flex gap-5 text-button-1">
                <Link href="https://www.linkedin.com/in/johann-meza-salazar-33b5701b6/" passHref target="_blank">
                  <Controls.ButtonIconComponent icon={IconAwesome.LINKEDIN} />
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center my-16">
          <h2 className="text-title-2 text-center font-Poppins font-semibold py-8">Mis Servicios</h2>
          <div className="w-4/5 grid grid-cols-3 gap-8 mt-3">
            {
              ServicesInformation.map(({ title, description, alt, image, bonnus }, index) => (
                <CardServicesComponent 
                  key={index}
                  title={title}
                  description={description}
                  bonnus={bonnus}
                  image={image}
                  alt={alt}
                />
              ))
            }
          </div>
        </div>

        <div className="flex flex-col items-center w-full my-16">
          <h2 className="text-title-2 font-Poppins font-semibold text-center py-8">Tecnologias</h2>
  
          <div className="grid grid-cols-2 flex-wrap gap-4 mt-3">
            <div className="flex flex-col boxshadow-card items-center gap-5 boxborder-base p-8">
              <h3 className="text-title-3 font-Poppins font-semibold">Front-End</h3>
              <div className={frontStyles.techContentImg}>
                <Image src='/assets/tech/nodejs.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/laravel.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/php.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/net.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/typescript.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/nextjs.png' width={100} height={100} alt="tech" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-5 boxborder-base p-8">
              <h3 className="text-title-3 font-Poppins font-semibold">Back-End</h3>
              <div className={frontStyles.techContentImg}>
                <Image src='/assets/tech/html5.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/css.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/javascript.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/reactjs.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/mui.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/vuejs.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/tailwind.png' width={100} height={100} alt="tech" />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-5 boxborder-base p-8">
              <h3 className="text-title-3 font-Poppins font-semibold">Servidores</h3>
              <div className={frontStyles.techContentImg}>
                <Image src='/assets/tech/xampp.png' width={100} height={100} alt="tech" />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-5 boxborder-base p-8">
              <h3 className="text-title-3 font-Poppins font-semibold">Base de Datos</h3>
              <div className={frontStyles.techContentImg}>
                <Image src='/assets/tech/mongodb.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/sql.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/mysql.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/postgresql.png' width={100} height={100} alt="tech" />
              </div>
            </div>

            <div className="w-full col-span-2 flex flex-col items-center gap-5 boxborder-base p-8">
              <h3 className="text-title-3 font-Poppins font-semibold">Diseño Gráfico</h3>
              <div className={frontStyles.techContentImg}>
                <Image src='/assets/tech/figma.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/adobe-photoshop.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/adobe-illustrator.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/adobe-xd.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/corel-draw.png' width={100} height={100} alt="tech" />
                <Image src='/assets/tech/wordpress.png' width={100} height={100} alt="tech" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center my-16">
          <h2 className="text-title-2 font-Poppins font-semibold text-center py-8">Proyectos en el que he trabajado</h2>
          
          <div className="grid grid-cols-3 w-4/5 gap-8 mt-3">
            {/* PROYECTOS */}
            <FrontCardComponent
              className="m-auto"
              title={"Titulo"}
              descripcionCorta={"Descripcion"}
              img={""}
            />
            <FrontCardComponent
              className="m-auto"
              title={"Titulo"}
              descripcionCorta={"Descripcion"}
              img={""}
            />
            <FrontCardComponent
              className="m-auto"
              title={"Titulo"}
              descripcionCorta={"Descripcion"}
              img={""}
            />
          </div>
        </div>

        <div className="flex flex-col items-center my-16">
          <h2 className="text-title-2 font-Poppins font-semibold text-center py-8">Quizas te pueda interesar</h2>
          
          <div className="grid grid-cols-2 w-4/5 gap-8 bg-gradient rounded-lg px-8 py-16 mt-3">
            <FrontCardComponent
              className="m-auto w-2/3"
              title={"Titulo"}
              descripcionCorta={"Descripcion"}
              img={""}
            />
            <FrontCardComponent
              className="m-auto w-2/3"
              title={"Titulo"}
              descripcionCorta={"Descripcion"}
              img={""}
            />
          </div>
        </div>
        
        <div>
          <FooterComponent />
        </div>
      </div>
    </BodyComponent>
  );
}

const CardServicesComponent = ({ title, description, alt, bonnus, image }) => {
  return (
    <div className={classNames("p-8 boxshadow-base boxshadow-hover flex flex-col items-center gap-4", frontStyles.mainContentServicesCard)}>
      <Image src={image} width={100} height={100} alt={alt} />
      <div>
        <h3 className="text-title-3 text-primary font-semibold">{title}</h3>
        <p className="text-paragraph-2 text-text my-2">{description}</p>
        <div className="flex flex-col gap-4 mt-8">
          <h3 className="text-title-3 text-primary font-semibold">¿Que obtendrás?</h3>
          <ul className="flex gap-3 flex-wrap">
            {
              bonnus.map((el, index) => (
                <li key={index} className="text-span-1 py-1 px-2 font-semibold rounded-sm text-white bg-gradient-blue-400">{el}</li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}