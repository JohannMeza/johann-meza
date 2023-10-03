import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SendRequestData } from "src/helpers/helpRequestBackend";
import { useForm } from "src/hooks/useForm";
import { useAlert } from "react-alert";
import FrontCardComponent from "src/components/card/FrontcardComponent";
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import frontStyles from "src/styles/Frontpage.module.css";
import useLoaderContext from "src/hooks/useLoaderContext";
import Controls from "src/components/Controls";
import debounce from 'lodash.debounce';

export default function BlogPage({ listCategorias }) {
  const [data, handleInputChange] = useForm({ SEARCH: "" });
  const [isSearch, setIsSearch] = useState(false);
  const [listSearch, setListSearch] = useState([]);
  const { setLoader } = useLoaderContext();
  const alert = useAlert();

  const searchPublicaciones = async () => {
    setLoader(true);
    SendRequestData({
      queryId: 44,
      body: { SEARCH: data.SEARCH.trim() },
      success: (resp) => {
        setLoader(false);
        setListSearch(resp.dataList);
        resp.dataList.length === 0 && !data.SEARCH
          ? setIsSearch(false)
          : setIsSearch(true);
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };

  const debouncedSearchApi = debounce(searchPublicaciones, 500);

  useEffect(() => {
    if (data.SEARCH.trim() !== '') {
      debouncedSearchApi(data.SEARCH);
    } else {
      setListSearch([]);
      setIsSearch(false);
    }
    return () => debouncedSearchApi.cancel();
  }, [data.SEARCH]);

  return (
    <BodyComponent>
      <BlogBanner
        list={listSearch}
        data={data}
        handleInputChange={handleInputChange}
        searchPublicaciones={searchPublicaciones}
      />
      <BlogContent
        listCategorias={listCategorias}
        listSearch={listSearch}
        isSearch={isSearch}
      />
      <div className="border-white">
        <FooterComponent />
      </div>
    </BodyComponent>
  );
}

const BlogBanner = ({ data, handleInputChange, searchPublicaciones }) => {
  return (
    <div className={frontStyles.blogBanner}>
      <div>
        <h1 className="text-title-2 lg:text-title-1 text-center text-white font-Poppins font-semibold">
          Destacado de la semana
        </h1>
      </div>

      <div className="lg:w-1/3 mt-3">
        <Controls.InputSearchComponent
          handleEnter={searchPublicaciones}
          type="text"
          onClickIcon={searchPublicaciones}
          onChange={handleInputChange}
          placeholder="Buscar..."
          value={data}
          name="SEARCH"
        />
      </div>
    </div>
  );
};

const BlogContent = ({ listCategorias, listSearch, isSearch }) => {
  const [categorias] = useState(listCategorias);
  const { push, query } = useRouter();

  return (
    <div className="box-base">
      <div className="my-10">
        {listSearch.length === 0 && isSearch && (
          <div className="flex justify-center items-center h-[150px]">
            <span className="flex items-center font-bold text-paragraph-1">
              Sin Resultados 😲
            </span>
          </div>
        )}

        {isSearch ? (
          <section className={frontStyles.blogPublicaciones}>
            {listSearch.map((publicacion, index) => (
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
        ) : (
          categorias.map(
            (el, index) =>
              el.publicaciones.length > 0 && (
                <div className="mt-10" key={index}>
                  <h1 className="font-Poppins text-title-2 font-semibold mb-6">
                    {el.categoria}
                  </h1>
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
              )
          )
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  let listCategorias = [];
  const getPublicaciones = async () => {
    await SendRequestData({
      queryId: 34,
      body: { id_categorias: 1 },
      success: (resp) => (listCategorias = resp.dataList || []),
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };

  const getLastPublicaciones = async () => {
    await SendRequestData({
      queryId: 37,
      body: { id_categorias: 1 },
      success: (resp) => (listLastCategorias = resp.dataList || []),
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };

  try {
    await getPublicaciones();
    // await getLastPublicaciones();
    return { props: { listCategorias } };
  } catch (error) {
    let propError = {
      error: true,
      message: "Error en el servidor",
      detail: "Hubo un error al listar el blog",
      status: 500,
    };
    return { props: { listCategorias, error: propError } };
  }
}
