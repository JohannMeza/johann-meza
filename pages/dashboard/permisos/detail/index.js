import { useEffect } from "react";
import { useAlert } from "react-alert";
import { SaveRequestData } from "src/helpers/helpRequestBackend";
import { useFormValidation } from "src/hooks/useFormValidation";
import { ListConstants } from "src/constants/ListConstants";
import Controls from "src/components/Controls";
import ButtonsSaveComponent from "src/components/form/button/ButtonsSaveComponent";
import useLoaderContext from "src/hooks/useLoaderContext";
import { useRouter } from "next/router";
const dataInitial = { PERMISOS: "", ESTADO: true }

export default function PermisosDetailPage() {
  const {data, handleInputFormChange, errors, setData} = useFormValidation(dataInitial)
  const {setLoader} = useLoaderContext();
  const { push, query } = useRouter()
  const alert = useAlert()
  const handleBack = () => push("/dashboard/permisos/admin")

  const handleAction = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 16,
      body: {...data, ID_PERMISOS: query.id},
      success: (resp) => {
        setLoader(false)
        alert.success(resp.message)
        handleBack()
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  const searchPermiso = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 18,
      body: {ID_PERMISOS: query.id},
      success: (resp) => {
        setLoader(false)
        setData(resp.dataObject)
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  useEffect(() => {
    if (query.id) searchPermiso()
  }, [])

  return (
    <div>
      <div>
        <Controls.CardComponent zIndex={10} title={"Nuevo"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Nombre" name="PERMISOS" onChange={handleInputFormChange} value={data} error={errors} />
              <Controls.SelectComponent list={ListConstants.LIST_ESTADOS} name="ESTADO" value={data} error={errors} label="Estado" onChange={handleInputFormChange} />
            </div>
          </div>
        </Controls.CardComponent>
      </div>

      <ButtonsSaveComponent handleBack={handleBack} handleAction={handleAction} />
    </div>
  );
};
