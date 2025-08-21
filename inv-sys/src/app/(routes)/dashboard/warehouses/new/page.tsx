import { useParams } from "next/navigation";

export default function WarehouseDetailPage() {
  const params = useParams();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Almacén: {params.id}</h1>
      <p>Detalles y gestión del almacén seleccionado.</p>
    </div>
  );
}