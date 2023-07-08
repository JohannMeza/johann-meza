import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export const AlertUtilDelete = (fnRequest, { config }) => {
  const { title, text, icon } = config;

  MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    color: '#444444',
    confirmButtonColor: '#517ABF',
    cancelButtonColor: '#F5958E',
    confirmButtonText: '¡Si, eliminar!',
    cancelButtonText: '¡No, cancelar!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      if (fnRequest()) {
        fnRequest()
      }
    }
  })
}

export const AlertUtilMessage = ({ title, text, type, color = '#517ABF' }) => {
  /*
   * type: error | success | warning | quertion | info
   */ 
  
  MySwal.fire({
    title,
    text,
    icon: type,
    confirmButtonColor: color
  })
}