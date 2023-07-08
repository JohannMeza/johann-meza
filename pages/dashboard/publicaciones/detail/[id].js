import { useState, useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import { useFormValidation } from 'src/hooks/useFormValidation';
import { FileRequestData, SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useAlert } from 'react-alert';
import { useRouter } from 'next/router';
import { useListEstados } from 'src/hooks/useListEstados';
import { EnvConstants } from 'util/EnvConstants';
import PathConstants from 'util/PathConstants';
import Toolbar from 'src/config/Toolbar';
import Controls from 'src/components/Controls';
import useLoaderContext from 'src/hooks/useLoaderContext';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import useFileUpload from 'src/hooks/useFileUpload';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import useAuthContext from "src/hooks/useAuthContext";
import 'quill/dist/quill.snow.css';

export default function PublicacionesDetailPage({ quillContent, dataInitial, arrCategorias, arrEtiquetas }) {
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

  const { data, handleInputFormChange, errors, setErrors, setData } = useFormValidation(dataInitial, true, validate)
  const { quill, quillRef } = useQuill({modules: {toolbar: Toolbar}});
  const { setLoader } = useLoaderContext();
  const { push, query } = useRouter();
  const {user} = useAuthContext()
  const alert = useAlert();
  const estados = useListEstados('1,2,3')

  const [categorias, setCategorias] = useState(arrCategorias)
  const [etiquetas, setEtiquetas] = useState(arrEtiquetas)
  const [files, setFiles] = useFileUpload(true, (files) => {
    if (files.length === 0 && errors === true) setErrors(errors => { return { ...errors, PORTADA: `El campo Portada es requerido` } })
    else setErrors((errors) => delete errors.PORTADA)
  })

  const savePublicacion = () => {
    if (validate()) {
      let arrCategorias = [...data.ID_CATEGORIAS.split(',').map(el => { return { id_categorias: el } })]
      let arrEtiquetas = [...data.ID_ETIQUETAS.split(',').map(el => { return { id_etiquetas: el } })]
      if (arrCategorias[0].id_categorias === '') arrCategorias.splice(0, 1);
      if (arrEtiquetas[0].id_etiquetas === '') arrEtiquetas.splice(0, 1);
      setLoader(true);
      
      if (data.PORTADA || files.length === 0) {
        SaveRequestData({
          queryId: 29,
          body: {
            ...data,
            id_publicaciones: query.id || 0,
            ID_CATEGORIAS: JSON.stringify(arrCategorias),
            ID_ETIQUETAS: JSON.stringify(arrEtiquetas),
            PUBLICACION: JSON.stringify(quill.getContents()),
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
            id_publicaciones: query.id || 0,
            ID_CATEGORIAS: JSON.stringify(arrCategorias),
            ID_ETIQUETAS: JSON.stringify(arrEtiquetas),
            PUBLICACION: JSON.stringify(quill.getContents()),
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

  useEffect(() => { quill && quill.setContents(quillContent) }, [quill, quillContent])

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
          <div className="flex gap-2"></div>
          <div>
            <div ref={quillRef}></div>
          </div>
        </Controls.CardComponent>
      </div>

      <ButtonsSaveComponent handleBack={() => push(PathConstants.publicaciones_admin)} handleAction={savePublicacion} />
    </MainComponent>
  )
}

export async function getServerSideProps({ req, params }) {
  let { id } = params
  let dataInitial = { TITULO: "", ID_CATEGORIAS: "", ID_ETIQUETAS: "", PUBLICACION: "", ID_ESTADO: null, PORTADA: "", DESCRIPCION_CORTA: "", SLUG: "" }
  let arrCategorias = []
  let arrEtiquetas = []
  let quillContent = ''

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
    await searchPublicacion()
    await listEtiquetas()
    await listCategorias()
    return { props: { quillContent, dataInitial, arrCategorias, arrEtiquetas } }
  } catch (error) {
    console.log(error)
  }
}