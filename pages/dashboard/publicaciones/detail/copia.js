// import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import 'highlight.js/styles/monokai-sublime.css'
// import('highlight.js/lib/core').then((highlightModule) => {
//   highlightModule.configure({   // optionally configure hljs
//     languages: ['javascript', 'ruby', 'python', 'html']
//   });
  // console.log(highlightModule.Quill)
  // const Syntax = Quill.import('modules/syntax');
  // Syntax.DEFAULTS = {
  // highlight: function (text) {
  //     const result = highlightModule.default.highlightAuto(text);
  //     console.log(result)
  //     return result.value;
  //     }
  // };
// });

import { useState, useEffect, useRef } from 'react';
// import { useQuill } from 'react-quilljs';
import { useFormValidation } from 'src/hooks/useFormValidation';
import { FileRequestData, SaveRequestData, FormRequestData } from 'src/helpers/helpRequestBackend';
import { useAlert } from 'react-alert';
import { useRouter } from 'next/router';
import { useListEstados } from 'src/hooks/useListEstados';
import { EnvConstants } from 'util/EnvConstants';
import { Editor } from '@monaco-editor/react';
import Icon from "src/components/icon/Icon";
import PathConstants from 'util/PathConstants';
import Toolbar from 'src/config/Toolbar';
import Controls from 'src/components/Controls';
import useLoaderContext from 'src/hooks/useLoaderContext';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import useFileUpload from 'src/hooks/useFileUpload';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import useAuthContext from "src/hooks/useAuthContext";
// import 'quill/dist/quill.snow.css';

const formats = ['bold', 'italic', 'underline', 'strike', 'link', 'image', 'code-block', 'clean'];
let quillModule = null

const Llamar = ({ quillContent, dataInitial, arrCategorias, arrEtiquetas }) => {
  // quillModule = await moduleGet().useQuill
  const [valor, setValor] = useState(null);
  const [hljs, setHljs] = useState(null);
  
  const eject = async () => {
    let hl = await import('highlight.js');

    let valor1 = await import('react-quilljs')
    console.log(hl)
    setValor(valor1)
    setHljs(hl)
  }
  
  eject()

  

  return (hljs && valor?.useQuill) && <PruebaComponent hljs={hljs} valor={valor} quillContent={quillContent} dataInitial={dataInitial} arrCategorias={arrCategorias} arrEtiquetas={arrEtiquetas} />
}

export default function PublicacionesDetailPage({ quillContent, dataInitial, arrCategorias, arrEtiquetas }) {
  // const [quill, setQuill] = useState(false)
  


  // useEffect(() => {
    // llamar()
    // import('react-quilljs').then((highlightModule) => quillModule = highlightModule.useQuill);
  // }, [])

  return <Llamar quillContent={quillContent} dataInitial={dataInitial} arrCategorias={arrCategorias} arrEtiquetas={arrEtiquetas} />
}

const PruebaComponent = ({ hljs, valor, quillContent, dataInitial, arrCategorias, arrEtiquetas }) => {
  const modules = {modules: { syntax: {
    highlight: text => hljs.default.highlightAuto(text).value
  }, toolbar: '#toolbar'}, formats};

  const validate = (fieldValues = data) =>  {
    let temp = {...errors};
    if ("TITULO" in fieldValues) {
      temp.TITULO = fieldValues.TITULO === "" ? "El campo Titulo es requerido" : "";
    } 

    if ("ID_CATEGORIAS" in fieldValues) {
      temp.ID_CATEGORIAS = fieldValues.ID_CATEGORIAS === "" ? "El campo Categorias es requerido" : "";
    } 

    if ("ID_ETIQUETAS" in fieldValues) {
      temp.ID_ETIQUETAS = fieldValues.ID_ETIQUETAS === "" ? "El campo Etiquetas es requerido" : "";
    } 

    if ("TIPO" in fieldValues) {
      temp.TIPO = fieldValues.TIPO === null ? "El campo Tipo Menú es requerido" : "";
    } 

    if ("RUTA" in fieldValues) {
      temp.RUTA = !fieldValues.RUTA && data.TIPO ? "El campo Ruta es requerido" : "";
    } 

    if ("PORTADA" in fieldValues) {
      temp.PORTADA = (files.length === 0 || files.length === "") && !fieldValues.PORTADA ? "El campo Portada es requerido" : "";
    } 

    if ("SLUG" in fieldValues) {
      let slug = fieldValues.SLUG.trim();
      let isValidateSlug = slug?.match(/[^\w\s-]/g, '')?.length || slug?.match(/\s+/g, '-')?.length || slug?.match(/--+/g, '-')?.length;
      temp.SLUG = !fieldValues.SLUG ? "El campo Slug es requerido" : isValidateSlug ? "El campo slug no cumple con las expecificaciones requeridas" : "";
    } 

    if ("DESCRIPCION_CORTA" in fieldValues) {
      temp.DESCRIPCION_CORTA = (fieldValues.DESCRIPCION_CORTA?.length || 0) > 250
        ? "El campo Descripcion corta no debe exceder a 250 caracteres"
        : !fieldValues.DESCRIPCION_CORTA ? "El campo Descripcion corta es requerido" : "";;
    } 
    
    setErrors({...temp});
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === '');
    }
  }
  const [mode, setMode] = useState('text');
  const { data, handleInputFormChange, errors, setErrors, setData } = useFormValidation(dataInitial, true, validate)
  console.log(valor)
  const { quill, quillRef } = valor && valor.useQuill(modules)
  // import('react-quilljs').then((highlightModule) => valor = highlightModule.useQuill)
  



  // .useQuill({modules: {syntax: (text) => hljs.highlightAuto(text).value,  toolbar: Toolbar}, formats});
  const { setLoader } = useLoaderContext();
  const { push, query } = useRouter();
  const {user} = useAuthContext()
  const alert = useAlert();
  const estados = useListEstados('1,2,3')
  const editorRef = useRef(null);
  const [categorias] = useState(arrCategorias)
  const [contentQuill, setContentQuill] = useState("");
  const [etiquetas] = useState(arrEtiquetas)
  const [files, setFiles] = useFileUpload(true, (files) => {
    if (files.length === 0 && errors === true) setErrors(errors => { return { ...errors, PORTADA: `El campo Portada es requerido` } })
    else setErrors((errors) => delete errors.PORTADA)
  })

  const handleToggleMode = () => {
    setMode(() => {
      if (mode === 'text') {
        setContentQuill(quill.root.innerHTML)
        return 'html'
      } else {
        quill.clipboard.dangerouslyPasteHTML(contentQuill)  
        return 'text'
      }
    });
  };

  const savePublicacion = () => {
    if (validate()) {
      let arrCategorias = [...data.ID_CATEGORIAS.split(',').map(el => { return { id_categorias: el } })]
      let arrEtiquetas = [...data.ID_ETIQUETAS.split(',').map(el => { return { id_etiquetas: el } })]
      let publicacion = mode === 'text' ? quill.root.innerHTML : contentQuill

      if (arrCategorias[0].id_categorias === '') arrCategorias.splice(0, 1);
      if (arrEtiquetas[0].id_etiquetas === '') arrEtiquetas.splice(0, 1);

      setLoader(true);
      if (data.PORTADA || files.length === 0) {
        FormRequestData({
          queryId: 29,
          body: {
            ...data,
            ID_PUBLICACIONES: query.id || 0,
            ID_CATEGORIAS: JSON.stringify(arrCategorias),
            ID_ETIQUETAS: JSON.stringify(arrEtiquetas),
            PUBLICACION: JSON.stringify(publicacion, (key, value) => {
              if (typeof value === 'string') return value.replace(/'/g, '"');
              return value;
            }),
            SLUG: data.SLUG.trim().toLowerCase(),
            ID_USER: user.ID_USUARIOS
          },
          success: (resp) => {
            setLoader(false)
            alert.success(resp.message)
            !query.id && push(PathConstants.publicaciones_admin)
          },
          error: (err) => {
            setLoader(false)
            const { message, status } = err;
            (status < 500) && alert.error(message)
          }
        })
      } else {
        FileRequestData({
          queryId: 29,
          path: EnvConstants.REACT_APP_URL_UPLOAD_CLOUD,
          body: {
            ...data,
            ID_PUBLICACIONES: query.id || 0,
            ID_CATEGORIAS: JSON.stringify(arrCategorias),
            ID_ETIQUETAS: JSON.stringify(arrEtiquetas),
            PUBLICACION: JSON.stringify(publicacion, (key, value) => {
              if (typeof value === 'string') return value.replace(/'/g, '"');
              return value;
            }),
            SLUG: data.SLUG.trim().toLowerCase(),
            PORTADA: files[0].file,
            ID_USER: user.ID_USUARIOS
          },
          success: (resp) => {
            setLoader(false)
            alert.success(resp.message)
            !query.id && push(PathConstants.publicaciones_admin)
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

  const removeAccents = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const handleChangeTitulo = (e) => {
    let {name, value} = e.target;
    
    if (name === "TITULO") {
      const slug = removeAccents(value)
      .trim()                    // Remover espacios en blanco al inicio y final
      .toLowerCase()              // Convertir a minúsculas
      .replace(/[^\w\s-]/g, '')   // Remover caracteres especiales
      .replace(/\s+/g, '-')       // Reemplazar espacios en blanco por guiones
      .replace(/--+/g, '-')       // Remover duplicados de guiones

      if (!errors.slug) {
        let objError = errors;
        delete objError.SLUG
        setErrors({ ...objError })
      }

      setData((data) => ({ ...data, ["SLUG"]: slug }))
    } 
  }

  const handleMount = (editor) => {
    editorRef.current = editor
                
    setTimeout(() => {
      const action = editor.getAction('editor.action.formatDocument');
      action && action.run();
    }, 100)  
  }

  useEffect(() => { 
    if (quill) {
      setContentQuill(quillContent);
      quill.clipboard.dangerouslyPasteHTML(quillContent);
    }
  }, [quill, quillContent])

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={15} title={"Datos Generales"}>
          <div className="flex gap-2"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className='grid grid-cols-2 gap-4 col-span-2'>
              <Controls.InputComponent
                label="Titulo"
                value={data}
                name="TITULO"
                onChange={(e) => {
                  handleInputFormChange(e)
                  handleChangeTitulo(e)
                }}
                error={errors}
              />
              <Controls.SearchComponent
                value={data}
                label="Categorias"
                name="ID_CATEGORIAS"
                list={categorias}
                onChange={handleInputFormChange}
                error={errors}
                zIndex={10}
              />
              <Controls.SearchComponent
                value={data}
                label="Etiquetas"
                name="ID_ETIQUETAS"
                list={etiquetas}
                onChange={handleInputFormChange}
                error={errors}
                zIndex={9}
              />
              <Controls.InputComponent
                value={data}
                label="Slug"
                name="SLUG"
                onChange={handleInputFormChange}
                error={errors}
                zIndex={8}
              />
              <Controls.SelectComponent
                label="Estados"
                list={estados}
                value={data}
                name="ID_ESTADO"
                onChange={handleInputFormChange}
                error={errors}
                zIndex={7}
              />
            </div>
            <div className='grid gap-4 col-span-1'>
              <Controls.FileComponent
                setFiles={setFiles}
                label='Portada'
                files={files}
                name="PORTADA"
                error={errors}
                value={data}
                setData={setData}
              />
              <Controls.InputComponent
                label={`Descripcion Corta (${data.DESCRIPCION_CORTA?.length || 0} de 250)`}
                value={data}
                name="DESCRIPCION_CORTA"
                onChange={handleInputFormChange}
                error={errors}
                textarea
              />
            </div>
          </div>
        </Controls.CardComponent>
      </div>

      <div className="margin-base-top-card">
        <Controls.CardComponent zIndex={11} title="Contenido">
          <div className="flex gap-2">
            <Controls.ButtonComponent 
              icon={mode === 'text' ? <Icon.Code /> : <Icon.Document />} 
              onClick={handleToggleMode} 
              className="color-secondary"
              title={mode === 'text' ? 'Ver HTML' : 'Ver Editor'}
            />
          </div>
          <div className='h-auto'>
            <div className={mode === 'text' ? "show" : "hide"}>
              <div ref={quillRef}></div> 
              <div id="toolbar">
        <select className="ql-size">
          <option value="small" />
          <option selected />
          <option value="large" />
          <option value="huge" />
        </select>
        <button className="ql-bold" />
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <button className="ql-code-block"></button>
      </div>
            </div>

            {mode !== 'text' && <Editor 
              className={mode === 'text' ? "hide" : "show"}
              height={mode === 'text' ? "0vh" : "80vh"} 
              defaultLanguage='html' 
              onMount={(editor) => handleMount(editor)}
              value={contentQuill} 
              onChange={(valor) => {
                setContentQuill(valor)
              }} 
            />}
          </div>
        </Controls.CardComponent>
      </div>
      <div className='relative z-50'>
        <ButtonsSaveComponent handleBack={() => push(PathConstants.publicaciones_admin)} handleAction={savePublicacion} />
      </div>
    </MainComponent>
  )
}

export async function getServerSideProps({ req, params }) {
  let { id } = params
  let dataInitial = { TITULO: "", ID_CATEGORIAS: "", ID_ETIQUETAS: "", PUBLICACION: "", ID_ESTADO: null, PORTADA: "", DESCRIPCION_CORTA: "", SLUG: "" }
  let arrCategorias = []
  let arrEtiquetas = []
  let quillContent = ''

  import('react-quilljs').then((highlightModule) => highlightModule);
  import('highlight.js/lib/core').then((highlightModule) => highlightModule);
    // console.log(highlightModule.Quill)
    // const Syntax = Quill.import('modules/syntax');
    // Syntax.DEFAULTS = {
    // highlight: function (text) {
    //     const result = highlightModule.default.highlightAuto(text);
    //     console.log(result)
    //     return result.value;
    //     }
    // };
 
  const listCategorias = async () => {
    await SaveRequestData({
      queryId: 27,
      body: dataInitial,
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => arrCategorias = resp.dataList,
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  const listEtiquetas = async () => {
    await SaveRequestData({
      queryId: 28,
      body: dataInitial,
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => arrEtiquetas = resp.dataList,
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  const searchPublicacion = async () => {
    await SaveRequestData({
      queryId: 32,
      body: { id_publicaciones: id },
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => {
        let strCategorias = Array.from(resp.dataObject.ID_CATEGORIAS, el => el.value).join(',')
        let strEtiquetas = Array.from(resp.dataObject.ID_ETIQUETAS, el => el.value).join(',')
        dataInitial = { ...resp.dataObject, ID_CATEGORIAS: strCategorias, ID_ETIQUETAS: strEtiquetas }
        quillContent = JSON.parse(resp.dataObject.PUBLICACION)
      },
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  try {
    if (isNaN(id)) {
      return { props: { quillContent, dataInitial, arrCategorias, arrEtiquetas } }
    } else {
      await searchPublicacion()
      await listEtiquetas()
      await listCategorias()
      return { props: { quillContent, dataInitial, arrCategorias, arrEtiquetas } }
    }
  } catch (error) {
    console.log(error)
  }
}