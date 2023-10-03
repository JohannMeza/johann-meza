import { useState } from 'react';
import { ImageRequestData } from 'src/helpers/helpRequestBackend';
import { useForm } from 'src/hooks/useForm';
import { useRouter } from 'next/router';
import { useListEstados } from 'src/hooks/useListEstados';
import { ListConstants } from 'src/constants/ListConstants';
import { FormatDateConstants } from "src/constants/FormatDateConstants";
import Controls from 'src/components/Controls';
import Icon from 'src/components/icon/Icon';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import PathConstants from 'util/PathConstants';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import DateUtil from 'src/utils/DateUtil';
import Image from 'next/image';

const dataInitial = { DESDE: DateUtil().GetFirstDate, HASTA: DateUtil().GetDate, ID_ESTADO: 4, TIPO_COMENTARIO: 1 }
export default function ComentariosAdminPage({ listComentarios }) {
  const estados = useListEstados('4,5')
  const [comentarios, setComentarios] = useState(listComentarios)
  const [data, handleInputChange, resetData] = useForm(dataInitial)
  const { setLoader } = useLoaderContext();
  const { push } = useRouter()

  const getComentarios = () => {
    setLoader(true)
    ImageRequestData({
      queryId: 47,
      body: data,
      success: (resp) => {
        setLoader(false)
        setComentarios(resp.dataList)
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
                label="Desde"
                type="date"
                value={data}
                name="DESDE"
                max={data.HASTA}
                onChange={handleInputChange}
              />
              <Controls.InputComponent
                label="Hasta"
                type="date"
                value={data}
                name="HASTA"
                min={data.DESDE}
                onChange={handleInputChange}
              />
              <Controls.SelectComponent
                list={ListConstants.LIST_TIPO_COMENTARIO}
                name="TIPO_COMENTARIO"
                value={data}
                label="Tipo Comentario"
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
              handleFilter={getComentarios}
            />
          </div>
        </Controls.CardComponent>
      </div>
      <div className="margin-base-top-card">
        <Controls.CardComponent zIndex={1} title={"Administracion de Comentarios"}>
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
                  <th className='text-left'>Comentario</th>
                  <th className='text-left'>Autor</th>
                  <th className='text-left'>Fecha Publicación</th>
                  <th className='text-left'>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  comentarios.map((comentario, index) => (
                    <tr key={index}>
                      <td className='text-left'>{comentario.COMENTARIO}</td>
                      <td className='text-left'>
                        <div className='flex gap-3 items-center'>
                          <Image src={comentario.IMAGEN} width={100} height={100} alt="" className='w-10 h-10 rounded-full' />
                          {comentario.USUARIO}
                        </div>
                      </td>
                      <td className='text-left'>{DateUtil().StringToMoment(comentario.FECHA_CREACION, FormatDateConstants.FECHA_HORA)}</td>
                      <td className='text-left'>
                        <Controls.ButtonEstadoComponent
                          title={comentario.ESTADO}
                          colorButton={{ background: comentario.COLOR }}
                          colorText={{ color: comentario.COLOR }}
                        />
                      </td>
                      <td>
                        <div className='flex justify-center'>
                          <Controls.ButtonIconComponent
                            title="Ver Comentario Completo"
                            icon={<Icon.Eye />}
                          />
                        </div>
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

export const getServerSideProps = async () => {
  let listComentarios = []
  
  const getComentarios = async () => {
    await ImageRequestData({
      queryId: 47,
      body: dataInitial,
      success: (resp) => listComentarios = resp.dataList, 
      error: (err) => console.error(err)
    })
  }

  try {
    await getComentarios()
    return { props: { listComentarios } }
  } catch (err) {
    console.error(err)
    return { props: { comentarios: [] } }
  }
}