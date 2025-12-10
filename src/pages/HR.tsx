import { useState } from "react";
import { ExpandableChart } from "@/components/ExpandableChart";
import { Card } from "@/components/ui/card";
import { CustomTooltip } from "@/components/CustomTooltip";
import { AccountSelector } from "@/components/AccountSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { Users, DollarSign, TrendingUp, UserX } from "lucide-react";

const departamentos = [
  { id: "all", nome: "Todos os Departamentos" },
  { id: "operacional", nome: "Operacional" },
  { id: "comercial", nome: "Comercial" },
  { id: "administrativo", nome: "Administrativo" },
  { id: "marketing", nome: "Marketing" },
  { id: "ti", nome: "TI" },
  { id: "rh", nome: "RH" },
  { id: "financeiro", nome: "Financeiro" },
];

const colaboradoresPorDepartamento = [
  { departamento: "Operacional", colaboradores: 45, custo: 225000, turnover: 2.2, nps: 68, absenteismo: 1.5 },
  { departamento: "Comercial", colaboradores: 12, custo: 96000, turnover: 3.5, nps: 72, absenteismo: 0.8 },
  { departamento: "Administrativo", colaboradores: 18, custo: 108000, turnover: 1.8, nps: 75, absenteismo: 1.2 },
  { departamento: "Marketing", colaboradores: 8, custo: 56000, turnover: 1.5, nps: 78, absenteismo: 0.5 },
  { departamento: "TI", colaboradores: 7, custo: 63000, turnover: 2.0, nps: 80, absenteismo: 0.3 },
  { departamento: "RH", colaboradores: 5, custo: 35000, turnover: 1.0, nps: 82, absenteismo: 0.4 },
  { departamento: "Financeiro", colaboradores: 5, custo: 42000, turnover: 0.8, nps: 76, absenteismo: 0.6 },
];

const produtividadeData = [
  { month: "Jan", receitaColab: 8500, custoColab: 6250 },
  { month: "Fev", receitaColab: 8980, custoColab: 6250 },
  { month: "Mar", receitaColab: 9450, custoColab: 6250 },
  { month: "Abr", receitaColab: 10040, custoColab: 6250 },
  { month: "Mai", receitaColab: 10570, custoColab: 6250 },
  { month: "Jun", receitaColab: 11250, custoColab: 6250 },
];

const turnoverData = [
  { month: "Jan", admissoes: 3, desligamentos: 2, turnover: 2.0 },
  { month: "Fev", admissoes: 2, desligamentos: 1, turnover: 1.0 },
  { month: "Mar", admissoes: 4, desligamentos: 3, turnover: 3.0 },
  { month: "Abr", admissoes: 5, desligamentos: 2, turnover: 2.0 },
  { month: "Mai", admissoes: 3, desligamentos: 1, turnover: 1.0 },
  { month: "Jun", admissoes: 2, desligamentos: 2, turnover: 2.0 },
];

const vagasData = [
  { status: "Abertas", quantidade: 8 },
  { status: "Em Processo", quantidade: 12 },
  { status: "Fechadas (mês)", quantidade: 5 },
];

const npsInternoData = [
  { name: "NPS", value: 72, fill: "hsl(142 76% 36%)" },
  { name: "Restante", value: 28, fill: "hsl(var(--muted))" },
];

const COLORS = ["hsl(0 84% 60%)", "hsl(38 92% 50%)", "hsl(142 76% 36%)"];

export default function HR() {
  const [selectedDepartamento, setSelectedDepartamento] = useState("all");

  const filteredData = selectedDepartamento === "all" 
    ? colaboradoresPorDepartamento 
    : colaboradoresPorDepartamento.filter(d => d.departamento.toLowerCase() === selectedDepartamento);

  const totalColaboradores = filteredData.reduce((acc, curr) => acc + curr.colaboradores, 0);
  const folhaTotal = filteredData.reduce((acc, curr) => acc + curr.custo, 0);
  const custoMedioColab = totalColaboradores > 0 ? folhaTotal / totalColaboradores : 0;
  const receitaAtual = 1125000;
  const percentualFolha = ((folhaTotal / receitaAtual) * 100).toFixed(1);
  const turnoverMedio = (filteredData.reduce((acc, curr) => acc + curr.turnover, 0) / filteredData.length).toFixed(1);

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Recursos Humanos</h1>
          <p className="text-muted-foreground">Gestão de pessoas, custos e performance da equipe por departamento</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filtrar por departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AccountSelector />
        </div>
      </div>

      {/* KPIs de RH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total de Colaboradores</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{totalColaboradores}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {selectedDepartamento === "all" ? "Headcount total" : `Departamento: ${filteredData[0]?.departamento}`}
          </p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Custo RH vs Faturamento</h3>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{percentualFolha}%</p>
          <p className="text-xs text-muted-foreground mt-2">
            R$ {(folhaTotal / 1000).toFixed(0)}K / R$ {(receitaAtual / 1000).toFixed(0)}K
          </p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Custo por Colaborador</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            R$ {(custoMedioColab / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-muted-foreground mt-2">Média mensal</p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Taxa de Turnover</h3>
            <UserX className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-success">{turnoverMedio}%</p>
          <p className="text-xs text-muted-foreground mt-2">Média do período</p>
        </Card>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 gap-6">
        <ExpandableChart 
          title="Distribuição de Colaboradores e Custos por Departamento"
          description="Headcount e custo total de pessoal por departamento. Mostra onde estão concentrados os recursos humanos e seus respectivos custos de folha de pagamento."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="departamento" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="colaboradores" fill="hsl(217 91% 60%)" name="Colaboradores" cursor="pointer" />
              <Bar dataKey="custo" fill="hsl(142 76% 36%)" name="Custo (R$)" cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableChart>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpandableChart 
            title="Custo RH vs Receita por Colaborador"
            description="Compara a receita gerada por colaborador com o custo médio. A diferença entre as linhas representa a produtividade líquida de cada colaborador para a empresa."
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={produtividadeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip valuePrefix="R$ " />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="receitaColab"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={3}
                  name="Receita/Colab"
                  cursor="pointer"
                />
                <Line
                  type="monotone"
                  dataKey="custoColab"
                  stroke="hsl(0 84% 60%)"
                  strokeWidth={3}
                  name="Custo RH/Colab"
                  cursor="pointer"
                />
              </LineChart>
            </ResponsiveContainer>
          </ExpandableChart>

          <ExpandableChart 
            title="Movimentação de Pessoal (Turnover)"
            description="Contratações (admissões) vs desligamentos mensais. A taxa de turnover indica a rotatividade da equipe."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="admissoes" fill="hsl(142 76% 36%)" name="Admissões" cursor="pointer" />
                <Bar dataKey="desligamentos" fill="hsl(0 84% 60%)" name="Desligamentos" cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
          </ExpandableChart>

          <ExpandableChart 
            title="NPS Interno - Farol de Satisfação"
            description="Net Promoter Score interno mede a satisfação e lealdade dos colaboradores. Pontuação de 0-100."
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={npsInternoData}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {npsInternoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-4xl font-bold"
                  fill="hsl(var(--foreground))"
                >
                  72
                </text>
                <text
                  x="50%"
                  y="75%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm"
                  fill="hsl(var(--muted-foreground))"
                >
                  Excelente
                </text>
              </PieChart>
            </ResponsiveContainer>
          </ExpandableChart>

          <ExpandableChart 
            title="Status de Vagas (Recrutamento)"
            description="Situação atual do pipeline de recrutamento: vagas abertas, em processo seletivo e fechadas no mês."
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vagasData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, quantidade }) => `${status}: ${quantidade}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="quantidade"
                  cursor="pointer"
                >
                  {vagasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ExpandableChart>
        </div>
      </div>

      {/* Indicadores por Departamento */}
      <Card className="p-6 gradient-card border-border shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-6">Indicadores Detalhados por Departamento</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Departamento</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Colaboradores</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Custo Total</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Custo/Pessoa</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Turnover</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">NPS Interno</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Absenteísmo</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((dept) => (
                <tr key={dept.departamento} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{dept.departamento}</td>
                  <td className="text-right py-3 px-2 text-foreground">{dept.colaboradores}</td>
                  <td className="text-right py-3 px-2 text-foreground">
                    R$ {(dept.custo / 1000).toFixed(0)}K
                  </td>
                  <td className="text-right py-3 px-2 text-muted-foreground">
                    R$ {(dept.custo / dept.colaboradores / 1000).toFixed(1)}K
                  </td>
                  <td className={`text-right py-3 px-2 font-medium ${dept.turnover <= 2 ? 'text-success' : dept.turnover <= 3 ? 'text-warning' : 'text-destructive'}`}>
                    {dept.turnover}%
                  </td>
                  <td className={`text-right py-3 px-2 font-medium ${dept.nps >= 75 ? 'text-success' : dept.nps >= 50 ? 'text-warning' : 'text-destructive'}`}>
                    {dept.nps}
                  </td>
                  <td className={`text-right py-3 px-2 font-medium ${dept.absenteismo <= 1 ? 'text-success' : dept.absenteismo <= 2 ? 'text-warning' : 'text-destructive'}`}>
                    {dept.absenteismo}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Card de Indicadores Adicionais */}
      <Card className="p-6 gradient-card border-border shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-6">Indicadores Gerais de RH</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Tempo Médio de Permanência</p>
            <p className="text-3xl font-bold text-primary">3.2 anos</p>
            <p className="text-xs text-muted-foreground">Média geral</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Taxa de Absenteísmo</p>
            <p className="text-3xl font-bold text-success">1.2%</p>
            <p className="text-xs text-muted-foreground">Faltas injustificadas</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Tempo Médio de Contratação</p>
            <p className="text-3xl font-bold text-foreground">28 dias</p>
            <p className="text-xs text-muted-foreground">Da vaga ao início</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Custo por Contratação</p>
            <p className="text-3xl font-bold text-foreground">R$ 3.2K</p>
            <p className="text-xs text-muted-foreground">Média por vaga</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
