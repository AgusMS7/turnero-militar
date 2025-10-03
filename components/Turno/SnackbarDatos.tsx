interface Props {
    titulo: string;
    cuerpo: string;
}
  export default function SnackbarDatos({ titulo, cuerpo }: Props) {
    return (
      <div className="flex flex-row items-center space-x-3">
        <strong>{titulo}</strong>
        <div className="bg-[#A4D4D4] border border-[#078B8C] rounded-lg px-6 py-1">
          <span>{cuerpo}</span>
        </div>
      </div>
    );
  }