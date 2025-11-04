import { LayoutDashboard, TrendingUp, Users, Target, DollarSign, Menu, UserCheck, BarChart3, Package, Tv } from "lucide-react";
import { NavLink } from "react-router-dom";
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
  { title: "Visão Executiva", url: "/", icon: LayoutDashboard },
  { title: "Clientes & Retenção", url: "/clients", icon: UserCheck },
  { title: "Comercial & Vendas", url: "/sales", icon: BarChart3 },
  { title: "Margem por Serviço", url: "/services", icon: Package },
  { title: "Marketing & ROI", url: "/marketing", icon: Target },
  { title: "Financeiro & DRE", url: "/financial", icon: TrendingUp },
  { title: "Fluxo de Caixa", url: "/cashflow", icon: DollarSign },
  { title: "Recursos Humanos", url: "/hr", icon: Users },
];

export function DashboardSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {open && (
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Painel Analytics
          </h2>
        )}
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}
