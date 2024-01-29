import { useFormValidation } from 'src/hooks/useFormValidation';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import { SaveRequestData } from "/src/helpers/helpRequestBackend";
import { useAlert } from 'react-alert';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import Controls from 'src/components/Controls';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import { EnvConstants } from 'util/EnvConstants';
import useLoaderContext from "src/hooks/useLoaderContext";
import PathConstants from 'util/PathConstants';

export default function EntornosDetailPage({ dataInitial }) {
  const validate = (fieldValues = data) => {
    let temp = { ...errors };

    if ("ENTORNO" in fieldValues) {
      temp.ENTORNO = fieldValues.ENTORNO === "" ? "El campo Entorno es requerido" : "";
    }

    if ("ID_ESTADO" in fieldValues) {
      temp.ID_ESTADO = !fieldValues.ID_ESTADO ? "El campo Estado es requerido" : "";
    }

    setErrors({ ...temp });
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === "");
    }
  }
  
  const { data, handleInputFormChange, errors, setErrors } = useFormValidation(dataInitial, true, validate)
  const { push, query } = useRouter();
  const { setLoader } = useLoaderContext()
  const alert = useAlert();
  const estados = useListEstados('4,5')

  const saveOrUpdateEntornos = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 49,
      body: { ...data, ID_ENTORNOS: parseInt(query.id) || null },
      success: (resp) => {
        setLoader(false)
        alert.success(resp.message)
        push(PathConstants.entornos_admin)
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
          <div className="flex gap-2"></div>
          <div>
            <div className="grid grid-cols-3 gap-4">
              <Controls.InputComponent
                label="Entorno"
                name="ENTORNO"
                value={data}
                error={errors}
                onChange={handleInputFormChange}
                />
              <Controls.SelectComponent
                list={estados}
                name="ID_ESTADO"
                value={data}
                label="Estado"
                error={errors}
                onChange={handleInputFormChange}
              />
            </div>
            <ButtonsSaveComponent handleBack={() => push(PathConstants.entornos_admin)} handleAction={saveOrUpdateEntornos} />
          </div>
        </Controls.CardComponent>
      </div>
    </MainComponent>
  )
}

export const getServerSideProps = async ({ req, params }) => {
  let dataInitial = { ENTORNO: "", ID_ESTADO: 4 }

  const searchEntornos = async () => {
    await SaveRequestData({
      queryId: 50,
      body: { ...dataInitial, ID_ENTORNOS: parseInt(params.id) || null },
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => dataInitial = resp.dataObject,
      error: (err) => console.error(err)
    })
  }
  
  try {
    await searchEntornos();
    return { props: { dataInitial } }
    
  } catch (error) {
    console.error(error)
    return { props: { dataInitial } }
  }
}