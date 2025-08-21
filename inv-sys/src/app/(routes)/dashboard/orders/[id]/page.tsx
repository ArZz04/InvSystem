import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Pedido: {params.id}</h1>
      <p>Detalles del pedido seleccionado.</p>
    </div>
  );
}