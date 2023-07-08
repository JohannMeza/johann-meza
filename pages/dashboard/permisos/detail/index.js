import React from "react";
import { useEffect } from "react";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import Controls from "../../../../components/Controls";
import ButtonsSaveComponent from "../../../../components/layout/form/ButtonsSaveComponent";
import { SaveRequestData } from "../../../../helpers/helpRequestBackend";
import { useFormValidation } from "../../../../hooks/useFormValidation";
import useLoaderContext from "../../../../hooks/useLoaderContext";
import { ListConstants } from "../../../../util/ListConstants";
const dataInitial = { PERMISOS: "", ESTADO: true }

export default function PermisosDetailPage() {
  const {data, handleInputFormChange, errors, setData} = useFormValidation(dataInitial)
  const {setLoader} = useLoaderContext();
  const navigate = useNavigate();
  const alert = useAlert()
  const {id} = useParams()
  const handleBack = () => navigate("/dashboard/permisos/admin")

  const handleAction = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 16,
      body: {...data, ID_PERMISOS: id},
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
      body: {ID_PERMISOS: id},
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
    if (id) searchPermiso()
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
