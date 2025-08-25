import { useParams } from "next/navigation";

export default function SupplierDetailPage() {
  const params = useParams();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Proveedor: {params.id}</h1>
      <p>Detalles del proveedor seleccionado.</p>
    </div>
  );
}
