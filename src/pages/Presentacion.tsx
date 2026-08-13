import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, TrendingUp, Users, MapPin } from "lucide-react";
import { Link } from "wouter";
import { CalculadoraViabilidad } from "@/components/CalculadoraViabilidad";
import { RecursosDescargables } from "@/components/RecursosDescargables";
import { MapaExito } from "@/components/MapaExito";

export default function Presentacion() {
  return (
    <div className="presentacion-shell">
      {/* Hero Section */}
      <section className="presentacion-hero">
        <div className="presentacion-hex-bg" />

        <div className="presentacion-hero-inner">
          <p className="presentacion-kicker eyebrow">
            Artenia Lab · Biblioteca de los Oficios
          </p>

          <h1 className="presentacion-title">
            <span>La Artesanía Valenciana</span>
            <span className="presentacion-title-accent">en Riesgo de Extinción</span>
          </h1>

          <p className="presentacion-lede lede">
            271 talleres documentados. 177 invisibles digitalmente. 7 oficios al
            borde de desaparecer. <span className="text-[#FF6B35] font-bold">Es hora de actuar.</span>
          </p>

          <div className="presentacion-cta-row">
            <Button
              size="lg"
              className="presentacion-cta"
              onClick={() =>
                document.getElementById("datos")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Ver los Datos <ArrowRight className="ml-2" />
            </Button>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="presentacion-cta-secondary"
              >
                Explorar Mapa Interactivo
              </Button>
            </Link>
          </div>

          <div className="presentacion-stats">
            {[
              { value: "271", label: "Talleres Documentados", icon: MapPin },
              { value: "65.3%", label: "Sin Presencia Online", icon: AlertTriangle },
              { value: "7", label: "Oficios en Riesgo Crítico", icon: AlertTriangle },
              { value: "18.1M€", label: "Potencial Económico", icon: TrendingUp }
            ].map((stat, i) => (
              <div key={i} className="presentacion-stat-card">
                <stat.icon className="presentacion-stat-icon" />
                <div className="presentacion-stat-value">{stat.value}</div>
                <div className="presentacion-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="presentacion-scroll">
          <div className="presentacion-scroll-dot" />
        </div>
      </section>

      {/* Problema Section */}
      <section id="problema" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a0a0a]">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              La Crisis <span className="text-[#FF6B35]">Silenciosa</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mientras la sociedad avanza, nuestro patrimonio artesanal desaparece sin que nadie lo note
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-black/50 border-2 border-[#FF6B35] p-8 hover:border-[#FF6B35]/50 transition-all">
              <div className="w-16 h-16 bg-[#FF6B35]/20 border-2 border-[#FF6B35] flex items-center justify-center mb-6 mx-auto">
                <AlertTriangle className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Invisibilidad Digital</h3>
              <p className="text-gray-300 text-center mb-4">
                <span className="text-4xl font-bold text-[#FF6B35] block mb-2">177 talleres</span>
                sin página web ni redes sociales. Invisibles para el 95% de potenciales clientes.
              </p>
              <p className="text-sm text-gray-400 text-center">
                Pérdida estimada: <span className="text-[#FF6B35] font-bold">1.7M€/año</span>
              </p>
            </div>

            <div className="bg-black/50 border-2 border-[#D32F2F] p-8 hover:border-[#D32F2F]/50 transition-all">
              <div className="w-16 h-16 bg-[#D32F2F]/20 border-2 border-[#D32F2F] flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-[#D32F2F]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Sin Relevo Generacional</h3>
              <p className="text-gray-300 text-center mb-4">
                <span className="text-4xl font-bold text-[#D32F2F] block mb-2">59.6%</span>
                de maestros artesanos superan los 55 años. La mayoría sin aprendices.
              </p>
              <p className="text-sm text-gray-400 text-center">
                Cuando se retiren, <span className="text-[#D32F2F] font-bold">sus conocimientos desaparecerán</span>
              </p>
            </div>

            <div className="bg-black/50 border-2 border-[#FFD700] p-8 hover:border-[#FFD700]/50 transition-all">
              <div className="w-16 h-16 bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center mb-6 mx-auto">
                <AlertTriangle className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Oficios en Extinción</h3>
              <p className="text-gray-300 text-center mb-4">
                <span className="text-4xl font-bold text-[#FFD700] block mb-2">7 oficios</span>
                con menos de 4 talleres activos en toda la Comunitat Valenciana.
              </p>
              <p className="text-sm text-gray-400 text-center">
                Toneleros, tejedores de vellut, esparteros... <span className="text-[#FFD700] font-bold">al borde del abismo</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Datos Section */}
      <section id="datos" className="py-20 bg-[#0a0a0a]">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Los <span className="text-[#00D9FF]">Datos</span> No Mienten
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              271 talleres documentados con 29 variables por registro. Investigación exhaustiva, datos verificados.
            </p>
          </div>

          {/* Gráfico Principal */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="bg-black/50 border-2 border-[#00D9FF] p-4 md:p-8">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/presentacion_estrategica-1280.webp 1280w, /presentacion_estrategica-1920.webp 1920w"
                  sizes="(max-width: 768px) calc(100vw - 64px), 1280px"
                />
                <img
                  src="/presentacion_estrategica.png"
                  alt="Datos Estratégicos - Invisibilidad Digital y Distribución"
                  className="w-full h-auto"
                  width={5892}
                  height={3535}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <p className="text-center text-gray-400 mt-4 text-sm">
              Fuente: ARTENIA LAB - Base de datos de 271 talleres artesanales (2024-2025)
            </p>
          </div>

          {/* Gráfico Oficios en Riesgo */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="bg-black/50 border-2 border-[#FF6B35] p-4 md:p-8">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/oficios_riesgo-1280.webp 1280w, /oficios_riesgo-1920.webp 1920w"
                  sizes="(max-width: 768px) calc(100vw - 64px), 1280px"
                />
                <img
                  src="/oficios_riesgo.png"
                  alt="Análisis Detallado de Oficios en Riesgo de Extinción"
                  className="w-full h-auto"
                  width={5363}
                  height={3539}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <p className="text-center text-gray-400 mt-4 text-sm">
              Proyección 2025-2040: Sin intervención perdemos 27 de 30 oficios tradicionales
            </p>
          </div>

          {/* Gráfico Impacto Económico */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-black/50 border-2 border-[#4CAF50] p-4 md:p-8">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/impacto_economico-1280.webp 1280w, /impacto_economico-1920.webp 1920w"
                  sizes="(max-width: 768px) calc(100vw - 64px), 1280px"
                />
                <img
                  src="/impacto_economico.png"
                  alt="Impacto Económico y Oportunidades de Crecimiento"
                  className="w-full h-auto"
                  width={5967}
                  height={2955}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <p className="text-center text-gray-400 mt-4 text-sm">
              Potencial total: 18.1M€/año en digitalización + turismo experiencial + exportación
            </p>
          </div>
        </div>
      </section>

      {/* Solución Section */}
      <section id="solucion" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0a1a0a]">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Programa <span className="text-[#4CAF50]">Neoartesanos</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Una estrategia integral para preservar la identidad artesanal valenciana mientras generamos impacto económico
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
            {[
              {
                title: "FORMACIÓN",
                desc: "15 oficios prioritarios",
                detail: "Becas 12.000€/año × 2 años para jóvenes menores de 35 años",
                color: "#00D9FF"
              },
              {
                title: "DIGITALIZACIÓN",
                desc: "177 talleres invisibles",
                detail: "Web + redes sociales + e-commerce + formación digital",
                color: "#4CAF50"
              },
              {
                title: "FINANCIACIÓN",
                desc: "Microcréditos 0% interés",
                detail: "Hasta 25.000€ para herramientas y establecimiento de taller",
                color: "#FFD700"
              },
              {
                title: "MERCADO",
                desc: "Marketplace artesanal",
                detail: "Plataforma colectiva con comisiones reducidas (8% vs 20%)",
                color: "#FF6B35"
              }
            ].map((item, i) => (
              <div key={i} className="bg-black/50 border-2 p-6 hover:scale-105 transition-all" style={{ borderColor: item.color }}>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-2xl font-bold mb-3" style={{ color: item.color }}>{item.desc}</p>
                <p className="text-sm text-gray-400">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Inversión y Retorno */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/50 border-2 border-[#4CAF50] p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-gray-400 mb-2 uppercase text-sm tracking-wide">Inversión Necesaria</p>
                  <p className="text-5xl font-bold text-white mb-2">4.8M€</p>
                  <p className="text-gray-400 text-sm">5 años (2025-2030)</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 mb-2 uppercase text-sm tracking-wide">Retorno Fiscal</p>
                  <p className="text-5xl font-bold text-[#4CAF50] mb-2">12.6M€</p>
                  <p className="text-gray-400 text-sm">ROI: 2.6x la inversión</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitividad Section */}
      <section id="competitividad" className="py-20 bg-gradient-to-b from-[#0a1a0a] to-[#0a0a1a]">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cómo <span className="text-[#FFD700]">Competir</span> con la Industria
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              La artesanía no debe "sobrevivir" por nostalgia. Debe prosperar porque ofrece valor superior en nichos estratégicos del mercado del siglo XXI.
            </p>
          </div>

          {/* Estrategias */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
            {[
              {
                title: "Diferenciación por Valor",
                icon: "\uD83C\uDFC6",
                strategies: [
                  "Certificación blockchain de autenticidad",
                  "Storytelling: cada pieza cuenta su historia",
                  "Ediciones limitadas numeradas"
                ],
                example: "Cerámica de Agost con certificado digital: +40% precio vs genérica",
                color: "#FFD700"
              },
              {
                title: "Hibridación Inteligente",
                icon: "\u2699\uFE0F",
                strategies: [
                  "CNC para partes repetitivas + acabado manual",
                  "Diseño paramétrico personalizable",
                  "AR: cliente ve al artesano trabajando su pieza"
                ],
                example: "Muebles Paco Catalán (Valencia): producción híbrida, facturación +180%",
                color: "#00D9FF"
              },
              {
                title: "Nuevos Modelos de Negocio",
                icon: "\uD83D\uDCBC",
                strategies: [
                  "Suscripción: pieza única mensual",
                  "Co-creación: cliente diseña, artesano ejecuta",
                  "Talleres corporativos (team building)"
                ],
                example: "Joyería Carrera (Alicante): suscripción 89€/mes, 340 clientes activos",
                color: "#4CAF50"
              },
              {
                title: "Nichos Inexplorados",
                icon: "\uD83C\uDFAF",
                strategies: [
                  "Lujo sostenible (anti fast-fashion)",
                  "Reparación premium (economía circular)",
                  "Personalización extrema (prótesis artísticas)"
                ],
                example: "Zapatero Carmelo (Elche): reparación lujo, ticket medio 180€ vs 45€ industrial",
                color: "#FF6B35"
              },
              {
                title: "Cooperativismo Digital",
                icon: "\uD83E\uDD1D",
                strategies: [
                  "Plataforma colectiva de producción",
                  "Compras agrupadas de materia prima",
                  "Marca colectiva: 'Hecho en Valencia'"
                ],
                example: "Cooperativa Cerámica Manises: 12 talleres, compras -30%, ventas +65%",
                color: "#9C27B0"
              },
              {
                title: "Experiencia + Producto",
                icon: "\u2728",
                strategies: [
                  "Taller visitable con venta directa",
                  "Clases de iniciación (45-120€/persona)",
                  "Eventos privados en el taller"
                ],
                example: "Taller de vidrio Gordiola (Algemesí): 40% ingresos por experiencias, no productos",
                color: "#E91E63"
              }
            ].map((item, i) => (
              <div key={i} className="bg-black/50 border-2 p-6 hover:scale-105 transition-all" style={{ borderColor: item.color }}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <ul className="space-y-2 mb-4">
                  {item.strategies.map((s, j) => (
                    <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-xs mt-1" style={{ color: item.color }}>■</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400 italic">
                    <span className="font-bold" style={{ color: item.color }}>Caso real:</span> {item.example}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparativa Económica */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              Análisis Comparativo: <span className="text-[#FFD700]">Artesanía vs Industria</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Artesanal */}
              <div className="bg-gradient-to-br from-[#4CAF50]/20 to-black border-2 border-[#4CAF50] p-8">
                <h4 className="text-2xl font-bold text-[#4CAF50] mb-6 text-center">Modelo Artesanal Optimizado</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#4CAF50]/30">
                    <span className="text-gray-300">Precio unitario</span>
                    <span className="text-xl font-bold text-white">180€</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#4CAF50]/30">
                    <span className="text-gray-300">Unidades/mes</span>
                    <span className="text-xl font-bold text-white">25</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#4CAF50]/30">
                    <span className="text-gray-300">Costes materiales</span>
                    <span className="text-xl font-bold text-white">-1.200€</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#4CAF50]/30">
                    <span className="text-gray-300">Costes fijos</span>
                    <span className="text-xl font-bold text-white">-800€</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-bold text-[#4CAF50]">Beneficio neto/mes</span>
                    <span className="text-3xl font-bold text-[#4CAF50]">2.500€</span>
                  </div>
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-400">Margen: <span className="text-[#4CAF50] font-bold">55%</span></p>
                    <p className="text-sm text-gray-400">Satisfacción cliente: <span className="text-[#4CAF50] font-bold">9.2/10</span></p>
                  </div>
                </div>
              </div>

              {/* Industrial */}
              <div className="bg-gradient-to-br from-[#FF6B35]/20 to-black border-2 border-[#FF6B35] p-8">
                <h4 className="text-2xl font-bold text-[#FF6B35] mb-6 text-center">Modelo Industrial Competidor</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#FF6B35]/30">
                    <span className="text-gray-300">Precio unitario</span>
                    <span className="text-xl font-bold text-white">35€</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#FF6B35]/30">
                    <span className="text-gray-300">Unidades/mes</span>
                    <span className="text-xl font-bold text-white">150</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#FF6B35]/30">
                    <span className="text-gray-300">Costes materiales</span>
                    <span className="text-xl font-bold text-white">-2.100€</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#FF6B35]/30">
                    <span className="text-gray-300">Costes fijos</span>
                    <span className="text-xl font-bold text-white">-1.800€</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-bold text-[#FF6B35]">Beneficio neto/mes</span>
                    <span className="text-3xl font-bold text-[#FF6B35]">1.350€</span>
                  </div>
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-400">Margen: <span className="text-[#FF6B35] font-bold">26%</span></p>
                    <p className="text-sm text-gray-400">Satisfacción cliente: <span className="text-[#FF6B35] font-bold">6.8/10</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-black/50 border-2 border-[#FFD700] p-6 text-center">
              <p className="text-2xl font-bold text-[#FFD700] mb-2">
                El artesano gana <span className="text-4xl">+85%</span> más trabajando menos horas
              </p>
              <p className="text-gray-300 text-sm">
                Además: mayor satisfacción personal, control total del proceso, relación directa con clientes, y sostenibilidad ambiental
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora Section */}
      <section id="calculadora" className="py-20 bg-gradient-to-b from-[#0a0a1a] to-[#0a0a0a]">
        <div className="container px-4">
          <CalculadoraViabilidad />
        </div>
      </section>

      {/* Recursos Section */}
      <section id="recursos" className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0a1a0a]">
        <div className="container px-4">
          <RecursosDescargables />
        </div>
      </section>

      {/* Mapa Éxito Section */}
      <section id="mapa-exito" className="py-20 bg-gradient-to-b from-[#0a1a0a] to-[#0a0a0a]">
        <div className="container px-4">
          <MapaExito />
        </div>
      </section>

      {/* Impacto Section */}
      <section id="impacto" className="py-20 bg-[#0a0a0a]">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Impacto <span className="text-[#00D9FF]">Multidimensional</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Más allá de los números: preservamos identidad, generamos empleo y revitalizamos comarcas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: TrendingUp,
                title: "ECONÓMICO",
                value: "18.1M€/año",
                desc: "Digitalización + Turismo experiencial + Exportación artesanal",
                color: "#4CAF50"
              },
              {
                icon: Users,
                title: "EMPLEO",
                value: "+450 puestos",
                desc: "177 talleres × 2.5 empleos promedio. Trabajo cualificado y sostenible.",
                color: "#00D9FF"
              },
              {
                icon: AlertTriangle,
                title: "CULTURAL",
                value: "30 oficios preservados",
                desc: "Patrimonio inmaterial protegido y transmitido a nuevas generaciones.",
                color: "#FFD700"
              },
              {
                icon: MapPin,
                title: "SOCIAL",
                value: "15 comarcas revitalizadas",
                desc: "Desarrollo rural, fijación de población joven y diversificación económica.",
                color: "#FF6B35"
              }
            ].map((item, i) => (
              <div key={i} className="bg-black/50 border-2 p-8 hover:scale-105 transition-all" style={{ borderColor: item.color }}>
                <item.icon className="w-12 h-12 mb-4" style={{ color: item.color }} />
                <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">{item.title}</h3>
                <p className="text-4xl font-bold mb-3" style={{ color: item.color }}>{item.value}</p>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a0a1a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2300D9FF' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              La Decisión es <span className="text-[#FF6B35]">Ahora</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Cada año de espera significa oficios perdidos para siempre. 
              Cada maestro que se retira sin aprendices es conocimiento irrecuperable.
            </p>
            <p className="text-2xl font-bold text-[#00D9FF] mb-12">
              ¿Vamos a permitir que desaparezca nuestra identidad artesanal?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold px-10 py-7 text-lg"
                >
                  Explorar Mapa Interactivo <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10 px-10 py-7 text-lg"
                onClick={() => window.open('https://mapaofcv-etsw4d6s.manus.space/', '_blank')}
              >
                Descargar Informe Completo
              </Button>
            </div>

            <div className="mt-16 pt-16 border-t border-gray-800">
              <p className="text-gray-400 text-sm mb-2">Proyecto de investigación y documentación</p>
              <p className="text-[#00D9FF] font-bold text-lg">ARTENIA LAB · Biblioteca de los Oficios</p>
              <p className="text-gray-500 text-xs mt-4">
                271 talleres documentados · 29 variables por registro · Datos verificados 2024-2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
