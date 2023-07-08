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
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import PathConstants from "util/PathConstants";

const dataInitial = { CATEGORIAS: "", ESTADO: 4 }
export default function CategoriasAdminPage() {
  const {push} = useRouter()
  const [categorias, setCategorias] = useState([])
  const [data, handleInputChange, resetData] = useForm(dataInitial)
  const { setLoader } = useLoaderContext()
  const estados = useListEstados('4,5')

  const listCategorias = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 23,
      body: data,
      success: (resp) => {
        setLoader(false)
        setCategorias(resp.dataList)
      },
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  useEffect(() => {
    listCategorias()
  }, [])
  
  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Categorias" name="CATEGORIAS" value={data} onChange={handleInputChange} />
              <Controls.SelectComponent label="Estado" name="ESTADO" value={data} list={estados} onChange={handleInputChange} />
            </div>
            <div>
              <ButtonsFilterComponent handleClear={resetData} handleFilter={listCategorias} />
            </div>
          </div>
        </Controls.CardComponent>
      </div>
      <div className='margin-base-top-card'>
        <Controls.CardComponent zIndex={1} title={"Categorias"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" onClick={() => push(PathConstants.categorias_nuevo)} />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th className='text-left'>Id</th>
                  <th className='text-left'>Categorias</th>
                  <th className='text-left'>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  categorias.map((el, index) => (
                    <tr key={index}>
                      <td className='text-left'>{el.id_categorias}</td>
                      <td className='text-left'>{el.categoria}</td>
                      <td className='text-left'>{el.estado ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <Controls.ButtonIconComponent 
                          title="Editar"
                          onClick={() => push(PathConstants.categorias_detail + el.id_categorias)}
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