import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/reset-password");
  
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // Obtener token de URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Token no encontrado en la URL");
      setTimeout(() => setLocation("/bienvenida"), 2000);
    }
  }, [setLocation]);

  // Validar token
  const validateTokenQuery = trpc.auth.validateResetToken.useQuery(
    { token },
    {
      enabled: !!token,
      onSuccess: (data) => {
        setIsValidating(false);
        setIsValid(data.valid);
        if (!data.valid) {
          toast.error("El enlace ha expirado o no es válido");
          setTimeout(() => setLocation("/bienvenida"), 3000);
        }
      },
      onError: () => {
        setIsValidating(false);
        setIsValid(false);
        toast.error("Error al validar el enlace");
        setTimeout(() => setLocation("/bienvenida"), 3000);
      },
    }
  );

  const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      setTimeout(() => setLocation("/bienvenida"), 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Error al restablecer contraseña");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    resetPasswordMutation.mutate({
      token,
      newPassword,
    });
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Validando enlace...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">Enlace Inválido</h1>
          <p className="text-gray-300 mb-4">
            El enlace ha expirado o no es válido. Por favor, solicita uno nuevo.
          </p>
          <p className="text-gray-400 text-sm">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid hexagonal de fondo */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(30deg, transparent 48%, #22d3ee 49%, #22d3ee 51%, transparent 52%),
            linear-gradient(150deg, transparent 48%, #22d3ee 49%, #22d3ee 51%, transparent 52%)
          `,
          backgroundSize: '50px 86.6px',
        }}
      />

      {/* Logo marca de agua */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ opacity: 0.03 }}
      >
        <img 
          src="/artenia_glowing.png" 
          alt="ARTENIA LAB" 
          className="w-[600px] h-[600px] object-contain"
        />
      </div>

      <div className="relative z-10 bg-gray-800/50 border-2 border-cyan-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(34,211,238,0.2)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">
            Nueva Contraseña
          </h1>
          <p className="text-gray-400">
            Crea una contraseña segura para tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-300">
              Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                className="bg-gray-900/50 border-cyan-500/30 text-white placeholder:text-gray-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              required
              minLength={8}
              className="bg-gray-900/50 border-cyan-500/30 text-white placeholder:text-gray-500"
            />
          </div>

          {newPassword && confirmPassword && (
            <div className="flex items-start gap-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              {newPassword === confirmPassword ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-400">Las contraseñas coinciden</p>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400">⚠️</div>
                  <p className="text-sm text-red-400">Las contraseñas no coinciden</p>
                </>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={resetPasswordMutation.isLoading || newPassword !== confirmPassword || newPassword.length < 8}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-gray-900 font-bold py-3 rounded-lg shadow-[0_4px_20px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetPasswordMutation.isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                Actualizando...
              </span>
            ) : (
              "Restablecer Contraseña"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setLocation("/bienvenida")}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
