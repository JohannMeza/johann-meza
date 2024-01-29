import { useState } from 'react';
import { useForm } from 'src/hooks/useForm';
import { ImageRequestData } from "/src/helpers/helpRequestBackend";
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import { useAlert } from 'react-alert';
import Icon from 'src/components/icon/Icon';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import Controls from 'src/components/Controls';
import ButtonsFilterComponent from 'src/components/form/button/ButtonsFilterComponent';
import PathConstants from 'util/PathConstants';
import useLoaderContext from 'src/hooks/useLoaderContext';
import Image from 'next/image';

const dataInitial = { ID_ESTADO: 4, TECNOLOGIA: "" };
export default function TecnologiasAdminPage({ listTech }) {
  const [tecnologias, setTecnologias] = useState(listTech)
  const [data, handleInputChange, resetData] = useForm(dataInitial)
  const { push } = useRouter()
  const { setLoader } = useLoaderContext()
  const estados = useListEstados('4,5')
  const alert = useAlert();

  const getTecnologias = async () => {
    setLoader(true)
    await ImageRequestData({
      queryId: 51,
      body: data,
      success: (resp) => {
        setLoader(false);
        setTecnologias(resp.dataList);
      },
      error: (err) => {
        setLoader(false);
        const { message, status } = err;
        (status < 500) && alert.error(message);
      }
    });
  }
  
  return (
    <MainComponent>
      <div>
        <Controls.CardComponent zIndex={10} title={"Filtrado"}>
          <div className="flex gap-2"></div>
          <div>
            <div className="grid grid-cols-3 gap-4">
              <Controls.InputComponent
                value={data}
                name="TECNOLOGIA"
                label="Tecnologia"
                onChange={handleInputChange}
              />
              <Controls.SelectComponent
                list={estados}
                value={data}
                name="ID_ESTADO"
                label="Estado"
                onChange={handleInputChange}
              />
            </div>
            <ButtonsFilterComponent
              handleClear={resetData}
              handleFilter={getTecnologias}
            />
          </div>
        </Controls.CardComponent>
      </div>
      <div className="margin-base-top-card">
        <Controls.CardComponent zIndex={1} title={"Tecnologias"}>
          <div className="flex gap-2">
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" onClick={() => push(PathConstants.tecnologias_nuevo)} />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>
                  <th className='text-left'>Id</th>
                  <th className='text-left'>Tecnologia</th>
                  <th className='text-left'>Entorno</th>
                  <th className='text-left'>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {tecnologias.map((tecnologia, index) => (
                  <tr key={index}>
                    <td className='text-left'>{tecnologia.ID_TECNOLOGIAS}</td>
                    <td className='text-left'>
                      <div className='flex gap-2 items-center'>
                        <Image src={tecnologia.IMAGEN} width={30} height={30} alt={tecnologia.TECNOLOGIA} />
                        <span>{tecnologia.TECNOLOGIA}</span>
                      </div>
                    </td>
                    <td className='text-left'>{Array.from(tecnologia.ENTORNOS, entorno => entorno.label).join(' / ')}</td>
                    <td className='text-left'>
                      <span className='inline-block'>
                        <Controls.ButtonEstadoComponent
                          title={tecnologia.ESTADO}
                          colorButton={{ background: tecnologia.COLOR }}
                          colorText={{ color: tecnologia.COLOR }}
                        />
                      </span>
                    </td>
                    <td>
                      <div>
                        <Controls.ButtonIconComponent 
                          title="Editar" 
                          icon={<Icon.Edit />}
                          onClick={() => push(PathConstants.tecnologias_detail + tecnologia.ID_TECNOLOGIAS)}
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

export const getServerSideProps = async () => {
  let listTech = [];
  
  const getTecnologias = async () => {
    await ImageRequestData({
      queryId: 51,
      body: dataInitial,
      success: (resp) => listTech = resp.dataList,
      error: (err) => console.error(err)
    });
  }

  try {
    await getTecnologias()
    return { props: { listTech } }
  } catch (error) {
    return 
  }
}