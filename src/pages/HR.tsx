import { ExpandableChart } from "@/components/ExpandableChart";
import { Card } from "@/components/ui/card";
import { CustomTooltip } from "@/components/CustomTooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { Users, DollarSign, TrendingUp, UserX, Clock } from "lucide-react";

const colaboradoresPorDepartamento = [
  { departamento: "Operacional", colaboradores: 45, custo: 225000 },
  { departamento: "Comercial", colaboradores: 12, custo: 96000 },
  { departamento: "Administrativo", colaboradores: 18, custo: 108000 },
  { departamento: "Marketing", colaboradores: 8, custo: 56000 },
  { departamento: "TI", colaboradores: 7, custo: 63000 },
  { departamento: "RH", colaboradores: 5, custo: 35000 },
  { departamento: "Financeiro", colaboradores: 5, custo: 42000 },
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
  const totalColaboradores = colaboradoresPorDepartamento.reduce((acc, curr) => acc + curr.colaboradores, 0);
  const folhaTotal = colaboradoresPorDepartamento.reduce((acc, curr) => acc + curr.custo, 0);
  const custoMedioColab = folhaTotal / totalColaboradores;
  const receitaAtual = 1125000; // Do Overview
  const percentualFolha = ((folhaTotal / receitaAtual) * 100).toFixed(1);

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Recursos Humanos</h1>
        <p className="text-muted-foreground">Gestão de pessoas, custos e performance da equipe</p>
      </div>

      {/* KPIs de RH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total de Colaboradores</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{totalColaboradores}</p>
          <p className="text-xs text-muted-foreground mt-2">Headcount total</p>
        </Card>

        <Card className="p-5 gradient-card border-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Folha de Pagamento</h3>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            R$ {(folhaTotal / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-muted-foreground mt-2">{percentualFolha}% da receita</p>
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
          <p className="text-3xl font-bold text-success">2.0%</p>
          <p className="text-xs text-muted-foreground mt-2">Última medição</p>
        </Card>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 gap-6">
        <ExpandableChart 
          title="Distribuição de Colaboradores por Departamento"
          description="Headcount e custo total de pessoal por departamento. Mostra onde estão concentrados os recursos humanos e seus respectivos custos de folha de pagamento."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={colaboradoresPorDepartamento} layout="vertical">
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
            title="Produtividade: Receita vs Custo por Colaborador"
            description="Receita gerada por colaborador comparada ao custo médio. Indicador de eficiência: quanto maior a distância entre as linhas, maior a produtividade da equipe."
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
                  name="Custo/Colab"
                  cursor="pointer"
                />
              </LineChart>
            </ResponsiveContainer>
          </ExpandableChart>

          <ExpandableChart 
            title="Movimentação de Pessoal (Turnover)"
            description="Contratações (admissões) vs desligamentos mensais. A taxa de turnover indica a rotatividade da equipe - valores altos podem indicar problemas de retenção ou insatisfação."
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
            description="Net Promoter Score interno mede a satisfação e lealdade dos colaboradores. Pontuação de 0-100: acima de 70 é excelente, 50-70 é bom, abaixo de 50 requer atenção."
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
            description="Situação atual do pipeline de recrutamento: vagas abertas aguardando divulgação, vagas em processo seletivo e vagas fechadas no mês. Monitora a eficiência do RH."
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

          <Card className="p-6 gradient-card border-border shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-6">Indicadores de RH</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Tempo Médio de Permanência</p>
                  <p className="text-xs text-muted-foreground">Média geral</p>
                </div>
                <p className="text-2xl font-bold text-primary">3.2 anos</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Taxa de Absenteísmo</p>
                  <p className="text-xs text-muted-foreground">Faltas injustificadas</p>
                </div>
                <p className="text-2xl font-bold text-success">1.2%</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Tempo Médio de Contratação</p>
                  <p className="text-xs text-muted-foreground">Da vaga ao início</p>
                </div>
                <p className="text-2xl font-bold text-foreground">28 dias</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">Custo por Contratação</p>
                  <p className="text-xs text-muted-foreground">Média por vaga</p>
                </div>
                <p className="text-2xl font-bold text-foreground">R$ 3.2K</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Análise Detalhada por Departamento */}
      <Card className="p-6 gradient-card border-border shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-6">Análise por Departamento</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Departamento</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Colaboradores</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Custo Total</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Custo/Pessoa</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {colaboradoresPorDepartamento.map((dept) => (
                <tr key={dept.departamento} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{dept.departamento}</td>
                  <td className="text-right py-3 px-2 text-foreground">{dept.colaboradores}</td>
                  <td className="text-right py-3 px-2 text-foreground">
                    R$ {(dept.custo / 1000).toFixed(0)}K
                  </td>
                  <td className="text-right py-3 px-2 text-muted-foreground">
                    R$ {(dept.custo / dept.colaboradores / 1000).toFixed(1)}K
                  </td>
                  <td className="text-right py-3 px-2 text-primary font-medium">
                    {((dept.colaboradores / totalColaboradores) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
