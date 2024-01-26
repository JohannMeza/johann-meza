import { useEffect, useState } from 'react';
import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useForm } from 'src/hooks/useForm';
import { ListConstants } from 'src/constants/ListConstants';
import { useRouter } from 'next/router';
import PathConstants from 'util/PathConstants';
import Controls from 'src/components/Controls';
import Icon from 'src/components/icon/Icon';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";

const dataInitial = { ETIQUETAS: "", ESTADO: true }
export default function EtiquetasAdminPage() {
  const [etiquetas, setEtiquetas] = useState([])
  const [data, handleInputChange, resetData] = useForm(dataInitial)
  const { setLoader } = useLoaderContext()
  const { push } = useRouter();

  const listEtiquetas = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 25,
      body: data,
      success: (resp) => {
        setLoader(false)
        setEtiquetas(resp.dataList)
      },
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { listEtiquetas() }, [])
  
  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Etiqueta" name="ETIQUETAS" value={data} onChange={handleInputChange} />
              <Controls.SelectComponent label="Estado" name="ESTADO" value={data} list={ListConstants.LIST_ESTADOS} onChange={handleInputChange} />
            </div>
            <div>
              <ButtonsFilterComponent handleClear={resetData} handleFilter={listEtiquetas} />
            </div>
          </div>
        </Controls.CardComponent>
      </div>
      <div className='margin-base-top-card'>
        <Controls.CardComponent zIndex={1} title={"Etiquetas"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" onClick={() => push(PathConstants.etiquetas_nuevo)} />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th className='text-left'>Id</th>
                  <th className='text-left'>Etiquetas</th>
                  <th className='text-left'>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  etiquetas.map((el, index) => (
                    <tr key={index}>
                      <td className='text-left'>{el.id_etiquetas}</td>
                      <td className='text-left'>{el.etiqueta}</td>
                      <td className='text-left'>{el.estado ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <Controls.ButtonIconComponent 
                          title="Editar"
                          onClick={() => push(PathConstants.etiquetas_detail + el.id_etiquetas)}
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