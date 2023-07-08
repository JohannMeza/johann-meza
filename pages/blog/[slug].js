import { useEffect, useState } from "react";
import { SendRequestData } from "src/helpers/helpRequestBackend";
import { useRouter } from "next/router";
import { useQuill } from 'react-quilljs';
import { useAlert } from 'react-alert';
import DateUtil from 'src/utils/DateUtil';
import BannerComponent from 'src/components/layout/frontpage/header/BannerComponent';
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import Image from "next/image";
import 'quill/dist/quill.snow.css';

export default function PublicacionesPage() {
  const [publicacion, setPublicacion] = useState({});
  const [publicacionesRelacionadas, setPublicacionesRelacionadas] = useState([])
  const { query } = useRouter();
  const { quill, quillRef } = useQuill({ readOnly: true, modules: { toolbar: false } })
  const alert = useAlert();

  const getPublicacion = () => {
    SendRequestData({
      queryId: 36,
      body: { SLUG: query.slug },
      success: (resp) => {
        setPublicacion(resp.dataObject)
        quill.setContents(JSON.parse(resp.dataObject.PUBLICACION))
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  }

  const getPublicacionesRelacionadas = () => {
    SendRequestData({
      queryId: 38,
      body: { slug: query.slug },
      success: (resp) => {
        setPublicacionesRelacionadas(resp.dataList)
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  }
  
  useEffect(() => {
    (query.slug && quill) && getPublicacion()
    getPublicacionesRelacionadas()
    // window.scroll({top: 0});
  }, [query.slug, quill])

  return (
    <>
      <BannerComponent title={publicacion.TITULO} />
      <BodyComponent>
        <br />
        <div className='box-base'>
          <div className="grid grid-cols-[1fr,30%] gap-5">
            <div>
              {
                publicacion.PORTADA &&
                <Image 
                  priority
                  src={publicacion.PORTADA} 
                  alt={publicacion.TITULO} 
                  width={950} 
                  height={450} 
                  className='w-full h-[350px] object-cover rounded-[10px]' 
                />
              }
              <div className='flex justify-between my-4'>
                <div className='flex gap-4 items-center'>
                  {/* <img src={card} alt="" className='w-16 h-16 rounded-full' /> */}
                  <div className='flex flex-col justify-center'>
                    <span className=''>Publicado por:</span>         
                    <span className='text-paragraph-1 font-bold'>{ publicacion.AUTOR }</span>
                    <span className='text-paragraph-3 font-bold'>{ publicacion.PERFIL }</span>
                    <div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col text-right font-semibold text-paragraph-3'>
                  <span>{ DateUtil().FormatDate(publicacion.FECHA_PUBLICACION) }</span>
                  <span>Caracas Venezuela</span>
                </div>
              </div>
              <article className="publicacion-base-content" ref={quillRef}></article>
            </div>
            <div>
              <div className="border p-4">
                <h2 className='title-base mb-3 text-paragraph-1'>Publicaciones Relacionadas</h2>
                <div className='flex flex-col gap-6'>
                  {
                    publicacionesRelacionadas.length ? 
                    publicacionesRelacionadas.map((el, index) => (
                      <PublicacionRelacionada key={index} data={el} />
                    ))
                    : <span className="block text-center">Sin resultados 😲</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
      </BodyComponent>
    </>
  )
}

const PublicacionRelacionada = ({ data }) => {
  return (
    <div>
      <div className='flex gap-3'>
        <Image src={data.portada} alt="" className='w-32 h-16 rounded-sm' />
        <div>
          <h3 className='title-base text-paragraph-2'>{ data.titulo }</h3>
          <p className='text-paragraph-3'>{ data.descripcion_corta }</p>
          <div className='flex items-center gap-3 mt-2'>
            {/* <img src={card} alt="" className='w-6 h-6 rounded-full' /> */}
            <span className='font-Poppins text-paragraph-3 font-bold'>{ data.AUTOR }</span>
          </div>
        </div>
      </div>  
    </div>
  )
}

export async function getStaticPaths() {
  let paths = []

  const getPublicaciones = async () => {
    await SendRequestData({
      queryId: 34,
      body: {id_categorias: 1},
      success: (resp) => {
        let categorias = resp.dataList || [];
        let publicaciones = categorias.map(el => (Object.values(el.publicaciones || []))).reduce((a, b) => a.concat(b))
        paths = publicaciones.map(({slug}) => ({params: {key: slug}}))
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  };
  
  try {
    await getPublicaciones()
    return { paths, fallback: false }
  } catch (error) {
    return { paths: [], fallback: false }
  }
}

export async function getStaticProps() {
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
    return { error: true, message: "Error en el servidor", detail: error || "Hubo un error al listar el blog", status: 500 }
  }
}
