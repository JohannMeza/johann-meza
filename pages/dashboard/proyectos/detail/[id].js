import { SaveRequestData, FileRequestData, FormRequestData } from 'src/helpers/helpRequestBackend';
import { useFormValidation } from 'src/hooks/useFormValidation';
import { EnvConstants } from 'util/EnvConstants';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import { useQuill } from 'react-quilljs';
import { Toolbar, formats } from 'src/config/Toolbar';
import { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useAlert } from 'react-alert';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import Controls from 'src/components/Controls';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import PathConstants from "util/PathConstants";
import useFileUpload from 'src/hooks/useFileUpload';
import useLoaderContext from 'src/hooks/useLoaderContext';
import Icon from "src/components/icon/Icon";
import useAuthContext from "src/hooks/useAuthContext";
import 'quill/dist/quill.snow.css';

export default function ComentariosDetail({ dataInitial, quillContent, dataListTecnologias }) {
  const validate = (fieldValues = data) =>  {
    let temp = {...errors};
    if ("PROYECTO" in fieldValues) {
      temp.PROYECTO = fieldValues.PROYECTO === "" ? "El campo Proyecto es requerido" : "";
    } 

    if ("SLUG" in fieldValues) {
      let slug = fieldValues.SLUG.trim();
      let isValidateSlug = slug?.match(/[^\w\s-]/g, '')?.length || slug?.match(/\s+/g, '-')?.length || slug?.match(/--+/g, '-')?.length;
      temp.SLUG = !fieldValues.SLUG ? "El campo Slug es requerido" : isValidateSlug ? "El campo slug no cumple con las expecificaciones requeridas" : "";
    } 

    if ("ID_TECNOLOGIAS" in fieldValues) {
      temp.ID_TECNOLOGIAS = !fieldValues.ID_TECNOLOGIAS ? "El campo Tecnologias es requerido" : "";
    } 

    if ("ID_TIPO_PROYECTO" in fieldValues) {
      temp.ID_TIPO_PROYECTO = fieldValues.ID_TIPO_PROYECTO === null ? "El campo Tipo Proyecto es requerido" : "";
    } 

    if ("ID_ESTADO" in fieldValues) {
      temp.ID_ESTADO = !fieldValues.ID_ESTADO ? "El campo Estado es requerido" : "";
    } 

    if ("DESCRIPCION_CORTA" in fieldValues) {
      temp.DESCRIPCION_CORTA = (fieldValues.DESCRIPCION_CORTA?.length || 0) > 250
        ? "El campo Descripcion corta no debe exceder a 250 caracteres"
        : !fieldValues.DESCRIPCION_CORTA ? "El campo Descripcion corta es requerido" : "";;
    } 

    if ("PORTADA" in fieldValues) {
      temp.PORTADA = (files.length === 0 || files.length === "") && !fieldValues.PORTADA ? "El campo Portada es requerido" : "";
    }
    
    setErrors({...temp});
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === '');
    }
  }

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

  const alert = useAlert();
  const editorRef = useRef(null);
  const [mode, setMode] = useState('text');
  const { push, query } = useRouter();
  const { user } = useAuthContext()
  const { setLoader } = useLoaderContext();
  const [contentQuill, setContentQuill] = useState("");
  const { quill, quillRef } = useQuill({modules: {syntax: {
    highlight: text => {
      hljs.configure({languages: ['javascript', 'html', 'css']})
      return hljs.highlightAuto(text).value
    }
  }, toolbar: Toolbar}, formats});
  const { data, errors, setErrors, handleInputFormChange, setData} = useFormValidation(dataInitial, true, validate);
  const [files, setFiles] = useFileUpload(true, (files) => {
    if (files.length === 0 && errors === true) setErrors(errors => { return { ...errors, PORTADA: `El campo Portada es requerido` } })
    else setErrors((errors) => delete errors.PORTADA)
  })
  const estados = useListEstados('4,5')
  const tipoProyecto = useListEstados('8,9,10')
  const handleBack = () => push(PathConstants.proyectos_admin)

  const searchProyecto = async () => {
    await SaveRequestData({
      queryId: 56,
      body: { ID_PROYECTO: !isNaN(query?.id) ? query.id : 0, },
      success: (resp) => {
        setData(resp.dataObject);
        setContentQuill(resp.dataObject.DESCRIPCION_LARGA);
      },
      error: (err) => console.error(err)
    })
  }

  const handleSubmit = () => {
    if (validate()) {
      let arrTecnologias = [...data.ID_TECNOLOGIAS.split(',').map(el => { return { id_tecnologias: el } })]
      if (arrTecnologias[0].id_tecnologias === '') arrTecnologias.splice(0, 1);
      if (data.PORTADA || files.length === 0) {
        setLoader(true);
        FormRequestData({
          queryId: 58,
          body: {
            ...data,
            ID_PROYECTOS: !isNaN(query?.id) ? query.id : 0,
            DESCRIPCION_LARGA: quill.root.innerHTML,
            ID_TECNOLOGIAS: JSON.stringify(arrTecnologias),
            ID_USER: user.ID_USUARIOS
          },
          success: (resp) => {
            setLoader(false)
            searchProyecto();
            alert.success(resp.message)
            !query.id && push(PathConstants.publicaciones_admin)
          },
          error: (err) => {
            console.error(err)
            setLoader(false)
            const { message, status } = err;
            (status < 500) && alert.error(message)
          }
        })
      } else {
        setLoader(true);
        FileRequestData({
          queryId: 58,
          path: EnvConstants.REACT_APP_URL_UPLOAD_CLOUD,
          body: {
            ...data,
            ID_PROYECTOS: !isNaN(query?.id) ? query.id : 0,
            DESCRIPCION_LARGA: quill.root.innerHTML,
            PORTADA: files[0].file,
            ARR_ID_TECNOLOGIAS: JSON.stringify(arrTecnologias),
            ID_USER: user.ID_USUARIOS
          },
          success: (resp) => {
            setLoader(false)
            searchProyecto();
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
      <div className='grid gap-4'>
        <div className="grid sm:grid-cols-[750px_minmax(300px,_1fr)] gap-4">
          <Controls.CardComponent zIndex={10} isInactiveTitle title={"Datos Generales"}>
            <div className="flex gap-2"></div>
            <div className="grid grid-cols-2 gap-4">
              <Controls.InputComponent
                label="Nombre del Proyecto"
                name="PROYECTO"
                onChange={handleInputFormChange}
                value={data}
                error={errors}

              />
              <Controls.InputComponent
                name="SLUG"
                value={data}
                error={errors}
                label="Slug"
                onChange={handleInputFormChange}
              />
              {/* <Controls.SelectComponent
                list={estados}
                name="ID_ESTADO"
                value={data}
                error={errors}
                label="Entorno"
                zIndex={9}
                onChange={handleInputFormChange}
              /> */}
              <Controls.SearchComponent
                list={dataListTecnologias}
                name="ID_TECNOLOGIAS"
                value={data}
                error={errors}
                label="Tecnologias"
                zIndex={9}
                onChange={handleInputFormChange}
                multiple
              />
              <Controls.SelectComponent
                list={tipoProyecto}
                name="ID_TIPO_PROYECTO"
                value={data}
                error={errors}
                label="Tipo Proyecto"
                zIndex={8}
                onChange={handleInputFormChange}
              />
              <Controls.SelectComponent
                list={estados}
                name="ID_ESTADO"
                value={data}
                error={errors}
                label="Estado"
                zIndex={7}
                onChange={handleInputFormChange}
              />
              <div style={{ gridColumn: '1 / span 2' }}>
                <Controls.InputComponent
                  list={estados}
                  name="DESCRIPCION_CORTA"
                  value={data}
                  error={errors}
                  label="Descripcion Corta"
                  onChange={handleInputFormChange}
                  textarea
                />
              </div>
            </div>
          </Controls.CardComponent>
          <Controls.CardComponent zIndex={10} title={"Imagen"} isInactiveTitle>
            <div className="flex gap-2"></div>
            <div>
              <Controls.FileComponent
                setFiles={setFiles}
                label='Portada'
                files={files}
                name="PORTADA"
                error={errors}
                value={data}
                setData={setData}
              />
            </div>
          </Controls.CardComponent>
        </div>
        
        <Controls.CardComponent zIndex={10} title={"Detalle del Proyecto"} isInactiveTitle>
          <div className="flex gap-2">
            <Controls.ButtonComponent 
              icon={mode === 'text' ? <Icon.Code /> : <Icon.Document />} 
              onClick={handleToggleMode} 
              className="color-secondary"
              title={mode === 'text' ? 'Ver HTML' : 'Ver Editor'}
            />
          </div>
          <div>
            <>
              <div className={mode === 'text' ? "show" : "hide"}>
                <div ref={quillRef}></div> 
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
            </>
          </div>
        </Controls.CardComponent>

        <div className='relative z-10'>
          <ButtonsSaveComponent
            handleBack={handleBack}
            handleAction={handleSubmit}
          />
        </div>
      </div>
    </MainComponent>
  );
}

export async function getServerSideProps ({ req, params }) {
  let dataInitial = { PROYECTO: '', SLUG: '', PORTADA: '', ID_TECNOLOGIAS: '', ID_TIPO_PROYECTO: null, ID_ESTADO: 4, DESCRIPCION_CORTA: '' }
  let quillContent = ''
  let dataProyecto = {};
  let dataListTecnologias = []
  const { id } = params;

  const searchProyecto = async () => {
    await SaveRequestData({
      queryId: 56,
      body: { ID_PROYECTO: id },
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => {
        dataInitial = resp.dataObject
        quillContent = resp.dataObject.DESCRIPCION_LARGA
      },
      error: (err) => console.error(err)
    })
  }

  const listTecnologias = async () => {
    await SaveRequestData({
      queryId: 57,
      body: { ID_ENTORNOS: '' },
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => dataListTecnologias = resp.dataList,
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  
  try {
    await listTecnologias();
    if (!isNaN(id)) {
      await searchProyecto()
      return { props: { dataInitial, quillContent, dataListTecnologias, dataProyecto } }
    }
    
    return { props: { dataInitial, quillContent, dataListTecnologias } }
  } catch (error) {
    console.error(error)
  }
}