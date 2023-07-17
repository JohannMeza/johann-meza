import { useAlert } from 'react-alert';
import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useFormValidation } from 'src/hooks/useFormValidation';
import { useListEstados } from 'src/hooks/useListEstados';
import { useRouter } from 'next/router';
import { EnvConstants } from 'util/EnvConstants';
import Controls from 'src/components/Controls';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import PathConstants from "util/PathConstants";

export default function CategoriasDetailPage({ dataInitial }) {
  const validate = (fieldValues = data) =>  {
    let temp = {...errors};
    if ("CATEGORIAS" in fieldValues) {
      temp.CATEGORIAS = fieldValues.CATEGORIAS === "" ? "El campo Categoria es requerido" : "";
    } 

    if ("ESTADO" in fieldValues) {
      temp.ESTADO = !fieldValues.ESTADO ? "El campo Categorias es requerido" : "";
    } 
    
    setErrors({...temp});
    if (fieldValues === data) {
      return Object.values(temp).every((x) => x === '');
    }
  }

  const { data, handleInputFormChange, errors, setErrors } = useFormValidation(dataInitial, true, validate);
  const { setLoader } = useLoaderContext()
  const { push, query } = useRouter();
  const estados = useListEstados('4,5')
  const alert = useAlert();

  const handleButtonSave = () => {
    if (validate()) {
      setLoader(true)
      SaveRequestData({
        queryId: 22,
        body: {...data, id_categorias: query.id},
        success: (resp) => {
          setLoader(false)
          alert.success(resp.message)
          push(PathConstants.categorias_admin)
        },
        error: (err) => {
          setLoader(false)
          const { message, status } = err;
          (status < 500) && alert.error(message)
        }
      })
    }
  }

  return (
    <MainComponent>
      <div>
        <Controls.CardComponent>
          <div className='flex gap-2'></div>
          <div>
            <div className='grid grid-cols-3 gap-4'>
              <Controls.InputComponent label="Categoria" name="CATEGORIAS" value={data} onChange={handleInputFormChange} error={errors} />
              <Controls.SelectComponent label="Estado" name="ESTADO" value={data} list={estados} onChange={handleInputFormChange} error={errors} />
            </div>
            <div>
              <ButtonsSaveComponent handleBack={() => push(PathConstants.categorias_admin)} handleAction={handleButtonSave} />
            </div>
          </div>
        </Controls.CardComponent>
      </div>
    </MainComponent>
  )
}

export async function getServerSideProps({ req, params }) {
  const { id } = params 
  let dataInitial = { CATEGORIAS: "", ESTADO: 4 }
  
  const searchCategoria = async () => { 
    await SaveRequestData({
      queryId: 21,
      body: { id_categorias: id },
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => {
        dataInitial = resp.dataObject;
      },
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  try {
    if (isNaN(id)) {
      return { props: { dataInitial } }
    } else {
      await searchCategoria()
      return { props: { dataInitial } }
    }
  } catch (error) {
    console.log(error)
  }
}