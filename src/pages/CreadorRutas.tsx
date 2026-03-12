import { useState, useRef, useEffect } from "react";
import { MapPin, Building2, Trees, Sparkles, Hammer, Plus, Save, Download, QrCode, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ElementoRuta {
  id: string;
  tipo: "artesano" | "edificio" | "naturaleza" | "experiencia" | "taller" | "punto_libre";
  nombre: string;
  descripcion?: string;
  lat?: number;
  lng?: number;
  orden: number;
}

export default function CreadorRutas() {
  const [nombreRuta, setNombreRuta] = useState("");
  const [elementos, setElementos] = useState<ElementoRuta[]>([]);
  const [elementoArrastrado, setElementoArrastrado] = useState<ElementoRuta | null>(null);
  const [mostrarPanelAgregar, setMostrarPanelAgregar] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<ElementoRuta["tipo"] | null>(null);

  const tiposElementos = [
    { tipo: "artesano" as const, icono: Hammer, label: "Artesanos", color: "bg-purple-500" },
    { tipo: "edificio" as const, icono: Building2, label: "Edificios", color: "bg-blue-500" },
    { tipo: "naturaleza" as const, icono: Trees, label: "Naturaleza", color: "bg-green-500" },
    { tipo: "experiencia" as const, icono: Sparkles, label: "Experiencias", color: "bg-orange-500" },
    { tipo: "taller" as const, icono: Hammer, label: "Talleres", color: "bg-red-500" },
    { tipo: "punto_libre" as const, icono: MapPin, label: "Punto Libre", color: "bg-gray-500" },
  ];

  const agregarElemento = (tipo: ElementoRuta["tipo"], nombre: string) => {
    const nuevoElemento: ElementoRuta = {
      id: `${tipo}-${Date.now()}`,
      tipo,
      nombre,
      orden: elementos.length,
    };
    setElementos([...elementos, nuevoElemento]);
    setMostrarPanelAgregar(false);
    setTipoSeleccionado(null);
    toast.success(`${nombre} añadido a la ruta`);
  };

  const eliminarElemento = (id: string) => {
    setElementos(elementos.filter(e => e.id !== id).map((e, i) => ({ ...e, orden: i })));
    toast.info("Elemento eliminado de la ruta");
  };

  const reordenarElementos = (fromIndex: number, toIndex: number) => {
    const nuevosElementos = [...elementos];
    const [elementoMovido] = nuevosElementos.splice(fromIndex, 1);
    nuevosElementos.splice(toIndex, 0, elementoMovido);
    setElementos(nuevosElementos.map((e, i) => ({ ...e, orden: i })));
  };

  const guardarRuta = async () => {
    if (!nombreRuta.trim()) {
      toast.error("Por favor, asigna un nombre a la ruta");
      return;
    }
    if (elementos.length === 0) {
      toast.error("Añade al menos un elemento a la ruta");
      return;
    }

    // TODO: Guardar en base de datos
    toast.success(`Ruta "${nombreRuta}" guardada correctamente`);
  };

  const exportarMiniweb = () => {
    // TODO: Generar miniweb
    toast.info("Generando miniweb...");
  };

  const generarQR = () => {
    // TODO: Generar código QR
    toast.info("Generando código QR...");
  };

  const getIcono = (tipo: ElementoRuta["tipo"]) => {
    const config = tiposElementos.find(t => t.tipo === tipo);
    return config?.icono || MapPin;
  };

  const getColor = (tipo: ElementoRuta["tipo"]) => {
    const config = tiposElementos.find(t => t.tipo === tipo);
    return config?.color || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#000000] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Creador de Rutas</h1>
          <p className="text-gray-400">Diseña itinerarios culturales arrastrando elementos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo - Elementos disponibles */}
          <Card className="lg:col-span-1 bg-gray-900/50 border-gray-700/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Elementos Disponibles</h2>
            
            <div className="space-y-3">
              {tiposElementos.map(({ tipo, icono: Icono, label, color }) => (
                <button
                  key={tipo}
                  onClick={() => {
                    setTipoSeleccionado(tipo);
                    setMostrarPanelAgregar(true);
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg ${color}/20 border border-${color.replace('bg-', '')}-500/30 hover:${color}/30 transition-all duration-200`}
                >
                  <div className={`p-2 rounded-lg ${color}`}>
                    <Icono className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{label}</span>
                  <Plus className="w-5 h-5 text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          </Card>

          {/* Panel central - Canvas de la ruta */}
          <Card className="lg:col-span-2 bg-gray-900/50 border-gray-700/50 p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de la Ruta
              </label>
              <Input
                value={nombreRuta}
                onChange={(e) => setNombreRuta(e.target.value)}
                placeholder="Ej: Ruta del Oficio Tradicional Valenciano"
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Itinerario ({elementos.length} paradas)
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={guardarRuta}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  onClick={exportarMiniweb}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Miniweb
                </Button>
                <Button
                  onClick={generarQR}
                  variant="outline"
                  size="sm"
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR
                </Button>
              </div>
            </div>

            {/* Lista de elementos en la ruta */}
            <div className="space-y-3 min-h-[400px]">
              {elementos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                  <MapPin className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg">Comienza añadiendo elementos a tu ruta</p>
                  <p className="text-sm">Selecciona un tipo de elemento del panel izquierdo</p>
                </div>
              ) : (
                elementos.map((elemento, index) => {
                  const Icono = getIcono(elemento.tipo);
                  const color = getColor(elemento.tipo);
                  
                  return (
                    <div
                      key={elemento.id}
                      draggable
                      onDragStart={() => setElementoArrastrado(elemento)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (elementoArrastrado) {
                          const fromIndex = elementos.findIndex(e => e.id === elementoArrastrado.id);
                          reordenarElementos(fromIndex, index);
                          setElementoArrastrado(null);
                        }
                      }}
                      className="flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition-all duration-200 cursor-move"
                    >
                      <GripVertical className="w-5 h-5 text-gray-500" />
                      
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white font-semibold">
                        {index + 1}
                      </div>
                      
                      <div className={`p-2 rounded-lg ${color}`}>
                        <Icono className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{elemento.nombre}</h3>
                        <p className="text-sm text-gray-400 capitalize">{elemento.tipo.replace('_', ' ')}</p>
                      </div>
                      
                      <button
                        onClick={() => eliminarElemento(elemento.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal para agregar elemento */}
      {mostrarPanelAgregar && tipoSeleccionado && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-md bg-gray-900 border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Añadir {tiposElementos.find(t => t.tipo === tipoSeleccionado)?.label}
              </h3>
              <button
                onClick={() => {
                  setMostrarPanelAgregar(false);
                  setTipoSeleccionado(null);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre
                </label>
                <Input
                  id="nombre-elemento"
                  placeholder="Ej: Taller de Cerámica Tradicional"
                  className="bg-gray-800/50 border-gray-700 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        agregarElemento(tipoSeleccionado, input.value.trim());
                      }
                    }
                  }}
                />
              </div>

              <Button
                onClick={() => {
                  const input = document.getElementById('nombre-elemento') as HTMLInputElement;
                  if (input?.value.trim()) {
                    agregarElemento(tipoSeleccionado, input.value.trim());
                  }
                }}
                className="w-full bg-cyan-500 hover:bg-cyan-600"
              >
                Añadir a la Ruta
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
