import { useState } from "react";
import { useRouter } from "next/router";
import { SendRequestData } from "src/helpers/helpRequestBackend";
import FrontCardComponent from "src/components/card/FrontcardComponent";
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import frontStyles from "src/styles/Frontpage.module.css";

export default function BlogPage({ listCategorias, listLastCategorias }) {
  return (
    <BodyComponent>
      <BlogBanner listCategorias={listLastCategorias} />
      <BlogContent listCategorias={listCategorias} />
      <div className="border-white"><FooterComponent /></div>
    </BodyComponent>
  );
}

const BlogBanner = ({ listCategorias }) => {
  const [categorias] = useState(listCategorias);
  const { push } = useRouter();
  
  return (
    <div className={frontStyles.blogBanner}>
      <div>
        <h1 className="text-title-1 text-white font-Poppins font-semibold">
          Destacado de la semana
        </h1>
      </div>

      <section className="w-full grid gap-2 grid-cols-3 box-base absolute top-[70%]">
        {categorias.map((el, index) => (
          <FrontCardComponent
            key={index}
            className="m-auto"
            title={el.titulo}
            descripcionCorta={el.descripcion_corta}
            img={el.portada}
            navigate={() => push(`/blog/${el.slug}`)}
          />
        ))}
      </section>
    </div>
  )
}

const BlogContent = ({ listCategorias }) => {
  const [categorias] = useState(listCategorias)
  const { push, query } = useRouter();

  return (
    <div className="box-base mt-[420px]">
      {
        categorias.map((el, index) => (
          el.publicaciones.length > 0 &&
          <div className="mt-24" key={index}>
            <h1 className="font-Poppins text-title-2 font-semibold mb-6">{el.categoria}</h1>
            <section className={frontStyles.blogPublicaciones}>
              {el.publicaciones.map((publicacion, index) => (
                <FrontCardComponent
                  className="m-auto"
                  title={publicacion.titulo}
                  descripcionCorta={publicacion.descripcion_corta}
                  img={publicacion.portada}
                  key={index}
                  navigate={() => push(`/blog/${publicacion.slug}`)}
                />
              ))}
            </section>
          </div>
        ))
      }
    </div>
  );
}

export async function getServerSideProps({query}) {
  console.log(query)
  let listCategorias = [], listLastCategorias = [];
  const getPublicaciones = async () => {
    await SendRequestData({
      queryId: 34,
      body: {id_categorias: 1},
      success: (resp) => listCategorias = resp.dataList || [],
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };

  const getLastPublicaciones = async () => {
    await SendRequestData({
      queryId: 37,
      body: {id_categorias: 1},
      success: (resp) => listLastCategorias = resp.dataList || [],
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  }

  try {
    await getPublicaciones()
    await getLastPublicaciones()
    return { props: {listCategorias, listLastCategorias} }
  } catch (error) {
    let propError = { error: true, message: "Error en el servidor", detail: "Hubo un error al listar el blog", status: 500 }
    return { props: {listCategorias, listLastCategorias, error: propError} }
  }
}