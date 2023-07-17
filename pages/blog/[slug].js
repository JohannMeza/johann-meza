import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css'
import { useEffect, useRef, useState } from "react";
import { SendRequestData, ImageRequestData } from "src/helpers/helpRequestBackend";
import { useQuill } from 'react-quilljs';
import { formats } from 'src/config/Toolbar';
import DateUtil from 'src/utils/DateUtil';
import BannerComponent from 'src/components/layout/frontpage/header/BannerComponent';
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import Image from "next/image";
import Controls from "src/components/Controls";
import Link from "next/link";
import Icon from "src/components/icon/Icon";
import IconAwesome from 'src/components/icon/IconAwesome'
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import 'quill/dist/quill.snow.css';

const ButtonStyleLeft = {
  transition: '.5s opacity ease',
  position: 'absolute',
  zIndex: '50',
  left: '0',
  top: '0',
  bottom: '0 ',
  display: 'flex',
};

const ButtonStyleRight = {
  transition: '.5s opacity ease',
  position: 'absolute',
  zIndex: '50',
  right: '0',
  top: '0',
  bottom: '0',
  display: 'flex',
}

export default function PublicacionesPage({ dataPublicacion, listPublicacionesRelacionadas, quillContent }) {
  const [, setCountMove] = useState(0)
  const boxPublicaciones = useRef(null)
  const { quill, quillRef } = useQuill({readOnly: true, modules: {syntax: {
    highlight: text => {
      hljs.configure({languages: ['javascript', 'html', 'css']})
      return hljs.highlightAuto(text).value
    }
  }, toolbar: false}, formats});
  const moverScroll = (isMove) => {
    let cantidadPublicacion = listPublicacionesRelacionadas.length - 1;
    setCountMove((countMove) => {
      let valueCount = (isMove) 
        ? ((countMove < cantidadPublicacion) ? countMove + 1 : 0)
        : (countMove > 0 ? countMove - 1 : cantidadPublicacion)

      let movePx = boxPublicaciones.current.offsetWidth * valueCount
      boxPublicaciones.current.scrollLeft = movePx
      return valueCount
    })
  }
  
  useEffect(() => {
    (quill) && quill.clipboard.dangerouslyPasteHTML(quillContent)
    window.scroll({top: 0});
  }, [quill, quillContent])
  
  useEffect(() => {
    (quill) && quill.clipboard.dangerouslyPasteHTML(quillContent);
    boxPublicaciones.current.scrollLeft = 0;
    setCountMove(0);
  }, [dataPublicacion, listPublicacionesRelacionadas])

  return (
    <>
      <BannerComponent title={dataPublicacion.TITULO} />
      <BodyComponent>
        <br />
        <div className='box-base'>
          <div className="grid grid-cols-[1fr,30%] gap-5">
            <div>
              {
                dataPublicacion.PORTADA &&
                <Image 
                  priority
                  src={dataPublicacion.PORTADA} 
                  alt={dataPublicacion.TITULO} 
                  width={950} 
                  height={450} 
                  className='w-full h-[350px] object-cover rounded-[10px]' 
                />
              }
              <div className='flex justify-between my-4'>
                <div className='flex gap-4 items-center'>
                  {
                    dataPublicacion?.IMAGEN && <Image width={100} height={100} src={dataPublicacion.IMAGEN} alt="" className='w-16 h-16 rounded-full' />
                  }
                  <div className='flex flex-col justify-center'>
                    <span className=''>Publicado por:</span>         
                    <span className='text-paragraph-1 font-bold'>{ dataPublicacion.AUTOR }</span>
                    <span className='text-paragraph-3 font-bold'>{ dataPublicacion.PERFIL }</span>
                  </div>
                </div>
                <div className='flex flex-col text-right font-semibold text-paragraph-3'>
                  <span>{ DateUtil().FormatDate(dataPublicacion.FECHA_PUBLICACION) }</span>
                  <span>{dataPublicacion.UBICACION}</span>
                  <div className='flex gap-1 flex-row-reverse'>
                    {
                      dataPublicacion?.NETWORKS?.map((el, index) => (
                        el.NETWORK === 'facebook'
                          ? <a href={el.LINK} rel="noreferrer" target='_blank' key={index}><Controls.ButtonIconComponent icon={IconAwesome.FACEBOOK} /></a>
                          : el.NETWORK === 'twitter'
                            ? <a href={el.LINK} rel="noreferrer" target='_blank' key={index}><Controls.ButtonIconComponent icon={IconAwesome.TWITTER} /></a>
                            : el.NETWORK === 'youtube'
                              ? <a href={el.LINK} rel="noreferrer" target='_blank' key={index}><Controls.ButtonIconComponent icon={IconAwesome.YOUTUBE} /></a>
                              : null
                      ))
                    }
                  </div>
                </div>
              </div>
              <article className="dataPublicacion-base-content" ref={quillRef}></article>
            </div>
            <div className="relative">
              <div className="border p-4 sticky top-20">
                <h2 className='title-base mb-3 text-paragraph-1'>Publicaciones Relacionadas</h2>
                <div ref={boxPublicaciones} className='relative flex gap-6 overflow-x-scroll w-full scroll scroll-base-transparent' style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}>
                  {
                    listPublicacionesRelacionadas.length ? 
                    listPublicacionesRelacionadas.map((el, index) => (
                      <PublicacionRelacionada key={index} data={el} />
                    ))
                    : <span className="block text-center">Sin resultados 😲</span>
                  }
                </div>

                <span style={ButtonStyleLeft} className='opacity-0 hover:opacity-100'>
                  <Controls.ButtonIconComponent onClick={() => moverScroll(false)} icon={<Icon.ChevronLeftIcon />} />
                </span>

                <span style={ButtonStyleRight} className='opacity-0 hover:opacity-100'>
                  <Controls.ButtonIconComponent onClick={() => moverScroll(true)} icon={<Icon.ChevronRightIcon />} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <br />
      </BodyComponent>
      <FooterComponent />

    </>
  )
}

const PublicacionRelacionada = ({ data }) => {
  return (
    <div className="flex-shrink-0 snap-start w-full">
      <div className='flex flex-col top-12 gap-3 whitespace-pre-wrap'>
        <Image src={data.portada} width={550} height={250} alt={data.titulo} className='w-full h-32 rounded-md object-cover' />
        <div>
          <Link href={`/blog/${data.slug}`} className='title-base text-paragraph-2 cursor-pointer'>{ data.titulo }</Link>
          <p className='text-paragraph-3'>{ data.descripcion_corta }</p>
          <div className='flex items-center gap-3 mt-2'>
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
        paths = publicaciones.map(({slug}) => ({params: {slug}}))
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

export async function getStaticProps({ params }) {
  let SLUG = params.slug;
  let dataPublicacion = [], listPublicacionesRelacionadas = [], quillContent = {};
  
  const getPublicacionesRelacionadas = async () => {
    await SendRequestData({
      queryId: 38,
      body: { SLUG },
      success: (resp) => {
        listPublicacionesRelacionadas = resp.dataList
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  }

  const getPublicacion = async () => {
    await ImageRequestData({
      queryId: 36,
      body: { SLUG },
      success: (resp) => {
        dataPublicacion = resp.dataObject
        quillContent = JSON.parse(resp.dataObject.PUBLICACION)
      },
      error: (err) => {
        const { message, status } = err;
        status < 500 && alert.error(message);
      },
    });
  }

  try {
    await getPublicacion()
    await getPublicacionesRelacionadas()

    return { props: {dataPublicacion, listPublicacionesRelacionadas, quillContent} }
  } catch (error) {
    let propError = { error: true, message: "Error en el servidor", detail: "Hubo un error al listar el blog", status: 500 }
    return { props: {dataPublicacion, listPublicacionesRelacionadas, quillContent, error: propError} }
  }
}
