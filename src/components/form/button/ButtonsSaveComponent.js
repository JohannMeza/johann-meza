import { useRouter } from 'next/router';
import Controls from '../../Controls';
import IconAwesome from 'src/components/icon/IconAwesome';

export default function ButtonsSaveComponent ({ handleBack, handleAction, titleAction = false }) {
  const {query} = useRouter();
  
  return (
    <div className='flex gap-4 justify-center mt-4'>
      <Controls.ButtonComponent icon={IconAwesome.BACK} title="Volver" className="color-secondary" onClick={handleBack} />
      <Controls.ButtonComponent icon={IconAwesome.SAVE} title={titleAction ? titleAction : query.id ? "Actualizar" : "Guardar"} className="color-primary" onClick={handleAction} />
    </div>
  )
}