import { classNames } from 'src/utils/ClassNames';

export default function ButtonComponent ({ title, style, className = false, onClick = () => {}, icon, disabled = false }) {
  return (
    <div>
      <button 
        data-mdb-ripple="true"
        className={classNames(
          "button-base",
          "text-button-3",
          "color-primary",
          disabled ? "opacity-80 cursor-not-allowed" : "",
          className
        )}
        style={style}
        onClick={() => !disabled && onClick()}
      >
        { icon && <span className='w-5'>{ icon }</span> }
        <div className='h-full flex items-center'>{ title }</div>
      </button>
    </div>
  )
}