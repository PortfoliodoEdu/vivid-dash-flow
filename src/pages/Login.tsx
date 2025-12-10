import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logoGrupoFN from "@/assets/logo-grupofn.png";
import { Lock, User, LogIn } from "lucide-react";
import { toast } from "sonner";

// Credenciais simuladas por departamento
const credentials: Record<string, { password: string; role: UserRole }> = {
  master: { password: "master123", role: "master" },
  comercial: { password: "comercial123", role: "comercial" },
  marketing: { password: "marketing123", role: "marketing" },
  financeiro: { password: "financeiro123", role: "financeiro" },
  rh: { password: "rh123", role: "rh" },
  suporte: { password: "suporte123", role: "suporte" },
};

const departmentLabels: Record<string, string> = {
  master: "Master",
  comercial: "Comercial",
  marketing: "Marketing",
  financeiro: "Financeiro",
  rh: "Recursos Humanos",
  suporte: "Suporte",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!department) {
      toast.error("Selecione um departamento");
      return;
    }
    
    if (!password) {
      toast.error("Digite a senha");
      return;
    }

    setIsLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      const cred = credentials[department];
      
      if (cred && cred.password === password) {
        login(cred.role);
        toast.success(`Bem-vindo ao Dashboard ${departmentLabels[department]}!`);
        
        // Redirecionar baseado no role
        switch (cred.role) {
          case "rh":
            navigate("/hr");
            break;
          case "comercial":
          case "marketing":
            navigate("/clients");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error("Credenciais inválidas");
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Glassmorphic login card */}
      <Card className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="space-y-6">
          {/* Logo and header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <img src={logoGrupoFN} alt="Grupo FN" className="h-20 w-auto" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Dashboard Executivo</h1>
              <p className="text-white/60 text-sm mt-1">
                Acesse o painel do seu departamento
              </p>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-white/80 text-sm font-medium">
                Departamento
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger 
                    id="department"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20 h-12"
                  >
                    <SelectValue placeholder="Selecione seu departamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {Object.entries(departmentLabels).map(([key, label]) => (
                      <SelectItem 
                        key={key} 
                        value={key}
                        className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80 text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20 h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold shadow-lg shadow-primary/25 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-center text-white/40 text-xs">
              © {new Date().getFullYear()} Grupo FN. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
