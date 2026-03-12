import { useRole } from "@/contexts/RoleContext";
import { Route } from "wouter";

export default function ProtectedRoute({
  children,
  requireAuth = false,
  requireAdmin = false,
}) {
  const { role } = useRole();

  // SIN login real → dejamos pasar todo
  // (podemos activar autenticación más tarde si quieres)
  if (!requireAuth && !requireAdmin) {
    return children;
  }

  // Si en el futuro activas roles:
  if (requireAdmin && role !== "admin") {
    return <div className="text-red-500 p-10">Acceso restringido</div>;
  }

  return children;
}
