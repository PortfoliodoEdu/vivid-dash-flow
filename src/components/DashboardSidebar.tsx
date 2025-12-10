import { LayoutDashboard, TrendingUp, Users, Target, DollarSign, Menu, UserCheck, BarChart3, Package, Tv, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logoGrupoFN from "@/assets/logo-grupofn.png";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Visão Executiva", url: "/", icon: LayoutDashboard, page: "overview" },
  { title: "Clientes & Retenção", url: "/clients", icon: UserCheck, page: "clients" },
  { title: "Comercial & Vendas", url: "/sales", icon: BarChart3, page: "sales" },
  { title: "Margem por Serviço", url: "/services", icon: Package, page: "services" },
  { title: "Marketing & ROI", url: "/marketing", icon: Target, page: "marketing" },
  { title: "Financeiro & DRE", url: "/financial", icon: TrendingUp, page: "financial" },
  { title: "Fluxo de Caixa", url: "/cashflow", icon: DollarSign, page: "cashflow" },
  { title: "Recursos Humanos", url: "/hr", icon: Users, page: "hr" },
];

export function DashboardSidebar() {
  const { open } = useSidebar();
  const { user, logout, canAccess } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredMenuItems = menuItems.filter(item => canAccess(item.page));

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-sidebar-border"
      style={{
        background: 'linear-gradient(180deg, #2C313D 0%, #252931 100%)',
      }}
    >
      {/* Logo header */}
      <div 
        className="flex items-center justify-between p-5 border-b"
        style={{ 
          borderColor: 'rgba(255,255,255,0.06)',
          background: '#041AAA',
        }}
      >
        {open && (
          <img src={logoGrupoFN} alt="Grupo FN" className="h-24 w-auto brightness-0 invert" />
        )}
        <SidebarTrigger className="text-white hover:bg-white/10">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

      {/* User info */}
      {open && user && (
        <div 
          className="p-4 border-b"
          style={{ 
            borderColor: 'rgba(255,255,255,0.06)',
            background: 'rgba(87,95,255,0.1)',
          }}
        >
          <p className="text-xs" style={{ color: '#7689FF' }}>Logado como:</p>
          <p className="text-sm font-medium text-white">{user.name}</p>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ color: '#7689FF' }}>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `transition-all duration-200 ${
                          isActive
                            ? "text-white font-medium"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        }`
                      }
                      style={({ isActive }) => 
                        isActive 
                          ? { background: 'linear-gradient(90deg, #4141E9, #575FFF)' }
                          : {}
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {canAccess("tv") && (
          <SidebarGroup>
            <SidebarGroupLabel style={{ color: '#7689FF' }}>Visualização</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/tv"
                      className={({ isActive }) =>
                        `transition-all duration-200 ${
                          isActive
                            ? "text-white font-medium"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        }`
                      }
                      style={({ isActive }) => 
                        isActive 
                          ? { background: 'linear-gradient(90deg, #4141E9, #575FFF)' }
                          : {}
                      }
                    >
                      <Tv className="h-4 w-4" />
                      {open && <span>Modo TV</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start transition-all duration-200 hover:bg-red-500/20"
                    style={{ color: '#ff6b6b' }}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    {open && <span>Sair</span>}
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
