import { useEffect } from 'react';
import { useState } from 'react';
import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useForm } from 'src/hooks/useForm';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import Controls from 'src/components/Controls';
import Icon from 'src/components/icon/Icon';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import MainComponent from 'src/components/layout/dashboard/main/MainComponent';
import PathConstants from 'util/PathConstants';

const dataInitial = { MENU: "", ID_ESTADO: 4, ID_ESTADO_MENU: 6 }
export default function MenuAdminPage () {
  const [data, handleInputChange, resetData] = useForm(dataInitial)
  const [listMenus, setListMenus] = useState([]);
  const { setLoader } = useLoaderContext();
  const { push, query } = useRouter()
  const estados = useListEstados("4,5")
  const estados_menu = useListEstados("7,6");

  const listarMenus = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 6,
      body: data,
      success: (resp) => {
        setLoader(false)
        setListMenus(resp.dataList)
      },
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  useEffect(() => {
    listarMenus()
  }, [])

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Menu" name="MENU" value={data} onChange={handleInputChange} />
              <Controls.SelectComponent label="Tipo Menú" name="ID_ESTADO_MENU" value={data} list={estados_menu} onChange={handleInputChange} />
              <Controls.SelectComponent label="Estado" name="ID_ESTADO" value={data} list={estados} onChange={handleInputChange} />
            </div>
            <div>
              <ButtonsFilterComponent handleClear={resetData} handleFilter={listarMenus} />
            </div>
          </div>
        </Controls.CardComponent>
      </div>
      <div className='margin-base-top-card'>
        <Controls.CardComponent zIndex={1} title={"Menús"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" onClick={() => push(PathConstants.menu_nuevo)} />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th className='text-left'>Id</th>
                  <th className='text-left'>Menu</th>
                  <th className='text-left'>Estado</th>
                  <th className='text-left'>Tipo</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  listMenus.map((el, index) => (
                    <tr key={index}>
                      <td className='text-left'>{el.id_menu}</td>
                      <td className='text-left'>{el.menu}</td>
                      <td className='text-left'>
                        <span className='inline-block'>
                          <Controls.ButtonEstadoComponent
                            title={el.estado}
                            colorButton={{ background: el.color_estado }}
                            colorText={{ color: el.color_estado }}
                          />
                        </span>
                      </td>
                      <td className='text-left'>
                        <span className='inline-block'>
                          <Controls.ButtonEstadoComponent
                            title={el.estado_menu}
                            colorButton={{ background: el.color_estado_menu }}
                            colorText={{ color: el.color_estado_menu }}
                          />
                        </span>
                      </td>
                      <td>
                        <Controls.ButtonIconComponent 
                          title="Editar"
                          onClick={() => push(PathConstants.menu_detail + el.id_menu)}
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