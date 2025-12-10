import { useNavigate } from "react-router-dom";
import { useAuth, UserRole, roleNames } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoGrupoFN from "@/assets/logo-grupofn.png";
import { 
  Shield, 
  BarChart3, 
  Megaphone, 
  DollarSign, 
  Users, 
  Wrench 
} from "lucide-react";

const roleIcons: Record<UserRole, React.ReactNode> = {
  master: <Shield className="h-8 w-8" />,
  comercial: <BarChart3 className="h-8 w-8" />,
  marketing: <Megaphone className="h-8 w-8" />,
  financeiro: <DollarSign className="h-8 w-8" />,
  rh: <Users className="h-8 w-8" />,
  suporte: <Wrench className="h-8 w-8" />,
};

const roleDescriptions: Record<UserRole, string> = {
  master: "Acesso completo a todas as telas e funcionalidades do sistema, incluindo visualização de métricas de todos os departamentos e configurações avançadas.",
  comercial: "Acesso às telas de Clientes e Retenção, Comercial e Vendas, Margem por Serviço e Marketing para acompanhamento de performance comercial.",
  marketing: "Acesso às telas de Clientes e Retenção, Comercial e Vendas, Margem por Serviço e Marketing para análise de campanhas e ROI.",
  financeiro: "Acesso a todas as telas exceto Recursos Humanos, permitindo análise financeira completa, DRE, fluxo de caixa e métricas de negócio.",
  rh: "Acesso exclusivo à tela de Recursos Humanos para gestão de pessoas, custos de pessoal, turnover e indicadores de RH.",
  suporte: "Acesso completo a todas as telas com permissão para inserir dados manuais por área, ideal para gestores de cada departamento.",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    
    // Redirect based on role
    switch (role) {
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
  };

  const roles: UserRole[] = ["master", "comercial", "marketing", "financeiro", "rh", "suporte"];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <img src={logoGrupoFN} alt="Grupo FN" className="h-24 w-auto" />
          <h1 className="text-3xl font-bold text-foreground">Dashboard Executivo</h1>
          <p className="text-muted-foreground text-center max-w-lg">
            Selecione seu perfil de acesso para visualizar os dashboards e métricas disponíveis para seu departamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card
              key={role}
              className="p-6 gradient-card border-border shadow-soft hover:shadow-hover transition-all duration-300 cursor-pointer group"
              onClick={() => handleLogin(role)}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {roleIcons[role]}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{roleNames[role]}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {roleDescriptions[role]}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Acessar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
