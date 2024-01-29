import { useState } from 'react';
import { useFormValidation } from 'src/hooks/useFormValidation';
import { useAlert } from 'react-alert';
import { FileRequestData, SaveRequestData, SendRequestData, SignUpRequestData } from 'src/helpers/helpRequestBackend';
import { EnvConstants } from 'util/EnvConstants';
import { ListConstants } from 'src/constants/ListConstants';
import Icon from 'src/components/icon/Icon'
import IconAwesome from 'src/components/icon/IconAwesome'
import useLoaderContext from 'src/hooks/useLoaderContext';
import Controls from 'src/components/Controls';
import useAuthContext from "src/hooks/useAuthContext";
import MainComponent from "src/components/layout/dashboard/main/MainComponent";

export default function PerfilAdminPage({ dataOriginal, dataNetworks, datosPersonales, datosSeguridad }) {
  const validateDataPersonal = (fieldValues = dataPersonal) =>  {
    let temp = {...errorsDataPersonal};
    
    if ("NOMBRE" in fieldValues) {
      temp.NOMBRE = fieldValues.NOMBRE === "" ? "El campo Nombre es requerido" : "";
    } 

    if ("APELLIDO" in fieldValues) {
      temp.APELLIDO = fieldValues.APELLIDO === "" ? "El campo Apellido es requerido" : "";
    } 

    if ("FECHA_NACIMIENTO" in fieldValues) {
      temp.FECHA_NACIMIENTO = fieldValues.FECHA_NACIMIENTO === "" ? "El campo Fecha de Nacimiento es requerido" : "";
    } 
    
    setErrorsDataPersonal({...temp});
    if (fieldValues === dataPersonal) {
      return Object.values(temp).every((x) => x === '');
    }
  }

  const validateDataSeguridad = (fieldValues = dataSeguridad) =>  {
    let temp = {...errorsDataSeguridad};
    
    if ("USER" in fieldValues) {
      temp.USER = fieldValues.USER === "" ? "El campo Usuario es requerido" : "";
    } 
    
    setErrorsDataSeguridad({...temp});
    if (fieldValues === dataSeguridad) {
      return Object.values(temp).every((x) => x === '');
    }
  }
  
  const {
    data: dataPersonal,
    handleInputFormChange: handleInputFormPersonal,
    errors: errorsDataPersonal,
    setErrors: setErrorsDataPersonal,
    setData: setDataPersonal
  } = useFormValidation(datosPersonales, true, validateDataPersonal)
  
  const {
    data: dataSeguridad,
    handleInputFormChange: handleInputFormSeguridad,
    errors: errorsDataSeguridad,
    setErrors: setErrorsDataSeguridad,
    setData: setDataSeguridad
  } = useFormValidation(datosSeguridad, true, validateDataSeguridad)

  const [files, setFiles] = useState([])
  const [networks, setNetworks] = useState(dataNetworks)
  const [originalData, setOriginalData] = useState(dataOriginal);
  const {setLoader} = useLoaderContext(); 
  const {user} = useAuthContext()
  const alert = useAlert()

  const RequestDataUser = (value, dataSave) => {
    if (dataSave.PORTADA || files.length === 0) {
      setLoader(true) 
      SaveRequestData({
        queryId: 40,
        body: {  ...dataSave, TIPO_DATA: value, IMAGEN: !dataSave.IMAGEN ? null : 'no-delete' }, 
        success: (resp) => {
          setLoader(false)
          alert.success(resp.message)
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
        queryId: 40,
        path: EnvConstants.REACT_APP_URL_UPLOAD_LOCAL,
        body: { ...dataSave, NETWORKS: JSON.stringify(dataSave.NETWORKS), TIPO_DATA: value, IMAGEN: files[0].file }, 
        success: (resp) => {
          setLoader(false)
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

  const RequestAuthUser = async (value, dataSave) => {
    setLoader(true) 
    SignUpRequestData({
      queryId: 41,
      body: dataSave,
      success: (resp) => {
        setLoader(false)
        alert.success(resp.message)
      }, 
      error: (err) => {
       setLoader(false)
       const { message } = err;
       alert.error(message)
     }
    })
  }

  const handleClickAddNetwork = () => {
    const arrNetworks = [...networks];
    if ([...networks].length >= 5) return alert.info("Solo puedes ingresar 5 redes sociales")    
    const objNetwork = { DISABLED: false, RED_SOCIAL: null, LINK: '', ORDEN: networks?.shift()?.ORDEN + 1 || 10 }
    arrNetworks.unshift(objNetwork)
    setNetworks([...arrNetworks]);
  }

  const handleClickDeleteNetwork = (index) => {
    const arrNetworks = networks;
    arrNetworks.splice(index, 1)
    setNetworks([...arrNetworks])
  }

  const handleClickEditarNetwork = (index) => {
    const arrNetworks = networks;
    arrNetworks[index] = { ...arrNetworks[index], DISABLED: false }
    setNetworks([...arrNetworks])
  }

  const handleChangeNetwork = (e, index) => {
    const { name, value } = e.target
    const arrNetworks = networks;

    if (name === 'RED_SOCIAL') {
      const arrRedSocial = Array.from(networks.filter(el => (el.RED_SOCIAL) && el.RED_SOCIAL), el => el.RED_SOCIAL);
      if (arrRedSocial.includes(value)) return alert.info('Ya esta agregado esta Red Social')
      else arrNetworks[index] = { ...arrNetworks[index], [name]: value } 
    } else {
      arrNetworks[index] = { ...arrNetworks[index], [name]: value }
    }
    
    setNetworks([...arrNetworks])
  }

  const handleSave = (value) => {
    if (value === 1) {
      if (validateDataPersonal()) RequestDataUser(value, { ...dataPersonal })
      else return;
    } else if (value === 2) {
      RequestDataUser(value, { NETWORKS: networks.reverse() })
    } else if (value === 3) {
      if (validateDataSeguridad()) RequestAuthUser(value, {...dataSeguridad, ID_USUARIOS: user.ID_USUARIOS})
      else return;
    }
  }

  const handleRestablecerPersonal = () => setDataPersonal(originalData.DATA_PERSONAL)
  const handleRestablecerNetworks = () => setNetworks(originalData.NETWORKS)
  const handleRestablecerSeguridad = () => setDataSeguridad(originalData.DATA_SEGURIDAD)

  return (
    <MainComponent>
      <div className='grid sm:grid-cols-[350px_minmax(300px,_1fr)] gap-4'>
        <Controls.CardComponent zIndex={10} title={"Foto de Perfil"}>
          <div className='flex gap-2'></div>
          <div>
            <Controls.FileComponent
              setFiles={setFiles}
              files={files}
              name="IMAGEN"
              value={dataPersonal}
              setData={setDataPersonal}
            />
            <div className='flex justify-between items-end mt-3'>
              <h4 className='text-text text-title-3 font-semibold font-Poppins'>{ dataPersonal?.NOMBRE } { dataPersonal?.APELLIDO }</h4>
              <span className='text-test text-paragraph-2 font-Poppins'>{ dataPersonal?.PERFIL }</span>
            </div>
            <div className='flex justify-between items-start'>
              <div className='flex gap-1'>
                {
                  networks.map((el, index) => (
                    el.RED_SOCIAL === 'facebook'
                      ? <a href={el.LINK} rel="noreferrer" target='_blank' key={index}><Controls.ButtonIconComponent icon={IconAwesome.FACEBOOK} /></a>
                      : el.RED_SOCIAL === 'twitter'
                        ? <a href={el.LINK} rel="noreferrer" target='_blank' key={index}><Controls.ButtonIconComponent icon={IconAwesome.TWITTER} /></a>
                        : el.RED_SOCIAL === 'youtube'
                          ? <a href={el.LINK} rel="noreferrer" target='_blank' key={index}><Controls.ButtonIconComponent icon={IconAwesome.YOUTUBE} /></a>
                          : null
                  ))
                }
              </div>
              <span className='text-test text-paragraph-2 font-Poppins'>{ dataPersonal?.EDAD?.split(' ')[0] } años</span>
            </div>

            <hr className='mt-3 mb-3' />
             
            <p className='text-text text-paragraph-3 text-justify'>{dataPersonal.DESCRIPCION}</p>
          </div>
        </Controls.CardComponent>
        
        <div className='flex flex-col gap-4'>
          <Controls.CardComponent zIndex={10} title={"Datos Personales"}>
            <div className='flex gap-2'></div>
            <div>
              <div className='grid grid-cols-2 gap-4'>
                <Controls.InputComponent label="Nombre" name="NOMBRE" onChange={handleInputFormPersonal} value={dataPersonal} error={errorsDataPersonal} />
                <Controls.InputComponent label="Apellido" name="APELLIDO" onChange={handleInputFormPersonal} value={dataPersonal} error={errorsDataPersonal} />
                <Controls.InputComponent label="Fecha de Nacimiento" type="date" name="FECHA_NACIMIENTO" onChange={handleInputFormPersonal} value={dataPersonal} error={errorsDataPersonal} />
                <Controls.InputComponent label="Pais" name="PAIS" onChange={handleInputFormPersonal} value={dataPersonal} error={errorsDataPersonal} />
                <Controls.InputComponent label="Ciudad" name="CIUDAD" onChange={handleInputFormPersonal} value={dataPersonal} error={errorsDataPersonal} />
                <Controls.InputComponent label="Descripción" name="DESCRIPCION" onChange={handleInputFormPersonal} value={dataPersonal} error={errorsDataPersonal} textarea />
              </div>
              <div className='flex gap-4 mt-4'>
                <Controls.ButtonComponent title='RESTABLECER' className='color-secondary' onClick={handleRestablecerPersonal} />
                <Controls.ButtonComponent title='GUARDAR CAMBIOS' className='color-primary' onClick={() => handleSave(1)} />
              </div>
            </div>
          </Controls.CardComponent>
          <Controls.CardComponent zIndex={9} title={"Datos de Contacto"}>
            <div className='flex gap-2'></div>
            <div>
              <div className='flex flex-col gap-4'>
                {
                  networks.map((el, index) => (
                    <div key={index} className={`flex gap-4 relative`} style={{ zIndex: el.ORDEN }}>
                      <Controls.SelectComponent label='Red Social' className='w-2/4' name='RED_SOCIAL' disabled={el.DISABLED} list={ListConstants.LIST_NETWORK} value={el} onChange={(e) => handleChangeNetwork(e, index)} />
                      <Controls.InputComponent label='Link' name='LINK' value={el} disabled={el.DISABLED} onChange={(e) => handleChangeNetwork(e, index)} />
                      
                      <div className='flex gap-4 mt-5'>
                        <Controls.ButtonIconComponent title='Eliminar' className='color-secondary' onClick={() => handleClickDeleteNetwork(index)} icon={<Icon.Delete />} />
                        <Controls.ButtonIconComponent title='Editar' onClick={() => handleClickEditarNetwork(index)} icon={<Icon.Edit />} />
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className='flex gap-4 mt-4'>
                <Controls.ButtonComponent title='AÑADIR' className='color-secondary' onClick={handleClickAddNetwork} />
                <Controls.ButtonComponent title='RESTABLECER' className='color-secondary' onClick={handleRestablecerNetworks} />
                <Controls.ButtonComponent title='GUARDAR CAMBIOS' className='color-primary' onClick={() => handleSave(2)} />
              </div>
            </div>
          </Controls.CardComponent>
          <Controls.CardComponent zIndex={8} title={"Datos de Usuario"}>
            <div className='flex gap-2'></div>
            <div>
              <div className='grid grid-cols-2 gap-4'>
                <Controls.InputComponent label="Usuario" name="USER" onChange={handleInputFormSeguridad} value={dataSeguridad} error={errorsDataSeguridad} />
                <Controls.InputComponent label="Contraseña" name="PASSWORD" onChange={handleInputFormSeguridad} value={dataSeguridad} error={errorsDataSeguridad} />
              </div>
              <div className='flex gap-4 mt-4'>
                <Controls.ButtonComponent title='RESTABLECER' className='color-secondary' onClick={handleRestablecerSeguridad} />
                <Controls.ButtonComponent title='GUARDAR CAMBIOS' className='color-primary' onClick={() => handleSave(3)} />
              </div>
            </div>
          </Controls.CardComponent>
        </div>
      </div>
    </MainComponent>
  )
}

export async function getServerSideProps({ req }) {
  let dataOriginal = {}
  let dataNetworks = []
  let datosPersonales = { NOMBRE: "", APELLIDO: "", FECHA_NACIMIENTO: "", DESCRIPCION: "", IMAGEN: "", PAIS: "", CIUDAD: "" }
  let datosSeguridad = { USER: "", PASSWORD: "" }

  const getUsuario = async () => {
    await SendRequestData({
      queryId: 39,
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      path: EnvConstants.REACT_APP_URL_CUSTOMIZE_PROFILE,
      success: (resp) => {
        dataOriginal = resp.dataObject
        dataNetworks = resp.dataObject.NETWORKS
        datosPersonales = resp.dataObject.DATA_PERSONAL
        datosSeguridad = resp.dataObject.DATA_SEGURIDAD
      }, 
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  
  try {
    await getUsuario()
    return { props: { dataOriginal, dataNetworks, datosPersonales, datosSeguridad } }
  } catch (error) {
    console.error(error)
  }

}