type Artisan = {
  nombre: string;
  disciplina?: string;
  actividad?: number;
  imagen?: string;
  [key: string]: any;
};

interface ModalProps {
  data: Artisan;
  onClose: () => void;
}

export default function ModalArtisan({ data, onClose }: ModalProps) {
  return (
    <div className="modal">
      <button className="close" onClick={onClose}>
        ×
      </button>
      <h2>{data.nombre}</h2>
      {data.disciplina && <p>{data.disciplina}</p>}
      {data.actividad != null && <p>Actividad: {data.actividad}</p>}
      {data.imagen && <img src={data.imagen} width={200} />}
    </div>
  );
}
