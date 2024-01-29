import { useState } from 'react';
import { useFormValidation } from 'src/hooks/useFormValidation';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import { ImageRequestData, SaveRequestData, FileRequestData } from "/src/helpers/helpRequestBackend";
import { useAlert } from 'react-alert';
import { ListConstants } from 'src/constants/ListConstants';
import { EnvConstants } from 'util/EnvConstants';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import Controls from 'src/components/Controls';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import useLoaderContext from "src/hooks/useLoaderContext";
import PathConstants from 'util/PathConstants';

export default function TecnologiasDetailPage({ dataInitial, listEntornos }) {
  const validate = (fieldValues = data) => {
    let temp = { ...errors };

    if ("ID_ENTORNOS" in fieldValues) {
      temp.ID_ENTORNOS = fieldValues.ID_ENTORNOS === "" ? "El campo Entorno es requerido" : "";
    }

    if ("ID_ESTADO" in fieldValues) {
      temp.ID_ESTADO = !fieldValues.ID_ESTADO ? "El campo Estado es requerido" : "";
    }

    setErrors({ ...temp });
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === "");
    }
  }
  
  const { data, handleInputFormChange, errors, setErrors, setData } = useFormValidation(dataInitial, true, validate)
  const { push, query } = useRouter();
  const { setLoader } = useLoaderContext()
  const alert = useAlert();
  const estados = useListEstados('4,5')
  const [files, setFiles] = useState([])

  const saveOrUpdateEntornos = () => {
    let arrEntornos = [...data.ID_ENTORNOS.split(',').map(el => { return { id_entornos: el } })];
    if (arrEntornos[0].id_entornos === '') arrEntornos.splice(0, 1);
    
    if (data.IMAGEN || files.length === 0) {
      setLoader(true) 
      SaveRequestData({
        queryId: 52,
        body: {  ...data, IMAGEN: !data.IMAGEN ? null : 'no-delete', ID_ENTORNOS: JSON.stringify(arrEntornos) }, 
        success: (resp) => {
          setLoader(false)
          alert.success(resp.message)
          push(PathConstants.tecnologias_admin)
        }, 
        error: (err) => {
          setLoader(false)
          const { message, status } = err;
          (status < 500) && alert.error(message)
        }
      })
    } else {
      setLoader(true) 
      FileRequestData({
        queryId: 52,
        path: EnvConstants.REACT_APP_URL_CUSTOMIZE_TECHNOLOGY,
        body: { ...data, IMAGEN: files[0].file, ID_ENTORNOS: JSON.stringify(arrEntornos) }, 
        success: (resp) => {
          setLoader(false)
          alert.success(resp.message)
          push(PathConstants.tecnologias_admin)
        }, 
        error: (err) => {
          setLoader(false)
          const { message, status } = err;
          (status < 500) && alert.error(message)
        }
      })
    }
  }

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className="flex gap-2"></div>
          <div>
            <div className="grid grid-cols-3 gap-4">
              <Controls.InputComponent
                label="Tecnología"
                name="TECNOLOGIA"
                value={data}
                error={errors}
                onChange={handleInputFormChange}
              />
              <Controls.SearchComponent
                label="Entorno"
                name="ID_ENTORNOS"
                list={listEntornos}
                value={data}
                error={errors}
                onChange={handleInputFormChange}
                zIndex={30}
              />
              <Controls.SelectComponent
                list={estados}
                name="ID_ESTADO"
                value={data}
                label="Estado"
                error={errors}
                onChange={handleInputFormChange}
                zIndex={20}
              />
              <Controls.InputComponent
                name="FILENAME"
                value={data}
                label="Nombre de Archivo"
                error={errors}
                onChange={handleInputFormChange}
              />
              <Controls.SelectComponent
                list={ListConstants.LIST_TIPO_IMAGENES}
                name="FILETYPE"
                value={data}
                label="Tipo de Imagen"
                error={errors}
                onChange={handleInputFormChange}
                zIndex={10}
              />
              <Controls.FileComponent
                label="Logotipo"
                setFiles={setFiles}
                files={files}
                name="IMAGEN"
                value={data}
                setData={setData}
              />
            </div>
            <ButtonsSaveComponent handleBack={() => push(PathConstants.tecnologias_admin)} handleAction={saveOrUpdateEntornos} />
          </div>
        </Controls.CardComponent>
      </div>
    </MainComponent>
  )
}

export const getServerSideProps = async ({ req, params }) => {
  const { id } = params 
  let dataInitial = { TECNOLOGIA: "", ID_ENTORNOS: "", ID_ESTADO: 4, IMAGEN: '', FILENAME: '', FILETYPE: null }
  let dataInitialEntornos = { ID_ENTORNOS: "", ID_ESTADO: 4 }
  let listEntornos = []

  const getEntornos = async () => {
    await SaveRequestData({
      queryId: 53,
      body: dataInitialEntornos,
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => listEntornos = resp.dataList,
      error: (err) => console.error(err)
    })
  }
  
  const searchTecnologia = async () => {
    await ImageRequestData({
      queryId: 54,
      body: { ...dataInitial, ID_TECNOLOGIAS: parseInt(params.id) || null },
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => {
        let strEntornos = Array.from(resp.dataObject.ID_ENTORNOS || [], el => el.value).join(',')
        dataInitial = { ...resp.dataObject, ID_ENTORNOS: strEntornos }
      },
      error: (err) => console.error(err)
    })
  }
  
  try {
    await getEntornos();
    if (isNaN(id)) {
      return { props: { dataInitial, listEntornos } }
    } else {
      await searchTecnologia();
      return { props: { dataInitial, listEntornos } }
    }
  } catch (error) {
    return { props: { dataInitial, listEntornos } }
  }
}