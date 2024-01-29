import { useEffect, useState } from "react";
import { SendRequestData, ImageRequestData, SaveRequestData } from "src/helpers/helpRequestBackend";
import { useQuill } from 'react-quilljs';
import { formats } from 'src/config/Toolbar';
import { useFormValidation } from "src/hooks/useFormValidation";
import { AlertUtilMessage } from "src/utils/AlertUtil";
import { useAlert } from "react-alert";
import { classNames } from "src/utils/ClassNames";
import { FormatDateConstants } from "src/constants/FormatDateConstants";
import { REQUEST_DATABASE } from "server/helpers/request";
import React from "react";
import hljs from 'highlight.js';
import DateUtil from 'src/utils/DateUtil';
import BodyComponent from "src/components/layout/frontpage/body/BodyComponent";
import useAuthContext from "src/hooks/useAuthContext";
import Image from "next/image";
import Controls from "src/components/Controls";
import FooterComponent from "src/components/layout/frontpage/footer/FooterComponent";
import useLoaderContext from 'src/hooks/useLoaderContext';
import frontStyles from "src/styles/Frontpage.module.css";
import Icon from 'src/components/icon/Icon'
import 'highlight.js/styles/monokai-sublime.css'
import 'quill/dist/quill.snow.css';

const dataInitial = { COMENTARIO: '' }
const dataInitialRespuestas = { }

export default function ProyectoPage({ dataPublicacion, quillContent }) {
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
  const [images, setImages] = useState();
  const { setLoader } = useLoaderContext();
  const { user, isAuthenticated } = useAuthContext();
  const [, setCountMove] = useState(0)
  const [comentarios, setComentarios] = useState()
  const [cantidadLikes, setCantidadLikes] = useState(dataPublicacion?.CANTIDAD_LIKES)
  const alert = useAlert();
  const [isUsuarioLike, setIsUsuarioLike] = useState(false)
  const { quill, quillRef } = useQuill({readOnly: true, modules: {syntax: {
    highlight: text => {
      hljs.configure({languages: ['javascript', 'html', 'css']})
      return hljs.highlightAuto(text).value
    }
  }, toolbar: false}, formats});

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
      if (!Object.entries(user)?.length) return AlertUtilMessage({ title: 'No puedes comentar', text: 'Para poder comentar tienes que iniciar sesion o registrarte', type: 'info' })

      setLoader(true)
      SaveRequestData({
        queryId: 63,
        body: {
          ID_PROYECTOS: dataPublicacion?.ID_PROYECTOS,
          COMENTARIO: dataRespuestas[idComentarioResponder],
          ID_COMENTARIOS_PADRE: idComentarioPadre,
          ID_COMENTARIOS_RESPONDER: idComentarioResponder,
        },
        success: (resp) => {
          setLoader(false)

          const comentariosFiltrados = comentarios?.map(el => {
            if (el.ID_COMENTARIOS_PROYECTOS === idComentarioResponder) return {
              ...el,
              FLG_RESPONDER: false,
              RESPUESTAS: el.RESPUESTAS?.map(res => ({ ...res, FLG_RESPONDER: false }))
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
        if (!Object.entries(user)?.length) return AlertUtilMessage({ title: 'No puedes comentar', text: 'Para poder comentar tienes que iniciar sesion o registrarte', type: 'info' })
        setLoader(true)
        SaveRequestData({
          queryId: 63,
          body: { ...data, ID_PROYECTOS: dataPublicacion?.ID_PROYECTOS },
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

  const saveLikeByUser = () => {
    const options = {
      queryId: 65,
      body: { ID_PROYECTOS: dataPublicacion?.ID_PROYECTOS },
      success: (resp) => {
        setLoader(false)
        setComentarios(resp.dataList)
        getIsUsuarioLike()
        setCantidadLikes((cant) => cant + (isUsuarioLike ? -1 : 1))
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    }

    setLoader(true)
    isAuthenticated ? SaveRequestData(options) : SendRequestData(options);
  }
  
  const getIsUsuarioLike = () => {
    const options = {
      queryId: 66,
      body: { ID_PROYECTOS: dataPublicacion?.ID_PROYECTOS },
      success: (resp) => {
        setLoader(false)
        setIsUsuarioLike(resp.dataObject.USUARIO_LIKE)
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    }

    setLoader(true)
    isAuthenticated ? SaveRequestData(options) : SendRequestData(options);
  }

  const getComentarios = () => {
    setLoader(true)
    ImageRequestData({
      queryId: 64,
      body: { ID_PROYECTOS: dataPublicacion?.ID_PROYECTOS },
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
    if (!Object.entries(user)?.length) return AlertUtilMessage({ title: 'No puedes comentar', text: 'Para poder comentar tienes que iniciar sesion o registrarte', type: 'info' })
    const comentariosFiltrados = comentarios?.map(el => {
      if (el.ID_COMENTARIOS_PROYECTOS === idComentarioPadre) return {
        ...el,
        FLG_RESPONDER: idComentarioRespuesta === 0,
        RESPUESTAS: idComentarioRespuesta !== 0
          ? el.RESPUESTAS?.map(res => res.ID_COMENTARIOS_PROYECTOS === idComentarioRespuesta
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
      comentariosFiltrados = comentarios?.map(el => {
        if (el.ID_COMENTARIOS_PROYECTOS === idComentarioPadre) return {
          ...el,
          FLG_RESPONDER: false,
          RESPUESTAS: el.RESPUESTAS?.map(res => {
            if (res.ID_COMENTARIOS_PROYECTOS === idComentario) return {
              ...res,
              FLG_RESPONDER: false,
            }
            return res
          })
        }
        return el
      });
    } else {
      comentariosFiltrados = comentarios?.map(el => {
        if (el.ID_COMENTARIOS_PROYECTOS === idComentario) return {
          ...el,
          FLG_RESPONDER: false,
          RESPUESTAS: el.RESPUESTAS?.map(res => ({ ...res, FLG_RESPONDER: false }))
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

  // const getImagesUserAndTech = (ID_PROYECTOS) => {
  //   setLoader(true)
  //   ImageRequestData({
  //     queryId: 72,
  //     body: { ID_PROYECTOS: ID_PROYECTOS },
  //     success: (resp) => {
  //       setLoader(false)
  //       setImages(resp.dataObject)
  //     },
  //     error: (err) => {
  //       setLoader(false)
  //       const { message, status } = err;
  //       (status < 500) && alert.error(message)
  //     }
  //   })
  // }
  
  useEffect(() => {
    (quill) && quill.clipboard.dangerouslyPasteHTML(quillContent)
    window.scroll({top: 0});
  }, [quill, quillContent])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getIsUsuarioLike(), [user])
  
  useEffect(() => {
    (quill) && quill.clipboard.dangerouslyPasteHTML(quillContent);
    setCountMove(0);
    getComentarios()
    // getImagesUserAndTech(dataPublicacion?.ID_PROYECTOS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPublicacion])

  return (
    <>
      <div className={frontStyles.blogBanner}>
        <span className="text-title-2 text-white font-Poppins">Proyecto: </span>
        <h1 className="text-title-1 lg:text-[62px] lg:text-center text-white font-Poppins font-extrabold">
          {dataPublicacion?.PROYECTO}
        </h1>
      </div>
      <BodyComponent>
        <div className='box-base mt-10'>
          <div className="grid grid-cols-1 lg:grid-cols-[70%] justify-center gap-5">
            <div>
              {
                dataPublicacion?.PORTADA &&
                <Image 
                  priority
                  src={dataPublicacion?.PORTADA} 
                  alt={dataPublicacion?.PROYECTO} 
                  width={950} 
                  height={450} 
                  className='w-full h-[350px] object-cover rounded-[10px]' 
                />
              }
              <div className='flex justify-between gap-4 flex-col lg:flex-row mt-12'>
                <div className='flex gap-4 flex-col justify-start lg:items-center lg:flex-row'>
                  {/* {
                    dataPublicacion?.IMAGEN && <Image width={100} height={100} src={dataPublicacion?.IMAGEN} alt="" className='w-16 h-16 rounded-full' />
                  } */}
                  <div className="bg-gradient-gris-300 p-3 w-[75px] h-[75px] rounded-full">
                    <Icon.User className="text-white" />
                  </div>
                  <div className='flex flex-col justify-center'>
                    <span className=''>Publicado por:</span>         
                    <span className='text-paragraph-1 font-bold'>{ dataPublicacion?.AUTOR }</span>
                    <span className='text-paragraph-3 font-bold'>{ dataPublicacion?.PERFIL }</span>
                  </div>
                </div>
                <div className='flex flex-col lg:text-right font-semibold text-paragraph-3 gap-2 lg:gap-0'>
                  {/* <span>{ DateUtil().FormatDate(dataPublicacion?.FECHA_PUBLICACION) }</span>
                  <span>{dataPublicacion?.UBICACION}</span> */}
                  {/* <div className='flex gap-1 lg:flex-row-reverse'>
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
                  </div> */}
                </div>
              </div>
              <article className="!h-auto" ref={quillRef}></article>
              <div className="grid gap-3 mt-10">
                <h2 className='title-base text-title-3'>Tecnologias Utilizadas</h2>
                <div className="flex gap-1">
                  {
                    dataPublicacion?.TECNOLOGIAS?.map((el, index) => (
                      <>
                        {
                          el.FILENAME && 
                          <div key={index} className="flex flex-col items-center gap-2 p-4">
                            <Image 
                              src={`/assets/tech/${el.FILENAME}.${el.FILETYPE}`} 
                              alt={el.FILENAME} 
                              title={el.TECNOLOGIA} 
                              width={30} 
                              height={30} 
                              style={{
                                width: 'auto',
                                height: '30px',
                              }}
                            />
                            <span className="text-paragraph-3 font-bold">{el.TECNOLOGIA}</span>
                          </div>
                        }
                      </>
                    ))
                  }
                </div>
              </div>
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

                  {comentarios?.length === 0 ? (
                    <p className="text-center my-8 block">
                      Todavía no se agregaron comentarios, <br /> se la primera
                      persona en comentar
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {comentarios?.map((comentario, index) => (
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
                                  name={comentario.ID_COMENTARIOS_PROYECTOS}
                                  value={dataRespuestas}
                                  error={errorsRespuestas}
                                  onChange={handleChangeRespuestas}
                                />
                                <div className="flex gap-3">
                                  <Controls.ButtonComponent
                                    title="COMENTAR"
                                    onClick={() =>
                                      saveComentario(
                                        comentario.ID_COMENTARIOS_PROYECTOS,
                                        comentario.ID_COMENTARIOS_PROYECTOS
                                      )
                                    }
                                  />
                                  <Controls.ButtonComponent
                                    title="CANCELAR"
                                    className="color-secondary"
                                    onClick={() =>
                                      handleClickCancelar(
                                        comentario.ID_COMENTARIOS_PROYECTOS
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
                                    comentario.ID_COMENTARIOS_PROYECTOS,
                                    0
                                  )
                                }
                              />
                            )}
                          </div>

                          {comentario.RESPUESTAS?.length > 0 && (
                            <div className={classNames('pl-8')}>
                              <h2 className="title-base text-title-3">
                                Respuestas
                              </h2>

                              <div className="flex flex-col gap-4">
                                {comentario.RESPUESTAS?.map(
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
                                              respuesta.ID_COMENTARIOS_PROYECTOS
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
                                                  respuesta.ID_COMENTARIOS_PROYECTOS,
                                                  respuesta.ID_COMENTARIOS_PADRE
                                                )
                                              }
                                            />
                                            <Controls.ButtonComponent
                                              title="CANCELAR"
                                              className="color-secondary"
                                              onClick={() =>
                                                handleClickCancelar(
                                                  respuesta.ID_COMENTARIOS_PROYECTOS,
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
                                              respuesta.ID_COMENTARIOS_PROYECTOS
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
          </div>
        </div>
        <br />
      </BodyComponent>
      <FooterComponent />
    </>
  )
}

export async function getStaticPaths() {
  let paths = []

  const getPublicaciones = async () => {
    let params = { 
      queryId: 61, 
      body: { 
        PROYECTO: '',
        ID_ESTADO_PROYECTO: '0',
        ID_TECNOLOGIAS: '',
        ID_ESTADO: 4 
      },
      ID_USUARIOS: 1, 
      pagination: {}
    };

    const { dataList } = await REQUEST_DATABASE(params);
    paths = dataList?.map(({SLUG}) => ({ params: { slug: SLUG } }))
  };
  
  try {
    await getPublicaciones()
    return { paths, fallback: true }
  } catch (error) {
    return { paths: [], fallback: false }
  }
}

export async function getStaticProps({ params }) {
  let SLUG = params.slug;
  let dataPublicacion = [], quillContent = {};

  const getPublicacion = async () => {
    let params = { 
      queryId: 62, 
      body: { SLUG },
      ID_USUARIOS: 1, 
      pagination: {}
    };
    const resp = await REQUEST_DATABASE(params);
    dataPublicacion = resp.dataObject
    quillContent = resp.dataObject.DESCRIPCION_LARGA
  }

  try {
    await getPublicacion()

    return { props: { dataPublicacion, quillContent } }
  } catch (error) {
    let propError = { error: true, message: "Error en el servidor", detail: "Hubo un error al listar el blog", status: 500 }
    return { props: {dataPublicacion, quillContent, error: propError} }
  }
}