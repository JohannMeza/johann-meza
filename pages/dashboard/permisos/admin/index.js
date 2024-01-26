import { useEffect } from "react";
import { useState } from "react";
import { SaveRequestData } from "src/helpers/helpRequestBackend";
import { useForm } from "src/hooks/useForm";
import { ListConstants } from "src/constants/ListConstants";
import Controls from "src/components/Controls";
import Icon from "src/components/icon/Icon";
import ButtonsFilterComponent from "src/components/form/button/ButtonsFilterComponent";
import useLoaderContext from "src/hooks/useLoaderContext";
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import { useRouter } from "next/router";

const dataInitial = { PERMISOS: "", ESTADO: true }

export default function PermisosAdminPage() {
  const [data, handleInputChange, resetData] = useForm(dataInitial);
  const [permisos, setPermisos] = useState([]);
  const { setLoader } = useLoaderContext();
  const { push } = useRouter()

  const listPermisos = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 17,
      body: data,
      success: (resp) => {
        setLoader(false)
        setPermisos(resp.dataList)
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  useEffect(() => {
    listPermisos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Permiso" value={data} name="PERMISOS" onChange={handleInputChange} />
              <Controls.SelectComponent list={ListConstants.LIST_ESTADOS} name="ESTADO" value={data} label="Estado" onChange={handleInputChange} />
            </div>
            <ButtonsFilterComponent handleClear={resetData} handleFilter={listPermisos} />
          </div>
        </Controls.CardComponent>
      </div>
      <div className='margin-base-top-card'>
        <Controls.CardComponent zIndex={1} title={"Permisos"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" onClick={() => push("/dashboard/permisos/nuevo")} />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Perfil</th>
                  <th>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {permisos.map((el, index) => (
                  <tr key={index}>
                    <td>{el.id_permisos}</td>
                    <td>{el.permiso}</td>
                    <td>{el.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <div className='flex gap-2 justify-center'>
                        <Controls.ButtonIconComponent title="Editar" icon={<Icon.Edit />} onClick={() => push(`/dashboard/permisos/${el.id_permisos}`)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Controls.TableComponent>
          </div>
        </Controls.CardComponent>
      </div>
    </MainComponent>
  );
}
