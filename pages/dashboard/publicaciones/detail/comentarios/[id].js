import { useState } from 'react';
import { EnvConstants } from 'util/EnvConstants';
import { ImageRequestData } from 'src/helpers/helpRequestBackend';
import { useListEstados } from 'src/hooks/useListEstados';
import { useForm } from 'src/hooks/useForm';
import { useRouter } from 'next/router';
import { ListConstants } from 'src/constants/ListConstants';
import { FormatDateConstants } from "src/constants/FormatDateConstants";
import useLoaderContext from 'src/hooks/useLoaderContext';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import Controls from 'src/components/Controls';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import IconAwesome from 'src/components/icon/IconAwesome';
import PathConstants from 'util/PathConstants';
import DateUtil from 'src/utils/DateUtil';
import Image from 'next/image';
import Icon from 'src/components/icon/Icon';

const dataInitial = { DESDE: DateUtil().GetFirstDate, HASTA: DateUtil().GetDate, ID_ESTADO: 4, TIPO_COMENTARIO: 1 }
export default function ComentariosDetailPage({ listComentarios }) {
  const [data, handleInputChange, resetData] = useForm(dataInitial)
  const [comentarios, setComentarios] = useState(listComentarios)
  const { query, push } = useRouter();
  const { setLoader } = useLoaderContext();
  const estados = useListEstados('4,5')

  const getComentarios = () => {
    setLoader(true)
    ImageRequestData({
      queryId: 45,
      body: { ...data, ID_PUBLICACIONES: query.id },
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
        <Controls.CardComponent zIndex={15} isInactiveTitle title={"Comentarios"}>
          <div className="flex gap-2"></div>
          <div className="grid gap-4 col-span-2">
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
        <Controls.CardComponent zIndex={10} isInactiveTitle title={"Comentarios"}>
          <div className="flex gap-2"></div>
          <div className="grid gap-4 col-span-2">
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

      <div className='flex gap-4 justify-center mt-4'>
        <Controls.ButtonComponent icon={IconAwesome.BACK} title="Volver" className="color-secondary" onClick={() => push(PathConstants.publicaciones_admin)} />
      </div>
    </MainComponent>
  )
}

export async function getServerSideProps({ req, params }) {
  let listComentarios = []
  
  const { id } = params;
  
  const getComentariosByPublicacion = async () => {
    await ImageRequestData({
      queryId: 45,
      body: { ...dataInitial, ID_PUBLICACIONES: id },
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => listComentarios = resp.dataList,
      error: (err) => console.error({...err})
    })
  }
  
  try {
    await getComentariosByPublicacion() 
    return { props: { listComentarios } }
  } catch (error) {
    console.error(error)
    return error
  }
}