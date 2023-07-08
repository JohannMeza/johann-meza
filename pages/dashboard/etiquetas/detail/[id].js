import { useAlert } from 'react-alert';
import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useFormValidation } from 'src/hooks/useFormValidation';
import { ListConstants } from 'src/constants/ListConstants';
import { useRouter } from 'next/router';
import { EnvConstants } from 'util/EnvConstants';
import Controls from 'src/components/Controls';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import PathConstants from 'util/PathConstants';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";

export default function EtiquetasDetailPage({ dataInitial }) {
  const validate = (fieldValues = data) =>  {
    let temp = {...errors};
    
    if ("MENU" in fieldValues) {
      temp.MENU = fieldValues.MENU === "" ? "El campo Menú es requerido" : "";
    } 

    if ("ORDEN" in fieldValues) {
      temp.ORDEN = fieldValues.ORDEN === "" ? "El campo Orden es requerido" : "";
    } 

    if ("ESTADO" in fieldValues) {
      temp.ESTADO = fieldValues.ESTADO === null ? "El campo Estado es requerido" : "";
    } 

    if ("TIPO" in fieldValues) {
      temp.TIPO = fieldValues.TIPO === null ? "El campo Tipo Menú es requerido" : "";
    } 

    if ("RUTA" in fieldValues) {
      temp.RUTA = !fieldValues.RUTA && data.TIPO ? "El campo Ruta es requerido" : "";
    } 
    
    setErrors({...temp});
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === '');
    }
  }

  const { push, query } = useRouter();
  const { data, handleInputFormChange, errors, setErrors } = useFormValidation(dataInitial, true, validate)
  const { setLoader } = useLoaderContext();
  const alert = useAlert();

  const saveEtiqueta = () => {
    setLoader(true) 
    SaveRequestData({
      queryId: 24,
      body: { ...data, id_etiquetas: query.id}, 
      success: (resp) => {
        setLoader(false)
        push(PathConstants.etiquetas_admin)
        alert.success(resp.message)
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }


  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Etiqueta" name="ETIQUETAS" value={data} onChange={handleInputFormChange} />
              <Controls.SelectComponent label="Estado" name="ESTADO" list={ListConstants.LIST_ESTADOS} value={data} onChange={handleInputFormChange} />
            </div>
          </div>
        </Controls.CardComponent>
      </div>

      <ButtonsSaveComponent handleBack={() => push(PathConstants.etiquetas_admin)} handleAction={saveEtiqueta} />
    </MainComponent>
  )
}

export async function getServerSideProps({ req, params }) {
  const { id } = params;
  let dataInitial = { ETIQUETAS: "", ESTADO: true }
  
  const searchEtiquetas = async () => {
    await SaveRequestData({
      queryId: 26,
      body: { id_etiquetas: id },
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } }, 
      success: (resp) => {
        dataInitial = resp.dataObject
      }, 
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  
  try {
    await searchEtiquetas()
    return { props: { dataInitial } }
  } catch (error) {
    
  }
}