import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useAlert } from "react-alert";
import { useFormValidation } from 'src/hooks/useFormValidation';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import { EnvConstants } from "util/EnvConstants";
import Controls from 'src/components/Controls';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";

export default function PerfilesDetailPage ({ dataInitial }) {
  const validate = (fieldValues = data) =>  {
    let temp = {...errors};
    
    if ("PERFIL" in fieldValues) {
      temp.PERFIL = fieldValues.PERFIL === "" ? "El campo Perfil es requerido" : "";
    } 

    if ("ID_ESTADO" in fieldValues) {
      temp.ID_ESTADO = fieldValues.ID_ESTADO === null ? "El campo Estado es requerido" : "";
    } 
    
    setErrors({...temp});
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === '');
    }
  }
  
  const { push, query } = useRouter()
  const {data, errors, setErrors, handleInputFormChange} = useFormValidation(dataInitial, true, validate);
  const alert = useAlert();
  const estados = useListEstados('4,5');
  const handleBack = () => push("/dashboard/perfiles/admin")
  const { setLoader } = useLoaderContext()

  const handleAction = () => {
    if (validate()) {
      setLoader(true)
      SaveRequestData({
        queryId: 1,
        body: {...data, ID_PERFIL: query.id}, 
        success: (resp) => {
          setLoader(false)
          alert.success(resp.message)
          push("/dashboard/perfiles/admin")
        }, 
        error: (err) => {
         setLoader(false)
         const { message } = err;
         alert.error(message)
       }
     })
    }
  }

  return (
    <MainComponent>
      <div className='columns-1'>
        <Controls.CardComponent zIndex={10} title={"Nuevo"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Nombre" name="PERFIL" onChange={handleInputFormChange} value={data} error={errors} />
              <Controls.SelectComponent list={estados} name="ID_ESTADO" value={data} error={errors} label="Estado" onChange={handleInputFormChange} />
            </div>
            <ButtonsSaveComponent handleBack={handleBack} handleAction={handleAction} />
          </div>
        </Controls.CardComponent>
      </div>
    </MainComponent>
  )
}

export async function getServerSideProps({ req, params }) {
  let dataInitial = { PERFIL: "", ID_ESTADO: 4 }
  let { id } = params
  const getPerfil = async () => {
    await SaveRequestData({
      queryId: 3,
      body: { ID_PERFIL: id }, 
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => {
        dataInitial = resp.dataObject
      }, 
      error: (err) => {
        const { message } = err;
        alert.error(message)
      }
    })
  }

  try {
    await getPerfil()
    return { props: { dataInitial } }
  } catch (error) {
    console.log(error)
  }

}