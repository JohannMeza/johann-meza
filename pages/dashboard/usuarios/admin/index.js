import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAlert } from 'react-alert';
import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useForm } from 'src/hooks/useForm';
import { useListEstados } from 'src/hooks/useListEstados';
import Controls from 'src/components/Controls';
import Icon from 'src/components/icon/Icon';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import PathConstants from 'util/PathConstants';

const dataInitial = { NOMBRE: "", EMAIL: "", ID_ESTADO: 4 }

export default function UsuariosAdminPage () {
  const {push} = useRouter()
  const {setLoader} = useLoaderContext()
  const [data, handleInputFormChange, resetData] = useForm(dataInitial)
  const [usuarios, setUsuarios] = useState([])
  const estados = useListEstados('4,5')
  const alert = useAlert()
  const listUsuarios = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 9,
      body: data,
      success: (resp) => {
        setLoader(false)
        setUsuarios(resp.dataList)
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { listUsuarios() }, [])

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Nombre" value={data} onChange={handleInputFormChange} name="NOMBRE" />
              <Controls.InputComponent label="Email" value={data} onChange={handleInputFormChange} name="EMAIL" />
              <Controls.SelectComponent label="Estado" value={data} list={estados} onChange={handleInputFormChange} name="ID_ESTADO" />
            </div>
            <ButtonsFilterComponent handleClear={resetData} handleFilter={listUsuarios} />
          </div>
        </Controls.CardComponent>
      </div>
      <div className='margin-base-top-card'>
        <Controls.CardComponent zIndex={1} title={"Usuarios"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" onClick={() => push(PathConstants.usuarios_nuevo)} />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th className='text-left'>Id</th>
                  <th className='text-left'>Nombre</th>
                  <th className='text-left'>Apellido</th>
                  <th className='text-left'>Email</th>
                  <th className='text-left'>Estado</th>
                  <th className='text-center'>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  usuarios.map((el, index) => (
                    <tr key={index}>
                      <td className='text-left'>{el.ID_USUARIOS}</td>
                      <td className='text-left'>{el.NOMBRE}</td>
                      <td className='text-left'>{el.APELLIDO}</td>
                      <td className='text-left'>{el.EMAIL}</td>
                      <td className='text-left'>
                      <span className='inline-block'>
                          <Controls.ButtonEstadoComponent
                            title={el.ESTADO}
                            colorButton={{ background: el.COLOR }}
                            colorText={{ color: el.COLOR }}
                          />
                        </span>
                      </td>
                      <td>
                        <Controls.ButtonIconComponent 
                          title='Editar'
                          onClick={() => push(PathConstants.usuarios_detail + el.ID_USUARIOS)}
                          icon={<Icon.Edit />}
                        />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Controls.TableComponent>
          </div>
        </Controls.CardComponent>
      </div>
    </MainComponent>
  )
}