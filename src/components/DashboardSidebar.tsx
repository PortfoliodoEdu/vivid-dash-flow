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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center justify-between p-5 border-b border-sidebar-border bg-background">
        {open && (
          <img src={logoGrupoFN} alt="Grupo FN" className="h-32 w-auto" />
        )}
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

      {open && user && (
        <div className="p-4 border-b border-sidebar-border bg-muted/30">
          <p className="text-xs text-muted-foreground">Logado como:</p>
          <p className="text-sm font-medium text-foreground">{user.name}</p>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
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
            <SidebarGroupLabel>Visualização</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/tv"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-sidebar-accent/50"
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

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
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
