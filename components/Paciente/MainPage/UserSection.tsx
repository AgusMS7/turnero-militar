import IconLink from '@/components/Paciente/IconLink';

interface UserSectionProps {
  userName: string;
}

const UserSection: React.FC<UserSectionProps> = ({ userName }) => {
  return (
    <section className="text-center my-8">
      <h2 className="text-2xl font-bold mb-8">Hola! {userName}</h2>
      <div className="flex justify-center space-x-8">
        <IconLink iconName="History" text="Historial de turnos" href='/paciente/historial' />
        <IconLink iconName="Settings" text="Configuración" href='/paciente/configuracion' />
      </div>
    </section>
  );
};

export default UserSection;