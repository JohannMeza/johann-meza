import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { SendRequestData, SaveRequestData } from "src/helpers/helpRequestBackend";
import { useForm } from "src/hooks/useForm";
import { useAlert } from "react-alert";
import { classNames } from "src/utils/ClassNames";
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import useAuthContext from "src/hooks/useAuthContext";
import useLoaderContext from "src/hooks/useLoaderContext";
import Controls from "src/components/Controls";
import debounce from 'lodash.debounce';
import Image from "next/image";
import IconAwesome from 'src/components/icon/IconAwesome'
import frontStyles from "src/styles/Frontpage.module.css";
import usePagination from 'src/hooks/usePagination';
import ReactPaginate from "react-paginate";

export default function ProyectosPage({ arrListTecnologias, listEstadosProyecto }) {
  const { handleChangePaginate, paginate } = usePagination(0, 3);
  const pageCount = Math.ceil(paginate.total_rows / paginate.limitRowsPage);

  const [data, handleInputChange] = useForm({ SEARCH_TECH: "",  SEARCH: "", TIPO_PROYECTO: '0' });
  const [listTecnologias, setListTecnologias] = useState(arrListTecnologias);
  const [listProyectos, setListProyectos] = useState([]);
  const [checkTecnologias, handleCheckboxChange] = useForm({ });
  const [isSearch, setIsSearch] = useState(false);
  const { setLoader } = useLoaderContext();
  const {isAuthenticated} = useAuthContext();
  const { push } = useRouter();
  const alert = useAlert();
  const navigation = useRef(null);

  const searchProyectos = (pagination = paginate) => {
    const options = {
      queryId: 61,
      body: { 
        PROYECTO: data.SEARCH, 
        ID_ESTADO_PROYECTO: data.TIPO_PROYECTO, 
        ID_TECNOLOGIAS: Object.keys(checkTecnologias).join(','), 
        ID_ESTADO: 4 
      },
      pagination,
      success: (resp) => {
        setLoader(false);
        setListProyectos(resp.dataList)
        setIsSearch(true)
        handleChangePaginate(resp.dataObject)
        navigation.current.state.selected = pagination.page;
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    }

    setLoader(true);
    isAuthenticated ? SaveRequestData(options) : SendRequestData(options);
  };

  const handleSearchTech = (textSearch) => setListTecnologias((listTech) => textSearch ? listTech.filter(el => el.label.match(new RegExp(textSearch, 'ig'))) : arrListTecnologias)

  const debouncedSearchApi = debounce(() => searchProyectos(), 500);

  const handleChangePagination = (event) => {
    handleChangePaginate({ ...paginate, page: event.selected });
    searchProyectos({ ...paginate, page: event.selected });
  }

  useEffect(() => {
    if (data.SEARCH.trim() !== '') {
      debouncedSearchApi(data.SEARCH);
    } else {
      searchProyectos();
      setIsSearch(false);
    }
    return () => debouncedSearchApi.cancel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.SEARCH]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => searchProyectos(), [data.TIPO_PROYECTO, checkTecnologias])

  return (
    <BodyComponent>      
      <div className={frontStyles.blogBanner}>
        <h1 className="text-title-2 lg:text-[62px] text-center text-white font-Poppins font-extrabold">
          Proyectos
        </h1>
      </div>
      <div className="flex justify-center" id="first-post">
        <div className="grid grid-cols-[25%1fr] w-[90%] gap-8 my-10">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-primary p-2 rounded-md">
                    <span className="text-title-3 font-semibold text-white">Búsquedas</span>
                  </div>
                  <div className="h-1 w-full bg-primary rounded-md"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <Controls.InputComponent placeholder="Buscar..." name="SEARCH" onChange={(e) => { handleInputChange(e); setIsSearch(false); }} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-primary p-2 rounded-md">
                    <span className="text-title-3 font-semibold text-white">Tipo de proyecto</span>
                  </div>
                  <div className="h-1 w-full bg-primary rounded-md"></div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                {
                  listEstadosProyecto.map((el, index) => (
                    <div className="flex" key={index}>
                      <Controls.RadioboxComponent 
                        id={el.name}
                        name='TIPO_PROYECTO' 
                        value={el.ID_ESTADO}
                        checked={data}
                        onChange={handleInputChange}
                        label={el.ESTADO} 
                        defaultValue={0}
                      />
                      <p className={classNames(
                        "transition-colors duration-300",
                        "text-paragraph-3 px-2 rounded-md flex justify-center items-center",
                        data['TIPO_PROYECTO'] === el.ID_ESTADO.toString() ? "bg-primary text-white" : "bg-gradient-gris-200 text-gradient-gris-300 "
                      )}>{el.CANTIDAD}</p>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-primary p-2 rounded-md">
                    <span className="text-title-3 font-semibold text-white">Tecnologías</span>
                  </div>
                  <div className="h-1 w-full bg-primary rounded-md"></div>
                </div>
              </div>
              <Controls.InputSearchComponent
                handleEnter={(value) => handleSearchTech(value)}
                onClickIcon={(value) => handleSearchTech(value)}
                onChange={(e) => {
                  handleInputChange(e)
                  !e.target.value && handleSearchTech(e.target.value)
                }}
                placeholder="Buscar..."
                name="SEARCH_TECH"
                value={data}
                type="text"
              />
              <div className="flex flex-col gap-4 mt-2 h-52 overflow-auto">
                {
                  listTecnologias.length > 0 
                  ? listTecnologias.map((el, index) => (
                    <div className="flex" key={index}>
                      <Controls.CheckboxComponent 
                        onChange={handleCheckboxChange} 
                        id={`${el.label}-${el.value}`}
                        value={checkTecnologias}
                        label={el.label} 
                        name={el.value}
                        checked={true}
                      />
                    </div>  
                  ))
                  : <p className="text-center">Sin resultados</p>
                }
              </div>
            </div>
          </div>
          <div>
            <p className="text-title-3 font-bold text-gradient-gris-300">
              {listProyectos?.length || 0} resultados
              { (isSearch && data.SEARCH) && ` para "${data.SEARCH}"` }
            </p> 
            <hr />
            <div className="my-4 flex flex-col gap-3">
              {
                listProyectos.length > 0 ? listProyectos.map((el, index) => (
                  <div key={index} className="flex gap-3 hover:shadow-md transition-shadow duration-700">
                    <Image 
                      src={el.IMAGEN ?? ''}
                      width={200} 
                      height={200} 
                      alt={el.PROYECTO}
                      className="w-[350px] h-[180px] flex-shrink-0 object-cover rounded-md" 
                    />
                    <section className="flex flex-col justify-between p-4">
                      <div className="flex flex-col gap-2">
                        <h2 className="text-title-3 font-bold text-primary cursor-pointer" onClick={() => push(`/proyectos/${el.SLUG}`)}>{el.PROYECTO}</h2>
                        <p className="text-paragraph-2">{el.DESCRIPCION_CORTA}</p>
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="flex gap-3">
                          <span className="flex gap-2"><i>{IconAwesome[el.USUARIO_LIKE ? 'LIKE_SOLID' : 'LIKE_REGULAR']}</i> { el.CANTIDAD_LIKES }</span>
                          <span className="flex gap-2"><i>{IconAwesome.COMMENT}</i> { el.CANTIDAD_COMENTARIOS }</span>
                        </span>
                      </div>
                    </section>
                  </div>
                ))
                : <div className="flex flex-col items-center justify-center h-2/3">
                  <Image src="/assets/imagenes/withoutResults.png" width={300} height={300} alt="Sin resultados" />
                  <h2 className="text-title-2 font-bold">Sin resultados</h2>
                </div>
              }
            </div>
            <div className="mt-8 flex justify-center">
              <ReactPaginate
                ref={navigation}
                className="pagination-base"
                breakLabel="..."
                nextLabel="&#8702;"
                onPageChange={handleChangePagination}
                pageRangeDisplayed={0}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                selectedPageRel={2}
                previousLabel="&#8701;"
                renderOnZeroPageCount={null}
              />
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

export async function getServerSideProps({ req }) {
  let listEstadosProyecto = [], arrListTecnologias = [];

  const searchEstadosProyecto = async () => {
    await SendRequestData({
      queryId: 60,
      body: { },
      success: (resp) => listEstadosProyecto = resp.dataList,
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  }

  const getTecnologias = async () => {
    await SendRequestData({
      queryId: 57,
      body: { ID_ENTORNOS: '' },
      success: (resp) => arrListTecnologias = resp.dataList,
      error: (err) => console.error(err)
    });
  }

  try {
    await searchEstadosProyecto();
    await getTecnologias();

    return { props: { listEstadosProyecto, arrListTecnologias } };
  } catch (error) {
    let propError = {
      error: true,
      message: "Error en el servidor",
      detail: "Hubo un error al listar el blog",
      status: 500,
    };
    return { props: { error: propError } };
  }
}
