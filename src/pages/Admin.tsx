import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { 
  Key, Users, Activity, CheckCircle2, XCircle, 
  Loader2, Plus, Trash2, Mail, Calendar, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ActividadDashboard from "@/components/ActividadDashboard";
import MetricasDashboard from "@/components/MetricasDashboard";
import GestionUsuarios from "@/components/GestionUsuarios";
import MonitoreoEmails from "@/components/MonitoreoEmails";

export default function Admin() {
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [emailAsignado, setEmailAsignado] = useState("");
  const [notas, setNotas] = useState("");

  const [busquedaCodigo, setBusquedaCodigo] = useState("");
  const [filtroCodigo, setFiltroCodigo] = useState<"todos" | "usado" | "disponible">("todos");

  // Verificar autenticación antes de ejecutar queries
  const userId = localStorage.getItem("user_id");
  const userRole = localStorage.getItem("user_role");
  const isAdmin = userRole === "admin";

  const { data: solicitudes, refetch: refetchSolicitudes } = trpc.invitaciones.listarSolicitudes.useQuery(undefined, {
    enabled: !!userId && isAdmin,
  });
  const { data: codigos, refetch: refetchCodigos } = trpc.invitaciones.listarCodigos.useQuery(undefined, {
    enabled: !!userId && isAdmin,
  });
  const crearCodigoMutation = trpc.invitaciones.crearCodigo.useMutation();
  const aprobarSolicitudMutation = trpc.invitaciones.aprobarSolicitud.useMutation();
  const rechazarSolicitudMutation = trpc.invitaciones.rechazarSolicitud.useMutation();
  const desactivarCodigoMutation = trpc.invitaciones.desactivarCodigo.useMutation();
  const eliminarCodigoMutation = trpc.invitaciones.eliminarCodigo.useMutation();

  const handleAprobarSolicitud = async (solicitudId: number) => {
    try {
      const resultado = await aprobarSolicitudMutation.mutateAsync({ solicitudId });
      toast.success(`Solicitud aprobada. Código generado: ${resultado.codigo.codigo}`);
      refetchSolicitudes();
      refetchCodigos();
    } catch (error: any) {
      toast.error(error.message || "Error al aprobar solicitud");
    }
  };

  const handleRechazarSolicitud = async (solicitudId: number) => {
    try {
      await rechazarSolicitudMutation.mutateAsync({ 
        solicitudId,
        motivo: "Solicitud rechazada por el administrador"
      });
      toast.success("Solicitud rechazada");
      refetchSolicitudes();
    } catch (error: any) {
      toast.error(error.message || "Error al rechazar solicitud");
    }
  };

  const handleCopiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    toast.success("Código copiado al portapapeles");
  };

  const handleDesactivarCodigo = async (codigoId: number) => {
    try {
      await desactivarCodigoMutation.mutateAsync({ codigoId });
      toast.success("Código desactivado");
      refetchCodigos();
    } catch (error: any) {
      toast.error(error.message || "Error al desactivar código");
    }
  };

  const handleEliminarCodigo = async (codigoId: number) => {
    if (!confirm("¿Estás seguro de eliminar este código?")) return;
    
    try {
      await eliminarCodigoMutation.mutateAsync({ codigoId });
      toast.success("Código eliminado");
      refetchCodigos();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar código");
    }
  };

  const handleCrearCodigo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoCodigo) {
      toast.error("El código es obligatorio");
      return;
    }

    try {
      const resultado = await crearCodigoMutation.mutateAsync({
        codigo: nuevoCodigo.toUpperCase(),
        emailAsignado: emailAsignado || undefined,
        notas: notas || undefined,
      });

      // Mensaje de éxito
      if (emailAsignado) {
        toast.success(`Código creado y enviado a ${emailAsignado}`);
      } else {
        toast.success("Código creado correctamente");
      }
      
      setNuevoCodigo("");
      setEmailAsignado("");
      setNotas("");
      
      // Refetch para actualizar la lista
      await refetchCodigos();
    } catch (error: any) {
      toast.error(error.message || "Error al crear código");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 font-tech">
                Panel de Administración
              </h1>
              <p className="text-gray-400 mt-1">
                Gestión de accesos y actividad de ARTENIA LAB
              </p>
            </div>
            <Button
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => window.location.href = "/"}
            >
              Volver al Mapa
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="codigos" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-cyan-500/20">
            <TabsTrigger value="codigos" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Key className="w-4 h-4 mr-2" />
              Códigos de Invitación
            </TabsTrigger>
            <TabsTrigger value="solicitudes" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Mail className="w-4 h-4 mr-2" />
              Solicitudes Pendientes
              {solicitudes && solicitudes.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {solicitudes.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="actividad" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Activity className="w-4 h-4 mr-2" />
              Actividad
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="estadisticas" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <TrendingUp className="w-4 h-4 mr-2" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="emails" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Mail className="w-4 h-4 mr-2" />
              Emails
            </TabsTrigger>
          </TabsList>

          {/* Tab: Códigos de Invitación */}
          <TabsContent value="codigos" className="space-y-6">
            {/* Formulario para crear código */}
            <Card className="bg-gray-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Crear Nuevo Código
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Genera un código de invitación para dar acceso a nuevos artesanos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCrearCodigo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigo" className="text-gray-300">
                        Código *
                      </Label>
                      <Input
                        id="codigo"
                        type="text"
                        placeholder="ARTENIA2025"
                        value={nuevoCodigo}
                        onChange={(e) => setNuevoCodigo(e.target.value.toUpperCase())}
                        className="bg-gray-900/50 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailAsignado" className="text-gray-300">
                        Email Asignado (opcional)
                      </Label>
                      <Input
                        id="emailAsignado"
                        type="email"
                        placeholder="artesano@example.com"
                        value={emailAsignado}
                        onChange={(e) => setEmailAsignado(e.target.value)}
                        className="bg-gray-900/50 border-cyan-500/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notas" className="text-gray-300">
                        Notas (opcional)
                      </Label>
                      <Input
                        id="notas"
                        type="text"
                        placeholder="Código para ceramistas"
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        className="bg-gray-900/50 border-cyan-500/30 text-white"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={crearCodigoMutation.isPending}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    {crearCodigoMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Código
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de códigos */}
            <Card className="bg-gray-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Códigos Existentes</CardTitle>
                <CardDescription className="text-gray-400">
                  Lista de todos los códigos de invitación generados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por código o email..."
                      value={busquedaCodigo}
                      onChange={(e) => setBusquedaCodigo(e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                    />
                  </div>
                  <select
                    value={filtroCodigo}
                    onChange={(e) => setFiltroCodigo(e.target.value as any)}
                    className="bg-gray-900/50 border border-cyan-500/30 text-white rounded-md px-4 py-2"
                  >
                    <option value="todos">Todos</option>
                    <option value="disponible">Disponibles</option>
                    <option value="usado">Usados</option>
                  </select>
                </div>

                {/* Tabla de códigos */}
                {codigos && codigos.length > 0 ? (
                  <div className="space-y-3">
                    {codigos
                      .filter((codigo) => {
                        // Filtro por búsqueda
                        if (busquedaCodigo) {
                          const busqueda = busquedaCodigo.toLowerCase();
                          return (
                            codigo.codigo.toLowerCase().includes(busqueda) ||
                            (codigo.emailAsignado && codigo.emailAsignado.toLowerCase().includes(busqueda))
                          );
                        }
                        return true;
                      })
                      .filter((codigo) => {
                        // Filtro por estado
                        if (filtroCodigo === "usado") return codigo.usado;
                        if (filtroCodigo === "disponible") return !codigo.usado;
                        return true;
                      })
                      .map((codigo) => (
                        <div
                          key={codigo.id}
                          className="flex items-center justify-between p-4 bg-gray-900/50 border border-cyan-500/20 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Key className="w-5 h-5 text-cyan-400" />
                              <div>
                                <p className="text-white font-mono font-bold">{codigo.codigo}</p>
                                {codigo.emailAsignado && (
                                  <p className="text-sm text-gray-400">{codigo.emailAsignado}</p>
                                )}
                                {codigo.notas && (
                                  <p className="text-xs text-gray-500 mt-1">{codigo.notas}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Creado: {new Date(codigo.createdAt).toLocaleDateString("es-ES")}
                                  </p>
                                  {codigo.usado && codigo.fechaUso && (
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Usado: {codigo.fechaUso ? new Date(codigo.fechaUso).toLocaleDateString("es-ES") : 'N/A'}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {codigo.usado ? (
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Usado
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                                Disponible
                              </span>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                              onClick={() => handleCopiarCodigo(codigo.codigo)}
                            >
                              Copiar
                            </Button>
                            {!codigo.usado && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                                onClick={() => handleDesactivarCodigo(codigo.id)}
                                disabled={desactivarCodigoMutation.isPending}
                              >
                                Desactivar
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              onClick={() => handleEliminarCodigo(codigo.id)}
                              disabled={eliminarCodigoMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay códigos generados aún</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Solicitudes Pendientes */}
          <TabsContent value="solicitudes" className="space-y-6">
            <Card className="bg-gray-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Solicitudes de Acceso</CardTitle>
                <CardDescription className="text-gray-400">
                  Usuarios que han solicitado acceso sin código válido
                </CardDescription>
              </CardHeader>
              <CardContent>
                {solicitudes && solicitudes.length > 0 ? (
                  <div className="space-y-4">
                    {solicitudes.map((solicitud) => {
                      let respuestas: Record<string, string> = {};
                      try {
                        respuestas = solicitud.respuestasRol ? JSON.parse(solicitud.respuestasRol) : {};
                      } catch (e) {
                        console.error("Error parsing respuestasRol:", e);
                      }

                      return (
                      <div
                        key={solicitud.id}
                        className="p-6 bg-gray-900/50 border border-cyan-500/20 rounded-lg space-y-4"
                      >
                        {/* Datos básicos */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-cyan-400" />
                              <div>
                                <p className="text-white font-bold text-lg">{solicitud.nombre || "Sin nombre"}</p>
                                <p className="text-sm text-gray-400">{solicitud.email}</p>
                                {solicitud.telefono && (
                                  <p className="text-sm text-gray-400">Tel: {solicitud.telefono}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-3">
                              {solicitud.rol && (
                                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30">
                                  {solicitud.rol.toUpperCase()}
                                </span>
                              )}
                              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700">
                                Código: {solicitud.codigoIntentado || "N/A"}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleAprobarSolicitud(solicitud.id)}
                                     disabled={aprobarSolicitudMutation.isPending}
                            >
                              {aprobarSolicitudMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRechazarSolicitud(solicitud.id)}
                              disabled={rechazarSolicitudMutation.isPending}
                            >
                              {rechazarSolicitudMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Respuestas específicas del rol */}
                        {Object.keys(respuestas).length > 0 && (
                          <div className="border-t border-cyan-500/20 pt-4">
                            <h4 className="text-sm font-semibold text-cyan-400 mb-3">
                              Respuestas específicas de {solicitud.rol}:
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(respuestas).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <span className="text-gray-400 font-medium">
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}:
                                  </span>
                                  <span className="text-gray-300 ml-2">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay solicitudes pendientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Actividad */}
          <TabsContent value="actividad" className="space-y-6">
            <ActividadDashboard />
          </TabsContent>

          {/* Tab: Usuarios */}
          <TabsContent value="usuarios" className="space-y-6">
            <GestionUsuarios />
          </TabsContent>

          {/* Tab: Estadísticas */}
          <TabsContent value="estadisticas" className="space-y-6">
            <MetricasDashboard />
          </TabsContent>

          {/* Tab: Emails */}
          <TabsContent value="emails" className="space-y-6">
            <Card className="bg-gray-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Monitoreo de Emails</CardTitle>
                <CardDescription className="text-gray-400">
                  Historial completo de todos los emails enviados por el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonitoreoEmails />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
