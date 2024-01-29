import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useForm } from 'src/hooks/useForm';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import { EnvConstants } from "util/EnvConstants";
import { useEffect, useState } from 'react';
import useLoaderContext from 'src/hooks/useLoaderContext';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import Controls from 'src/components/Controls';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import PathConstants from "util/PathConstants";
import Icon from "src/components/icon/Icon";


export default function ProyectosAdminPage({ dataList, dataInitial, listEntornos }) {
  const [dataProyectos, setDataProyextos] = useState(dataList);
  const [listTecnologias, setListTecnologias] = useState([]);
  const [data, handleInputChange, resetData, setData] = useForm(dataInitial)
  const { push } = useRouter();
  const { setLoader } = useLoaderContext();
  const estados = useListEstados('4,5')

  const getTecnologias = () => {
    let arrEntornos = [...data.ID_ENTORNOS.split(',').map(el => el )]
    if (arrEntornos[0] === '') arrEntornos.splice(0, 1);
    setLoader(true);
    SaveRequestData({
      queryId: 59,
      body: { ID_ENTORNOS: arrEntornos.join(','), ID_ESTADO: 4 },
      success: (resp) => {
        const arrIdTecnologias = Array.from(resp.dataList, el => el.value)
        const arrTecnologias = [...data.ID_TECNOLOGIAS.split(',').map(el => el )]
        if (arrTecnologias[0] === '') arrTecnologias.splice(0, 1);
        const arrayFiltrado = arrIdTecnologias.filter(el => arrTecnologias.includes(`${el}`));

        setLoader(false);
        setListTecnologias(resp.dataList)
        setData(() => ({...data, ID_TECNOLOGIAS: arrayFiltrado.join(',')}))
      },
      error: (err) => console.error(err)
    }) 
  }

  const getListProyectos = async () => {
    let arrTecnologias = [...data.ID_TECNOLOGIAS.split(',').map(el => el )]
    let arrEntornos = [...data.ID_ENTORNOS.split(',').map(el => { return { id_entornos: el } })]
    if (arrTecnologias[0] === '') arrTecnologias.splice(0, 1);
    if (arrEntornos[0].id_entornos === '') arrEntornos.splice(0, 1);

    setLoader(true)
    SaveRequestData({
      queryId: 55,
      body: {
        ...data,
        ID_TECNOLOGIAS: arrTecnologias.join(','),
        ID_ENTORNOS: arrEntornos,
      },
      success: (resp) => {
        setDataProyextos(resp.dataList);
        setLoader(false);
      },
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => Object.entries(data).length && getTecnologias(), [data.ID_ENTORNOS])

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className="flex gap-2"></div>
          <div>
            <div className="grid grid-cols-3 gap-4">
              <Controls.InputComponent
                label="Proyecto"
                name="PROYECTO"
                value={data}
                onChange={handleInputChange}
              />
              <Controls.SearchComponent
                list={listEntornos}
                label="Entorno"
                name="ID_ENTORNOS"
                value={data}
                onChange={handleInputChange}
              />
              <Controls.SearchComponent
                list={listTecnologias}
                label="Tecnologia"
                name="ID_TECNOLOGIAS"
                value={data}
                onChange={handleInputChange}
              />
              <Controls.SelectComponent
                list={estados}
                name="ID_ESTADO"
                label="Estado"
                value={data}
                onChange={handleInputChange}
              />
            </div>
            <ButtonsFilterComponent
              handleClear={() => resetData()}
              handleFilter={getListProyectos}
            />
          </div>
        </Controls.CardComponent>
      </div>
      <div className="margin-base-top-card">
        <Controls.CardComponent zIndex={1} title={"Proyectos"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" onClick={() => push(PathConstants.proyectos_nuevo)} />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th className='text-left'>Id</th>
                  <th className='text-left'>Proyecto</th>
                  <th className='text-left'>Estado</th>
                  <th className='center'>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {dataProyectos.map((el, index) => (
                  <tr key={index}>
                    <td className='text-left'>{el.ID_PROYECTOS}</td>
                    <td className='text-left'>{el.PROYECTO}</td>
                    <td className='text-left'>
                      <Controls.ButtonEstadoComponent
                        title={el.ESTADO}
                        colorButton={{ background: el.COLOR_ESTADO }}
                        colorText={{ color: el.COLOR_ESTADO }}
                      />
                    </td>
                    <td className='text-left'>
                      <div className='flex gap-2 justify-center'>
                        <Controls.ButtonIconComponent title="Editar" icon={<Icon.Edit />} onClick={() => push(PathConstants.proyectos_detail + el.ID_PROYECTOS)} />
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

export async function getServerSideProps ({ req }) {
  let dataInitial =  { PROYECTO: '', ID_ENTORNOS: '', ID_TECNOLOGIAS: '', ID_ESTADO: 4 };
  let dataList = [];
  let listEntornos = []

  const getListProyectos = async () => {
    await SaveRequestData({
      queryId: 55,
      body: dataInitial,
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => {
        dataList = resp.dataList;
      }, 
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  const getEntornos = async () => {
    await SaveRequestData({
      queryId: 53,
      body: {},
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => listEntornos = resp.dataList,
      error: (err) => console.error(err)
    })
  }

  try {
    await getListProyectos()
    await getEntornos()
    return { props: { dataList, dataInitial, listEntornos } }
  } catch (error) {
    console.error(error)
    return { props: { dataList } }
  }
}