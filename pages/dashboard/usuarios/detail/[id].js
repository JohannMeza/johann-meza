import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { SaveRequestData, SignUpRequestData } from "src/helpers/helpRequestBackend";
import { useFormValidation } from "src/hooks/useFormValidation";
import { useListEstados } from "src/hooks/useListEstados";
import { ListConstants } from "src/constants/ListConstants";
import { useRouter } from "next/router";
import { EnvConstants } from 'util/EnvConstants';
import PathConstants from "util/PathConstants";
import useLoaderContext from "src/hooks/useLoaderContext";
import Controls from "src/components/Controls";
import Icon from "src/components/icon/Icon";
import ButtonsSaveComponent from "src/components/form/button/ButtonsSaveComponent";
import MainComponent from "src/components/layout/dashboard/main/MainComponent";

export default function UsuariosDetailPage({dataInitial, perfiles}) {
  const [statePass, setStatePass] = useState(false);

  const validate = (fieldValues = data) => {
    let temp = { ...errors };

    if ("NOMBRE" in fieldValues) temp.NOMBRE = !fieldValues.NOMBRE ? "El campo Nombre es requerido" : "";
    if ("APELLIDO" in fieldValues) temp.APELLIDO = !fieldValues.APELLIDO ? "El campo APELLIDO es requerido" : "";
    if ("EMAIL" in fieldValues) temp.EMAIL = !fieldValues.EMAIL ? "El campo Email es requerido" : "";
    if ("ESTADO" in fieldValues) temp.ESTADO = fieldValues.ESTADO === null ? "El campo Contraseña es requerido" : "";
    if ("ID_PERFILES" in fieldValues) temp.ID_PERFILES = fieldValues.ID_PERFILES === null ? "El campo Perfil es requerido" : "";

    setErrors({ ...temp });
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === "");
    }
  };

  const { data, errors, setErrors, handleInputFormChange } = useFormValidation(dataInitial, true, validate);
  const { push, query } = useRouter()
  const {setLoader} = useLoaderContext();
  const estados = useListEstados('4,5')
  const alert = useAlert();
  const saveUsuario = () => {
    if (validate()) {
      setLoader(true)
      SignUpRequestData({
        queryId: 8,
        body: {...data, ID_USUARIO: query?.postId},
        success: (resp) => {
          setLoader(false)
          alert.success(resp.message)
          push(PathConstants.usuarios_admin)
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
      <Controls.CardComponent title={"Nuevo"}>
        <div className="flex gap-2"></div>
        <div>
          <div className="grid grid-cols-3 gap-4">
            <Controls.SelectComponent
              label="Perfiles"
              list={perfiles}
              value={data}
              name="ID_PERFILES"
              error={errors}
              onChange={handleInputFormChange}
            />
            <Controls.InputComponent
              label="Nombre"
              name="NOMBRE"
              value={data}
              onChange={handleInputFormChange}
              error={errors}
            />
            <Controls.InputComponent
              label="Apellido"
              name="APELLIDO"
              value={data}
              onChange={handleInputFormChange}
              error={errors}
            />
            <Controls.InputComponent
              label="Email"
              name="EMAIL"
              value={data}
              autocomplete="off"
              onChange={handleInputFormChange}
              error={errors}
              />
            <Controls.InputComponent
              label="Contraseña"
              name="PASSWORD"
              value={data}
              onChange={handleInputFormChange}
              autocomplete="new-password"
              icon={statePass ? <Icon.EyeSlash /> : <Icon.Eye />}
              onClickIcon={() => setStatePass((statePass) => !statePass)}
              type={statePass ? "text" : "password"}
              placeholder="Nueva Contraseña"
              />
            <Controls.SelectComponent 
              label="Estado"
              list={estados}
              value={data}
              name="ID_ESTADO"
              error={errors}
              onChange={handleInputFormChange}
            />
          </div>
        </div>
      </Controls.CardComponent>

      <ButtonsSaveComponent handleBack={() => push(PathConstants.usuarios_admin)} handleAction={saveUsuario} />
    </MainComponent>
  );
}

export async function getServerSideProps({ req, params }) {
  let dataInitial = { NOMBRE: "", APELLIDO: "", EMAIL: "", PASSWORD: "", ID_ESTADO: 4, ID_PERFILES: null };
  let perfiles = []
  let { id } = params;
  
  const searchUsuario = async () => {
    await SaveRequestData({
      queryId: 10,
      body: {ID_USUARIO: id}, 
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

  const listPerfiles = async () => {
    await SaveRequestData({
      queryId: 11,
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => {
        perfiles = [ListConstants.LIST_VACIO, ...resp.dataList]
      }, 
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  
  try {
    if (isNaN(id)) {
      return { props: { dataInitial, perfiles } }
    } else {
      await listPerfiles()
      await searchUsuario()
      return { props: { dataInitial, perfiles } }
    }
  } catch (error) {
    console.error(error)
  }
}