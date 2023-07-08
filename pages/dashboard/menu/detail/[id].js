import { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useFormValidation } from 'src/hooks/useFormValidation';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import Controls from 'src/components/Controls';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import PathConstants from 'util/PathConstants'
import MainComponent from 'src/components/layout/dashboard/main/MainComponent';
import { EnvConstants } from 'util/EnvConstants';

export default function MenuDetailPage ({ dataInitial, listMenuPadre }) {
  const validate = (fieldValues = data) =>  {
    let temp = {...errors};
    
    if ("MENU" in fieldValues) {
      temp.MENU = fieldValues.MENU === "" ? "El campo Menú es requerido" : "";
    } 

    if ("ORDEN" in fieldValues) {
      temp.ORDEN = fieldValues.ORDEN === "" ? "El campo Orden es requerido" : "";
    } 

    if ("ID_ESTADO" in fieldValues) {
      temp.ESTADO = fieldValues.ESTADO === null ? "El campo Estado es requerido" : "";
    } 

    if ("COMPONENTE" in fieldValues) {
      temp.COMPONENTE = !fieldValues.RUTA && data.TIPO ? "El campo Componente es requerido" : "";
    } 

    if ("ID_ESTADO_MENU" in fieldValues) {
      temp.ID_ESTADO_MENU = fieldValues.ID_ESTADO_MENU === null ? "El campo Estado Menú es requerido" : "";
    } 

    if ("RUTA" in fieldValues) {
      temp.RUTA = !fieldValues.RUTA && data.TIPO ? "El campo Ruta es requerido" : "";
    } 
    
    setErrors({...temp});
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === '');
    }
  }
  const { data, setData, errors, setErrors, handleInputFormChange } = useFormValidation(dataInitial, true, validate);
  const { setLoader } = useLoaderContext();
  const { push } = useRouter()
  const [menuPadre] = useState(listMenuPadre);
  const estados = useListEstados("4,5");
  const estados_menu = useListEstados("7,6");
  const alert = useAlert();
  
  const handleSave = () => {
    if (validate()) {
      setLoader(true) 
      SaveRequestData({
        queryId: 4,
        body: data, 
        success: (resp) => {
          setLoader(false)
          push(PathConstants.menu_admin)
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

  useEffect(() => {
    if (data.ID_ESTADO_MENU === 6) setData((data) => { return { ...data, RUTA: "", COMPONENTE: "" } })  
  }, [data.ID_ESTADO_MENU])

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Nuevo"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Menú" zIndex={10} name="MENU" value={data} onChange={handleInputFormChange} error={errors} />
              <Controls.SelectComponent search={true} label="Menu Padre" zIndex={8} name="MENU_PADRE" list={menuPadre} type="number" value={data} onChange={handleInputFormChange} className="relative z-20" />
              <Controls.SelectComponent label="Tipo" zIndex={7} name="ID_ESTADO_MENU" list={estados_menu} value={data} onChange={handleInputFormChange} error={errors} />
              <Controls.InputComponent label="Ruta" zIndex={6} name="RUTA" value={data} disabled={data?.ID_ESTADO_MENU === 6 && true} onChange={handleInputFormChange} error={errors} />
              <Controls.InputComponent label="Componente" zIndex={5} name="COMPONENTE" value={data} disabled={data?.ID_ESTADO_MENU === 6 && true} onChange={handleInputFormChange} error={errors} />
              <Controls.InputComponent label="Orden" zIndex={4} type='number' name="ORDEN" value={data} onChange={handleInputFormChange} error={errors} />
              <Controls.InputComponent label="Icon" zIndex={3} name="ICON" value={data} onChange={handleInputFormChange} />
              <Controls.SelectComponent label="Estado" zIndex={2} name="ID_ESTADO" value={data} list={estados} onChange={handleInputFormChange} error={errors} className="relative z-10" />
            </div>
          </div>
        </Controls.CardComponent>
      </div>

      <div>
        <ButtonsSaveComponent handleBack={() => push(PathConstants.menu_admin)} handleAction={handleSave} />
      </div>
    </MainComponent>
  )
}

export async function getServerSideProps({ req, params }) {
  let dataInitial = { MENU_PADRE: null, MENU: "", ORDEN: "", ICON: "", ID_ESTADO: 4, ID_ESTADO_MENU: 6, RUTA: "", COMPONENTE: null }
  let listMenuPadre = [{ value: null, label: "Seleccione" }];
  let { id } = params;

  const searchMenu = async () => {
    await SaveRequestData({
      queryId: 7,
      body: { ID_MENU: id }, 
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => dataInitial = resp.dataObject, 
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  const listarMenusPadres = async () => {
    await SaveRequestData({
      queryId: 5,
      body: { ID_MENU: id }, 
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => listMenuPadre = [...listMenuPadre, ...resp.dataList],
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  
  try {
    await listarMenusPadres()
    await searchMenu()
    return { props: { dataInitial, listMenuPadre } }
  } catch (error) {
    console.log(error)
  }

  return { props: {  } }
}