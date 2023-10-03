import { useEffect, useRef, useState } from "react";
import { SendRequestData, ImageRequestData, SaveRequestData } from "src/helpers/helpRequestBackend";
import { useQuill } from 'react-quilljs';
import { formats } from 'src/config/Toolbar';
import { useFormValidation } from "src/hooks/useFormValidation";
import { AlertUtilMessage } from "src/utils/AlertUtil";
import { useAlert } from "react-alert";
import { classNames } from "src/utils/ClassNames";
import { FormatDateConstants } from "src/constants/FormatDateConstants";
import React from "react";
import hljs from 'highlight.js';
import DateUtil from 'src/utils/DateUtil';
import BannerComponent from 'src/components/layout/frontpage/header/BannerComponent';
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import useAuthContext from "src/hooks/useAuthContext";
import Image from "next/image";
import Controls from "src/components/Controls";
import Link from "next/link";
import Icon from "src/components/icon/Icon";
import IconAwesome from 'src/components/icon/IconAwesome'
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import useLoaderContext from 'src/hooks/useLoaderContext';
import frontStyles from "src/styles/Frontpage.module.css";
import 'highlight.js/styles/monokai-sublime.css'
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

const dataInitial = { COMENTARIO: '' }
const dataInitialRespuestas = { }
export default function PublicacionesPage({ dataPublicacion, listPublicacionesRelacionadas, quillContent }) {
  const validate = (fieldValues = data) =>  {
    let temp = {...errors};
    
    if ("COMENTARIO" in fieldValues) {
      temp.COMENTARIO = fieldValues.COMENTARIO === "" ? "El comentario no puede estar vacio" : "";
    } 

    setErrors({...temp});
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === '');
    }
  }
  
  const {data, handleInputFormChange, errors, setErrors} = useFormValidation(dataInitial, true, validate)
  const {data: dataRespuestas, handleInputFormChange: handleChangeRespuestas, errors: errorsRespuestas, setErrors: setErrorsRespuestas, setData: setDataRespuetas} = useFormValidation(dataInitialRespuestas, true, validate)
  const { setLoader } = useLoaderContext();
  const { user } = useAuthContext();
  const [, setCountMove] = useState(0)
  const [comentarios, setComentarios] = useState([])
  const boxPublicaciones = useRef(null)
  const alert = useAlert();
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
  const saveComentario = (idComentarioResponder, idComentarioPadre) => {
    if (idComentarioResponder) {
      if (!dataRespuestas[idComentarioResponder]) {
        setErrorsRespuestas((errors) => ({ ...errors, [idComentarioResponder]: 'El comentario no puede estar vacio' }))
        return;
      }
      else {
        let respuestas = errorsRespuestas;
        delete respuestas[idComentarioResponder]

        setErrorsRespuestas({...respuestas})
      }
      if (!Object.entries(user).length) return AlertUtilMessage({ title: 'No puedes comentar', text: 'Para poder comentar tienes que iniciar sesion o registrarte', type: 'info' })

      setLoader(true)
      SaveRequestData({
        queryId: 46,
        body: {
          ID_PUBLICACIONES: dataPublicacion.ID_PUBLICACIONES,
          COMENTARIO: dataRespuestas[idComentarioResponder],
          ID_COMENTARIOS_PADRE: idComentarioPadre,
          ID_COMENTARIOS_RESPONDER: idComentarioResponder,
        },
        success: (resp) => {
          setLoader(false)

          const comentariosFiltrados = comentarios.map(el => {
            if (el.ID_COMENTARIOS_PUBLICACIONES === idComentarioResponder) return {
              ...el,
              FLG_RESPONDER: false,
              RESPUESTAS: el.RESPUESTAS.map(res => ({ ...res, FLG_RESPONDER: false }))
            }
            return el
          });

          setComentarios(comentariosFiltrados)
          getComentarios()
          alert.success(resp.message)
        }, 
        error: (err) => {
          setLoader(false)
          const { message, status } = err;
          (status < 500) && alert.error(message)
        }
      })
    } else {
      if (validate()) {
        if (!Object.entries(user).length) return AlertUtilMessage({ title: 'No puedes comentar', text: 'Para poder comentar tienes que iniciar sesion o registrarte', type: 'info' })
        setLoader(true)
        SaveRequestData({
          queryId: 46,
          body: { ...data, ID_PUBLICACIONES: dataPublicacion.ID_PUBLICACIONES },
          success: (resp) => {
            setLoader(false)
            getComentarios()
            alert.success(resp.message)
          }, 
          error: (err) => {
            setLoader(false)
            const { message, status } = err;
            (status < 500) && alert.error(message)
          }
        })
      }
    }    
  }

  const getComentarios = () => {
    setLoader(true)
    ImageRequestData({
      queryId: 43,
      body: { ID_PUBLICACIONES: dataPublicacion.ID_PUBLICACIONES },
      success: (resp) => {
        setLoader(false)
        setComentarios(resp.dataList)
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  const handleClickResponder = (idComentarioPadre, idComentarioRespuesta) => {
    if (!Object.entries(user).length) return AlertUtilMessage({ title: 'No puedes comentar', text: 'Para poder comentar tienes que iniciar sesion o registrarte', type: 'info' })

    const comentariosFiltrados = comentarios.map(el => {
      if (el.ID_COMENTARIOS_PUBLICACIONES === idComentarioPadre) return {
        ...el,
        FLG_RESPONDER: idComentarioRespuesta === 0,
        RESPUESTAS: idComentarioRespuesta !== 0
          ? el.RESPUESTAS.map(res => res.ID_COMENTARIOS_PUBLICACIONES === idComentarioRespuesta
            ? { ...res, FLG_RESPONDER: true }
            : res )
          : el.RESPUESTAS
      }
      return el
    });
    setComentarios(comentariosFiltrados)
  }

  const handleClickCancelar = (idComentario, idComentarioPadre) => {
    const respuestas = dataRespuestas;
    const errores = errorsRespuestas
    let comentariosFiltrados = []

    if (idComentarioPadre) {
      comentariosFiltrados = comentarios.map(el => {
        if (el.ID_COMENTARIOS_PUBLICACIONES === idComentarioPadre) return {
          ...el,
          FLG_RESPONDER: false,
          RESPUESTAS: el.RESPUESTAS.map(res => {
            if (res.ID_COMENTARIOS_PUBLICACIONES === idComentario) return {
              ...res,
              FLG_RESPONDER: false,
            }
            return res
          })
        }
        return el
      });
    } else {
      comentariosFiltrados = comentarios.map(el => {
        if (el.ID_COMENTARIOS_PUBLICACIONES === idComentario) return {
          ...el,
          FLG_RESPONDER: false,
          RESPUESTAS: el.RESPUESTAS.map(res => ({ ...res, FLG_RESPONDER: false }))
        }
        return el
      });
    }

    delete respuestas[idComentario]
    delete errores[idComentario]
    setComentarios(comentariosFiltrados)
    setDataRespuetas(respuestas)
    setErrorsRespuestas(errores)
  }
  
  useEffect(() => {
    (quill) && quill.clipboard.dangerouslyPasteHTML(quillContent)
    window.scroll({top: 0});
  }, [quill, quillContent])
  
  useEffect(() => {
    (quill) && quill.clipboard.dangerouslyPasteHTML(quillContent);
    boxPublicaciones.current.scrollLeft = 0;
    setCountMove(0);
    setComentarios(dataPublicacion.COMENTARIOS)
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
              <article className="!h-auto" ref={quillRef}></article>
              <div className="grid gap-5 mt-10">
                <div>
                  <h2 className='title-base text-title-3'>Añadir nuevo comentario</h2>
                  <div className="grid gap-3">
                    <Controls.InputComponent textarea name="COMENTARIO" value={data} error={errors} onChange={handleInputFormChange} />
                    <Controls.ButtonComponent title="COMENTAR" onClick={saveComentario} />
                  </div>
                </div>
                      
                <div>
                  <h2 className='title-base text-title-3'>Comentarios</h2>

                  {comentarios.length === 0 ? (
                    <p className="text-center my-8 block">
                      Todavía no se agregaron comentarios, <br /> se la primera
                      persona en comentar
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {comentarios.map((comentario, index) => (
                        <React.Fragment key={index}>
                          <div
                            key={index}
                            className={classNames(frontStyles.publicacionComentarios, 'bg-gradient-gris-200')}
                          >
                            <div className="flex gap-4">
                              <div>
                                <Image
                                  src={comentario.IMAGEN}
                                  className="rounded-full"
                                  style={{ height: "50px", width: "50px" }}
                                  width={100}
                                  height={100}
                                  alt=""
                                  priority
                                />
                              </div>
                              <div className="w-full flex justify-between">
                                <div>
                                  <h3 className="title-base text-paragraph-2">
                                    {comentario.USUARIO} <span className="text-span-1 text-gradient-blue-400">{DateUtil().StringToMoment(comentario.FECHA_CREACION, FormatDateConstants.FECHA_HORA)}</span>
                                  </h3>
                                  <p>{comentario.PERFIL}</p>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2">{comentario.COMENTARIO}</p>
                            {comentario.FLG_RESPONDER ? (
                              <div className="grid gap-3">
                                <Controls.InputComponent
                                  textarea
                                  name={comentario.ID_COMENTARIOS_PUBLICACIONES}
                                  value={dataRespuestas}
                                  error={errorsRespuestas}
                                  onChange={handleChangeRespuestas}
                                />
                                <div className="flex gap-3">
                                  <Controls.ButtonComponent
                                    title="COMENTAR"
                                    onClick={() =>
                                      saveComentario(
                                        comentario.ID_COMENTARIOS_PUBLICACIONES,
                                        comentario.ID_COMENTARIOS_PUBLICACIONES
                                      )
                                    }
                                  />
                                  <Controls.ButtonComponent
                                    title="CANCELAR"
                                    className="color-secondary"
                                    onClick={() =>
                                      handleClickCancelar(
                                        comentario.ID_COMENTARIOS_PUBLICACIONES
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <Controls.ButtonComponent
                                title="Responder"
                                className={classNames(
                                  frontStyles.publicacionButtonResponse,
                                  "animation-opacity duration-500"
                                )}
                                onClick={() =>
                                  handleClickResponder(
                                    comentario.ID_COMENTARIOS_PUBLICACIONES,
                                    0
                                  )
                                }
                              />
                            )}
                          </div>

                          {comentario.RESPUESTAS.length > 0 && (
                            <div className={classNames('pl-8')}>
                              <h2 className="title-base text-title-3">
                                Respuestas
                              </h2>

                              <div className="flex flex-col gap-4">
                                {comentario.RESPUESTAS.map(
                                  (respuesta, index) => (
                                    <div
                                      key={index}
                                      className={classNames(frontStyles.publicacionComentarios, 'bg-gradient-gris-200')}
                                    >
                                      <div className="flex gap-4">
                                        <div>
                                          <Image
                                            src={respuesta.IMAGEN}
                                            className="rounded-full"
                                            style={{
                                              height: "50px",
                                              width: "50px",
                                            }}
                                            width={100}
                                            height={100}
                                            alt=""
                                            priority
                                          />
                                        </div>
                                        <div className="w-full flex justify-between">
                                          <div>
                                            <h3 className="title-base text-paragraph-2">
                                              {respuesta.USUARIO} <span className="text-span-1 text-gradient-blue-400">{DateUtil().StringToMoment(respuesta.FECHA_CREACION, FormatDateConstants.FECHA_HORA)}</span>
                                            </h3>
                                            <p>{respuesta.PERFIL}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="mt-2"><span className="text-gradient-blue-400">{respuesta.USUARIO_RESPONDIDO}</span> {respuesta.COMENTARIO}</p>
                                      {respuesta.FLG_RESPONDER ? (
                                        <div className="grid gap-3">
                                          <Controls.InputComponent
                                            textarea
                                            name={
                                              respuesta.ID_COMENTARIOS_PUBLICACIONES
                                            }
                                            value={dataRespuestas}
                                            error={errorsRespuestas}
                                            onChange={handleChangeRespuestas}
                                          />
                                          <div className="flex gap-3">
                                            <Controls.ButtonComponent
                                              title="COMENTAR"
                                              onClick={() =>
                                                saveComentario(
                                                  respuesta.ID_COMENTARIOS_PUBLICACIONES,
                                                  respuesta.ID_COMENTARIOS_PADRE
                                                )
                                              }
                                            />
                                            <Controls.ButtonComponent
                                              title="CANCELAR"
                                              className="color-secondary"
                                              onClick={() =>
                                                handleClickCancelar(
                                                  respuesta.ID_COMENTARIOS_PUBLICACIONES,
                                                  respuesta.ID_COMENTARIOS_PADRE
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <Controls.ButtonComponent
                                          title="Responder"
                                          className={classNames(
                                            frontStyles.publicacionButtonResponse,
                                            "animation-opacity duration-500"
                                          )}
                                          onClick={() =>
                                            handleClickResponder(
                                              respuesta.ID_COMENTARIOS_PADRE,
                                              respuesta.ID_COMENTARIOS_PUBLICACIONES
                                            )
                                          }
                                        />
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
    return { props: { dataPublicacion, listPublicacionesRelacionadas, quillContent } }
  } catch (error) {
    let propError = { error: true, message: "Error en el servidor", detail: "Hubo un error al listar el blog", status: 500 }
    return { props: {dataPublicacion, listPublicacionesRelacionadas, quillContent, error: propError} }
  }
}
