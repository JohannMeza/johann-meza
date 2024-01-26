import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { SendRequestData } from "src/helpers/helpRequestBackend";
import { useForm } from "src/hooks/useForm";
import { useAlert } from "react-alert";
import { classNames } from "src/utils/ClassNames";
import { CardHorizontalComponent } from "src/components/card/FrontcardComponent";
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import frontStyles from "src/styles/Frontpage.module.css";
import useLoaderContext from "src/hooks/useLoaderContext";
import Controls from "src/components/Controls";
import debounce from 'lodash.debounce';
import Image from "next/image";
import ReactPaginate from "react-paginate";
import usePagination from 'src/hooks/usePagination';

export default function BlogPage({ listPublicaciones, listEtiquetas, listCategorias, listLastPublicaciones, dataPaginate }) {
  const { push, query, pathname } = useRouter();
  const pageSelected = query?.page - 1 || 0;
  const { handleChangePaginate, paginate } = usePagination(pageSelected, 3);
  
  const [data, handleInputChange] = useForm({ SEARCH: "" });
  const [publicaciones, setPublicaciones] = useState([]);
  const [etiquetasSelect, setEtiquetasSelect] = useState([])
  const { setLoader } = useLoaderContext();
  const alert = useAlert();
  const navigation = useRef(null);

  const getPublicaciones = async (listaEtiquetas = etiquetasSelect, pag = { ...paginate, page: pageSelected }) => {
    let checkListEtiquetas = listaEtiquetas.map(el => ({ [el]: true })).reduce((result, currentObject) => {
      const key = Object.keys(currentObject)[0];
      const value = currentObject[key];
      result[key] = value;
      return result;
    }, {});

    setLoader(true)
    await SendRequestData({
      queryId: 34,
      body: { ID_ETIQUETAS: Object.keys(checkListEtiquetas).join(','), SEARCH: data.SEARCH.trim() },
      pagination: pag,
      success: (resp) => {
        setPublicaciones(resp.dataList)
        handleChangePaginate(resp.dataObject)
        setLoader(false)
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };

  const searchPublicaciones = async () => {
    let checkListEtiquetas = etiquetasSelect.map(el => ({ [el]: true })).reduce((result, currentObject) => {
      const key = Object.keys(currentObject)[0];
      const value = currentObject[key];
      result[key] = value;
      return result;
    }, {});

    setLoader(true)

    SendRequestData({
      queryId: 34,
      body: { 
        ID_ETIQUETAS: Object.keys(checkListEtiquetas).join(','),
        SEARCH: data.SEARCH.trim()
      },
      pagination: { ...paginate, page: pageSelected },
      success: (resp) => {
        setLoader(false);
        handleChangePaginate(resp.dataObject)
        setPublicaciones(resp.dataList);
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };
  
  const handleClickEtiquetas = (idEtiquetas) => {
    setEtiquetasSelect(etiquetas => {
      const listaEtiquetas = (etiquetas.includes(idEtiquetas) ? etiquetas.filter(el => el !== idEtiquetas) : [...etiquetas, idEtiquetas]);
      getPublicaciones(listaEtiquetas)
      navigation.current.state.selected = 0;
      return listaEtiquetas;
    })
  }

  const debouncedSearchApi = debounce(() => {
    searchPublicaciones();
    push(pathname);
  }, 500);

  useEffect(() => {
    if (data.SEARCH.trim() !== '') debouncedSearchApi(data.SEARCH);
    else searchPublicaciones();
    return () => debouncedSearchApi.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.SEARCH]);

  useEffect(() => {
    setPublicaciones(listPublicaciones);
    handleChangePaginate(dataPaginate);
    (navigation) && (navigation.current.state.selected = pageSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPublicaciones, dataPaginate]);

  return (
    <BodyComponent>
      <div className={frontStyles.blogBanner}>
        <h1 className="text-title-2 lg:text-[62px] text-center text-white font-Poppins font-extrabold">
          Blog
        </h1>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-[75%1fr] w-[90%] gap-8 my-10">
          {
            <BlogContent
              listPublicaciones={publicaciones}
              // onAction={getPublicaciones}
              paginate={paginate}
              navigation={navigation}
            />
          }
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="w-full bg-primary p-2 rounded-md">
                  <span className="text-title-3 font-semibold text-white">Búsqueda</span>
                </div>
                <div className="h-1 w-full bg-primary rounded-md"></div>
              </div>
              <Controls.InputSearchComponent
                handleEnter={() => {
                  searchPublicaciones();
                }}
                type="text"
                onClickIcon={() => {
                  searchPublicaciones();
                }}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                placeholder="Buscar..."
                value={data}
                name="SEARCH"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="w-full bg-primary p-2 rounded-md">
                  <span className="text-title-3 font-semibold text-white">Etiquetas</span>
                </div>
                <div className="h-1 w-full bg-primary rounded-md"></div>
              </div>
              <div>
                <ul className="flex gap-3 flex-wrap">
                  {
                    listEtiquetas.map((el, index) => (
                      <li   
                        key={index} 
                        className={
                          classNames("text-span-1 py-1 px-2 transition-colors duration-500 cursor-pointer font-semibold rounded-sm border", 
                          etiquetasSelect.includes(el.ID_ETIQUETAS) ? "border-primary text-white bg-primary hover:text-white hover:bg-primary" : "border-primary text-primary bg-white hover:text-white hover:bg-primary")
                        }
                        onClick={() => handleClickEtiquetas(el.ID_ETIQUETAS)}
                      >
                        {el.ETIQUETA}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="w-full bg-primary p-2 rounded-md">
                  <span className="text-title-3 font-semibold text-white">Categorias</span>
                </div>
                <div className="h-1 w-full bg-primary rounded-md"></div>
              </div>
              <div>
                <ul className="flex gap-3 flex-wrap">
                  {
                    listCategorias.map((el, index) => (
                      <li   
                        key={index} 
                        className="text-span-1 py-1 px-2 transition-colors duration-500 cursor-pointer font-semibold rounded-sm border border-primary text-primary bg-white hover:text-white hover:bg-primary"
                        onClick={() => push(`/blog/categoria/${el.slug}`)}
                      >
                        {el.categoria}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="w-full bg-primary p-2 rounded-md">
                  <span className="text-title-3 font-semibold text-white">Publicaciones recientes</span>
                </div>
                <div className="h-1 w-full bg-primary rounded-md"></div>
              </div>
              <div className="flex flex-col gap-3">
                {
                  listLastPublicaciones.map((el, index) => (
                    <div onClick={() => push(`/blog/${el.slug}`)} className="flex gap-2 cursor-pointer" key={index}>
                      <Image
                        src={el.portada}
                        alt={el.titulo}
                        width={80}
                        height={50}
                        style={{ minWidth: 80, objectFit: "cover", borderRadius: "10px" }}
                      />
                      <p className="text-paragraph-2 font-bold">{el.titulo}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-white">
        <FooterComponent />
      </div>
    </BodyComponent>
  );
}

const BlogContent = ({ listPublicaciones, onAction, paginate, navigation }) => {
  const pageCount = Math.ceil(paginate.total_rows / paginate.limitRowsPage);
  const { push, query, pathname } = useRouter();
  // const pageSelected = query?.page || 1;
  
  const handleChangePagination = (event) => {
    const page = event.selected;
    // onAction(undefined, { ...paginate, page });    
    push(`${pathname}?page=${page + 1}`)
  }

  return (
    <div className="box-base w-full">
      <div>
        {
          listPublicaciones.length === 0 &&
          <div className="flex flex-col items-center justify-center h-2/3">
            <Image src="/assets/imagenes/withoutResults.png" width={300} height={300} alt="Sin resultados" />
            <h2 className="text-title-2 font-bold">Sin resultados</h2>
          </div>
        }

        {
          listPublicaciones.map((publicacion, index) => (
            <section key={index} className={frontStyles.blogPublicaciones}>
              <CardHorizontalComponent
                className="m-auto"
                title={publicacion.titulo}
                descripcionCorta={publicacion.descripcion_corta}
                img={publicacion.portada}
                key={index}
                slug={`/blog/${publicacion.slug}`}
              />
            </section>
          ))
        }
      </div>
      <div className="flex justify-center">
        <ReactPaginate
          ref={navigation}
          className="pagination-base"
          breakLabel="..."
          nextLabel="&#8702;"
          onPageChange={(event) => handleChangePagination(event)}
          pageRangeDisplayed={0}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          selectedPageRel={1}
          previousLabel="&#8701;"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  let listPublicaciones = [];
  let listCategorias = []
  let listEtiquetas = []
  let categoriaSelect = {};
  let listLastPublicaciones = {};
  let dataPaginate = {}

  const getCategoriasActivas = async () => {
    await SendRequestData({
      queryId: 67,
      success: (resp) => (listCategorias = resp.dataList || []),
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  }

  const getEtiquetas = async () => {
    await SendRequestData({
      queryId: 69,
      success: (resp) => listEtiquetas = resp.dataList,
      error: (err) => console.error(err),
    })
  }

  const getPublicaciones = async () => {
    await SendRequestData({
      queryId: 34,
      body: { ID_ETIQUETAS: '' },
      pagination: { page: query.page - 1 || 0, limitRowsPage: 3 },
      success: (resp) => {
        listPublicaciones = resp.dataList || []
        dataPaginate = resp.dataObject
      },
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
      success: (resp) => (listLastPublicaciones = resp.dataList || []),
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };

  try {
    await getPublicaciones();
    await getCategoriasActivas();
    await getEtiquetas();
    await getLastPublicaciones();
    return { props: { listLastPublicaciones, listPublicaciones, listEtiquetas, listCategorias, categoriaSelect, dataPaginate } };
  } catch (error) {
    let propError = {
      error: true,
      message: "Error en el servidor",
      detail: "Hubo un error al listar el blog",
      status: 500,
    };
    return { props: { listLastPublicaciones, listPublicaciones, listEtiquetas, listCategorias, categoriaSelect, error: propError, dataPaginate } };
  }
}

