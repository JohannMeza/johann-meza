import { useAlert } from 'react-alert';
import { SaveRequestData } from 'src/helpers/helpRequestBackend';
import { useForm } from 'src/hooks/useForm';
import { useRouter } from 'next/router';
import { EnvConstants } from 'util/EnvConstants';
import Controls from 'src/components/Controls';
import ButtonsSaveComponent from 'src/components/form/button/ButtonsSaveComponent';
import useLoaderContext from 'src/hooks/useLoaderContext';
import MainComponent from "src/components/layout/dashboard/main/MainComponent";
import PathConstants from "util/PathConstants"

export default function PerfilesPermisosPage ({ menus, dataInitial }) {
  const [data, handleInputChange] = useForm(dataInitial)
  const { push, query } = useRouter();
  const { setLoader } = useLoaderContext();
  const alert = useAlert();
  const handleButtonSave = () => {
    const arrMenuActive = Array.from(Object.entries(data).filter(el => el[1]), el => { return {id_menu: parseInt(el[0].split("-")[2]), value: el[1]} });
    const arrMenuPadres = Array.from(menus, el => { return { id_menu_padre: el.id_menu, sub_menus: Array.from(el.sub_menus, el => el.id_menu ) } })

    let listMenusAll = Array.from(arrMenuPadres, el => el.id_menu_padre);
    let listMenusActivos = Array.from(arrMenuActive, el => el.id_menu);

    let listMenusFilter = arrMenuActive.filter(el => {
      if (listMenusAll.includes(el.id_menu)) return el;
      return arrMenuPadres.find(el1 => (el1.sub_menus.includes(el.id_menu) && listMenusActivos.includes(el1.id_menu_padre)) && el )
    })
    
    setLoader(true)
    SaveRequestData({
      queryId: 14,
      body: { ID_PERFIL: query.id, MENUS: listMenusFilter }, 
      success: (resp) => {
        setLoader(false)
        alert.success(resp.message)
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
      <div className='columns-1'>
        <Controls.CardComponent zIndex={10} title={"Administrar Permisos"} isInactiveTitle>
          <div className='flex gap-2'></div>
          <div className=''>
            {
              menus.map((menu_1, index) => (
                <ListMenusComponents menu={menu_1} key={index} handleChange={handleInputChange} data={data} name={menu_1.id_menu} namePadre={null} label={menu_1.menu}>
                  {
                    menu_1.sub_menus.map((menu_2, index) => (
                      <ListMenusComponents menu={menu_2} key={index} handleChange={handleInputChange} data={data} name={menu_2.id_menu} namePadre={menu_1.id_menu} label={menu_2.menu}>
                      </ListMenusComponents>
                    ))
                  }
                </ListMenusComponents>
              ))
            }
          </div>
        </Controls.CardComponent>
        <ButtonsSaveComponent handleAction={handleButtonSave} handleBack={() => push(PathConstants.perfiles_admin)} />
      </div>
    </MainComponent>
  )
}

const ListMenusComponents = ({ children, handleChange, data, name, label, namePadre }) => {  
  return (
    <Controls.AccordionComponents target={`target-menu-${name}`} checked={data[`menu-name-${name}`]}>
      <Controls.CheckboxComponent
        label={label}
        id={`id-menu-${name}`}
        onChange={handleChange}
        className="select-none cursor-pointer"
        name={`menu-name-${name}`}
        value={
          namePadre === null && data[`menu-name-${name}`] // Menu Padre - Activo 
            ? data
            : data[`menu-name-${namePadre}`] && data[`menu-name-${name}`] // Menu Hijo - Activo
              ? data
              : false
        }
      />
      <>{children}</>
    </Controls.AccordionComponents>
  )
}

export async function getServerSideProps({ req, params }) {
  const { id } = params;
  let menus = [];
  let dataInitial = {};

  const getMenus = async () => {
    await SaveRequestData({
      queryId: 12,
      body: { ID_PERFIL: id }, 
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => menus = resp.dataList, 
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }

  const getMenusSave = async () => {
    await SaveRequestData({
      queryId: 13,
      body: { ID_PERFIL: id }, 
      config: { headers: { cookies: req.cookies[EnvConstants.REACT_APP_TOKEN] } },
      success: (resp) => {
        const arrObject = Object.values({...resp.dataList.map(el => el.id_menu)});
        let dataObject = {}
        arrObject.forEach((el) => dataObject = { ...dataObject, [`menu-name-${el}`]: el } )
        dataInitial = dataObject;
      }, 
      error: (err) => {
        const { message, status } = err;
        (status < 500) && alert.error(message)
      }
    })
  }
  
  try {
    await getMenus()
    await getMenusSave()
    return { props: { menus, dataInitial } }
  } catch (error) {
    console.log(error)
  }
}