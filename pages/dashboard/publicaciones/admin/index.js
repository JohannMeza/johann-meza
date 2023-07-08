import { useEffect, useState } from 'react';
import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useForm } from 'src/hooks/useForm';
import { useListEstados } from 'src/hooks/useListEstados';
import Controls from 'src/components/Controls';
import Icon from 'src/components/icon/Icon';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import PathConstants from 'util/PathConstants';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import { useRouter } from 'next/router';

const dataInitial = { TITULO: "", AUTOR: "", ID_ESTADO: 1 }

export default function PublicacionesAdminPage() {
  const [publicaciones, setPublicaciones] = useState([])
  const [data, handleInputChange, resetData] = useForm(dataInitial)
  const { setLoader } = useLoaderContext();
  const { push } = useRouter();
  const estados = useListEstados('1,2,3')

  const getPublicaciones = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 30,
      body: data,
      success: (resp) => {
        setLoader(false)
        setPublicaciones(resp.dataList)
      }, 
      error: (err) => {
        setLoader(false)
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }  

  useEffect(() => getPublicaciones(), [])

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className="flex gap-2"></div>
          <div>
            <div className="grid grid-cols-3 gap-4">
              <Controls.InputComponent
                label="Titulo"
                value={data}
                name="TITULO"
                onChange={handleInputChange}
              />
              <Controls.InputComponent
                label="Autor"
                value={data}
                name="AUTOR"
                onChange={handleInputChange}
              />
              <Controls.SelectComponent
                list={estados}
                name="ID_ESTADO"
                value={data}
                label="Estado"
                onChange={handleInputChange}
              />
            </div>
            <ButtonsFilterComponent
              handleClear={resetData}
              handleFilter={getPublicaciones}
            />
          </div>
        </Controls.CardComponent>
      </div>
      <div className="margin-base-top-card">
        <Controls.CardComponent zIndex={1} title={"Administracion de Publicaciones"}>
          <div className="flex gap-2">
            <Controls.ButtonComponent
              title="Nuevo"
              className="color-secondary"
              onClick={() => push(PathConstants.publicaciones_nuevo)}
            />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th className='text-left'>Titulo</th>
                  <th className='text-left'>Autor</th>
                  <th className='text-left'>Fecha Publicación</th>
                  <th className='text-left'>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {publicaciones.map((el, index) => (
                  <tr key={index}>
                    <td className='text-left'>{el.titulo}</td>
                    <td className='text-left'>{el.usuario_creacion}</td>
                    <td className='text-left'>{el.fecha_creacion}</td>
                    <td>
                      <Controls.ButtonEstadoComponent
                        title={el.estado}
                        colorButton={{ background: el.color }}
                        colorText={{ color: el.color }}
                      />
                    </td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <Controls.ButtonIconComponent
                          title="Editar"
                          icon={<Icon.Edit />}
                          onClick={() => push(PathConstants.publicaciones_detail + el.id_publicaciones)}
                        />
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
  )
}