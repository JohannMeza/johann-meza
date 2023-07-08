import Controls from '../../Controls';
import IconAwesome from 'src/components/icon/IconAwesome';

export default function ButtonsFilterComponent ({ handleClear, handleFilter }) {
  return (
    <div className='flex gap-4 justify-center mt-4'>
      <Controls.ButtonComponent icon={IconAwesome.RESTORE} title="Borrar Selección" className="color-secondary" onClick={handleClear} />
      <Controls.ButtonComponent icon={IconAwesome.FILTER} title="Filtrar" className="color-primary" onClick={handleFilter} />
    </div>
  )
}