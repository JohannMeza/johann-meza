import { useState } from 'react';
import { useForm } from 'src/hooks/useForm';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import { SaveRequestData } from "/src/helpers/helpRequestBackend";
import { EnvConstants } from 'util/EnvConstants';
import { useAlert } from 'react-alert';
import Icon from 'src/components/icon/Icon';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import Controls from 'src/components/Controls';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import PathConstants from 'util/PathConstants';
import useLoaderContext from 'src/hooks/useLoaderContext';

const dataInitial = { ENTORNO: "", ID_ESTADO: 4 }
export default function EntornosAdminPage({ listEntornos }) {
  const [data, handleInputChange, resetData] = useForm(dataInitial)
  const [entornos, setEntornos] = useState(listEntornos);
  const { push } = useRouter();
  const { setLoader } = useLoaderContext()
  const estados = useListEstados('4,5')
  const alert = useAlert();

  const getEntornos = () => {
    setLoader(true)
    SaveRequestData({
      queryId: 48,
      body: data,
      success: (resp) => {
        setLoader(false)
        setEntornos(resp.dataList)
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
                label="Entorno"
                name="ENTORNO"
                value={data}
                max={data.ENTORNO}
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
              handleFilter={getEntornos}
            />
          </div>
        </Controls.CardComponent>
      </div>
      <div className="margin-base-top-card">
        <Controls.CardComponent zIndex={1} title={"Entornos"}>
          <div className="flex gap-2">
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" onClick={() => push(PathConstants.entornos_nuevo)} />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th className='text-left'>Id</th>
                  <th className='text-left'>Entorno</th>
                  <th className='text-left'>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {entornos.map((entorno, index) => (
                  <tr key={index}>
                    <td className='text-left'>{entorno.ID_ENTORNOS}</td>
                    <td className='text-left'>{entorno.ENTORNO}</td>
                    <td className='text-left'>
                      <span className='inline-block'>
                        <Controls.ButtonEstadoComponent
                          title={entorno.ESTADO}
                          colorButton={{ background: entorno.COLOR }}
                          colorText={{ color: entorno.COLOR }}
                        />
                      </span>
                    </td>
                    <td>
                      <div>
                        <Controls.ButtonIconComponent 
                          title="Editar" 
                          icon={<Icon.Edit />}
                          onClick={() => push(PathConstants.entornos_detail + entorno.ID_ENTORNOS)}
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

export const getServerSideProps = async ({ req }) =>  {
  let listEntornos = []
  
  const getEntornos = async () => {
    await SaveRequestData({
      queryId: 48,
      body: dataInitial,
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => listEntornos = resp.dataList,
      error: (err) => console.error(err)
    })
  }
  
  try {
    await getEntornos()
    return { props: { listEntornos } }
  } catch (error) {
    console.error(error)
    return { props: { listEntornos } }
  }
}
