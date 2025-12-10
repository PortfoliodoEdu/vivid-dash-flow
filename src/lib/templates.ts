// Complete template definitions for each dashboard page
// OPTIMIZED: Only essential raw data fields - calculated fields are auto-generated
import * as XLSX from 'xlsx';
import { generateMappings, applyMappings, applyComputedFields, MappingResult, ColumnMapping } from './columnMapping';

export interface TemplateColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'percentage';
  required: boolean;
  description?: string; // Help text for users
  computed?: boolean; // If true, this field is auto-calculated
}

export interface PageTemplate {
  pageId: string;
  pageName: string;
  description: string;
  sheets: {
    sheetName: string;
    columns: TemplateColumn[];
    sampleData: any[];
  }[];
}

// ============================================
// HR Page Template - SIMPLIFIED
// ============================================
export const hrTemplate: PageTemplate = {
  pageId: 'hr',
  pageName: 'Recursos Humanos',
  description: 'Dados de RH: colaboradores, custos e turnover por departamento',
  sheets: [
    {
      sheetName: 'Departamentos',
      columns: [
        { key: 'departamento', label: 'Departamento', type: 'string', required: true, description: 'Nome do departamento' },
        { key: 'colaboradores', label: 'Colaboradores', type: 'number', required: true, description: 'Quantidade de funcionários' },
        { key: 'custo', label: 'Custo RH (R$)', type: 'number', required: true, description: 'Custo total com pessoal' },
        { key: 'nps', label: 'NPS Interno', type: 'number', required: false, description: 'Nota de satisfação (0-100)' },
        { key: 'absenteismo', label: 'Absenteísmo (%)', type: 'percentage', required: false, description: 'Taxa de ausências' },
      ],
      sampleData: [
        { departamento: 'Operacional', colaboradores: 45, custo: 225000, nps: 68, absenteismo: 1.5 },
        { departamento: 'Comercial', colaboradores: 12, custo: 96000, nps: 72, absenteismo: 0.8 },
        { departamento: 'Administrativo', colaboradores: 18, custo: 108000, nps: 75, absenteismo: 1.2 },
        { departamento: 'Marketing', colaboradores: 8, custo: 56000, nps: 78, absenteismo: 0.5 },
        { departamento: 'TI', colaboradores: 7, custo: 63000, nps: 80, absenteismo: 0.3 },
        { departamento: 'RH', colaboradores: 5, custo: 35000, nps: 82, absenteismo: 0.4 },
        { departamento: 'Financeiro', colaboradores: 5, custo: 42000, nps: 76, absenteismo: 0.6 },
      ]
    },
    {
      sheetName: 'Movimentacoes',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true, description: 'Ex: Jan, Fev, Mar...' },
        { key: 'admissoes', label: 'Admissões', type: 'number', required: true, description: 'Contratações no mês' },
        { key: 'desligamentos', label: 'Desligamentos', type: 'number', required: true, description: 'Saídas no mês' },
      ],
      sampleData: [
        { month: 'Jan', admissoes: 3, desligamentos: 2 },
        { month: 'Fev', admissoes: 2, desligamentos: 1 },
        { month: 'Mar', admissoes: 4, desligamentos: 3 },
        { month: 'Abr', admissoes: 5, desligamentos: 2 },
        { month: 'Mai', admissoes: 3, desligamentos: 1 },
        { month: 'Jun', admissoes: 2, desligamentos: 2 },
      ]
    },
    {
      sheetName: 'Vagas',
      columns: [
        { key: 'status', label: 'Status', type: 'string', required: true, description: 'Abertas, Em Processo, Fechadas' },
        { key: 'quantidade', label: 'Quantidade', type: 'number', required: true },
      ],
      sampleData: [
        { status: 'Abertas', quantidade: 8 },
        { status: 'Em Processo', quantidade: 12 },
        { status: 'Fechadas (mês)', quantidade: 5 },
      ]
    }
  ]
};

// ============================================
// Cashflow Page Template - SIMPLIFIED
// ============================================
export const cashflowTemplate: PageTemplate = {
  pageId: 'cashflow',
  pageName: 'Fluxo de Caixa',
  description: 'Entradas, saídas e projeções de caixa (saldo é calculado automaticamente)',
  sheets: [
    {
      sheetName: 'Fluxo_Mensal',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'entradas', label: 'Entradas (R$)', type: 'number', required: true, description: 'Total de recebimentos' },
        { key: 'saidas', label: 'Saídas (R$)', type: 'number', required: true, description: 'Total de pagamentos' },
        // saldo é calculado: entradas - saidas
      ],
      sampleData: [
        { month: 'Jan', entradas: 450000, saidas: 382353 },
        { month: 'Fev', entradas: 520000, saidas: 430056 },
        { month: 'Mar', entradas: 480000, saidas: 413784 },
        { month: 'Abr', entradas: 610000, saidas: 504470 },
        { month: 'Mai', entradas: 550000, saidas: 469986 },
        { month: 'Jun', entradas: 670000, saidas: 554090 },
      ]
    },
    {
      sheetName: 'Categorias_Despesas',
      columns: [
        { key: 'categoria', label: 'Categoria', type: 'string', required: true },
        { key: 'valor', label: 'Valor (R$)', type: 'number', required: true },
        // percentual é calculado automaticamente do total
      ],
      sampleData: [
        { categoria: 'Pessoal', valor: 195000 },
        { categoria: 'Marketing', valor: 131000 },
        { categoria: 'Operacional', valor: 88500 },
        { categoria: 'Impostos', valor: 90450 },
        { categoria: 'Diversos', valor: 49140 },
      ]
    },
    {
      sheetName: 'Projecoes',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'previsto', label: 'Cenário Otimista (R$)', type: 'number', required: true },
        { key: 'conservador', label: 'Cenário Conservador (R$)', type: 'number', required: true },
      ],
      sampleData: [
        { month: 'Jul', previsto: 720000, conservador: 680000 },
        { month: 'Ago', previsto: 750000, conservador: 700000 },
        { month: 'Set', previsto: 780000, conservador: 720000 },
        { month: 'Out', previsto: 810000, conservador: 750000 },
      ]
    }
  ]
};

// ============================================
// Financial Page Template - SIMPLIFIED
// ============================================
export const financialTemplate: PageTemplate = {
  pageId: 'financial',
  pageName: 'Financeiro (DRE)',
  description: 'Receitas, custos e despesas (Rec. Líquida e Lucro são calculados automaticamente)',
  sheets: [
    {
      sheetName: 'DRE',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'receitaBruta', label: 'Receita Bruta (R$)', type: 'number', required: true, description: 'Faturamento total' },
        { key: 'impostos', label: 'Impostos (R$)', type: 'number', required: true, description: 'Impostos sobre receita' },
        { key: 'custos', label: 'Custos (R$)', type: 'number', required: true, description: 'Custos diretos' },
        { key: 'despesas', label: 'Despesas (R$)', type: 'number', required: true, description: 'Despesas operacionais' },
        // receitaLiquida = receitaBruta - impostos (calculado)
        // lucro = receitaLiquida - custos - despesas (calculado)
      ],
      sampleData: [
        { month: 'Jan', receitaBruta: 450000, impostos: 60750, custos: 247425, despesas: 74178 },
        { month: 'Fev', receitaBruta: 520000, impostos: 70200, custos: 269892, despesas: 89964 },
        { month: 'Mar', receitaBruta: 480000, impostos: 64800, custos: 274032, despesas: 74952 },
        { month: 'Abr', receitaBruta: 610000, impostos: 82350, custos: 316590, despesas: 105530 },
        { month: 'Mai', receitaBruta: 550000, impostos: 74250, custos: 309988, despesas: 85748 },
        { month: 'Jun', receitaBruta: 670000, impostos: 90450, custos: 347730, despesas: 115910 },
      ]
    },
    {
      sheetName: 'Indicadores',
      columns: [
        { key: 'indicador', label: 'Indicador', type: 'string', required: true },
        { key: 'valor', label: 'Valor', type: 'number', required: true },
      ],
      sampleData: [
        { indicador: 'Liquidez Corrente', valor: 2.8 },
        { indicador: 'Liquidez Seca', valor: 2.1 },
        { indicador: 'Endividamento', valor: 35 },
        { indicador: 'ROE (%)', valor: 18.5 },
        { indicador: 'ROA (%)', valor: 12.3 },
      ]
    }
  ]
};

// ============================================
// Sales Page Template - SIMPLIFIED
// ============================================
export const salesTemplate: PageTemplate = {
  pageId: 'sales',
  pageName: 'Comercial & Vendas',
  description: 'Performance de vendedores e pipeline (métricas derivadas são calculadas)',
  sheets: [
    {
      sheetName: 'Vendedores',
      columns: [
        { key: 'vendedor', label: 'Vendedor', type: 'string', required: true },
        { key: 'oportunidadesConvertidas', label: 'Vendas Realizadas', type: 'number', required: true, description: 'Quantidade de vendas fechadas' },
        { key: 'metaVendas', label: 'Meta (Qtd)', type: 'number', required: true, description: 'Meta de vendas' },
        { key: 'conversao', label: 'Taxa Conversão (%)', type: 'percentage', required: false },
        { key: 'ticket', label: 'Ticket Médio (R$)', type: 'number', required: false },
        { key: 'ligacoes', label: 'Ligações', type: 'number', required: false, description: 'Total de ligações realizadas' },
        { key: 'whatsapp', label: 'WhatsApp', type: 'number', required: false, description: 'Total de mensagens' },
        // contatosNecessarios = (ligacoes + whatsapp) / vendas (calculado)
        // atingimento = vendas / meta * 100 (calculado)
      ],
      sampleData: [
        { vendedor: 'Carlos Silva', oportunidadesConvertidas: 28, metaVendas: 25, conversao: 18.5, ticket: 3200, ligacoes: 145, whatsapp: 89 },
        { vendedor: 'Ana Santos', oportunidadesConvertidas: 32, metaVendas: 30, conversao: 21.2, ticket: 3800, ligacoes: 134, whatsapp: 112 },
        { vendedor: 'Pedro Costa', oportunidadesConvertidas: 24, metaVendas: 25, conversao: 16.8, ticket: 2900, ligacoes: 167, whatsapp: 78 },
        { vendedor: 'Mariana Lima', oportunidadesConvertidas: 35, metaVendas: 30, conversao: 23.4, ticket: 4100, ligacoes: 112, whatsapp: 98 },
        { vendedor: 'João Oliveira', oportunidadesConvertidas: 29, metaVendas: 25, conversao: 19.3, ticket: 3400, ligacoes: 156, whatsapp: 67 },
      ]
    },
    {
      sheetName: 'Pipeline',
      columns: [
        { key: 'estagio', label: 'Estágio', type: 'string', required: true },
        { key: 'quantidade', label: 'Quantidade', type: 'number', required: true },
        { key: 'valor', label: 'Valor (R$)', type: 'number', required: false },
      ],
      sampleData: [
        { estagio: 'Prospecção', quantidade: 245, valor: 784000 },
        { estagio: 'Qualificação', quantidade: 142, valor: 512000 },
        { estagio: 'Proposta', quantidade: 89, valor: 356000 },
        { estagio: 'Negociação', quantidade: 54, valor: 248000 },
        { estagio: 'Fechamento', quantidade: 28, valor: 134000 },
      ]
    },
    {
      sheetName: 'Vendas_Servico',
      columns: [
        { key: 'servico', label: 'Serviço', type: 'string', required: true },
        { key: 'vendas', label: 'Vendas (Qtd)', type: 'number', required: true },
        { key: 'valor', label: 'Valor (R$)', type: 'number', required: false },
      ],
      sampleData: [
        { servico: 'Contabilidade', vendas: 45, valor: 162000 },
        { servico: 'BPO Estratégico', vendas: 32, valor: 128000 },
        { servico: 'BPO RH', vendas: 28, valor: 84000 },
        { servico: 'ClickOn', vendas: 18, valor: 54000 },
        { servico: 'Certificado Digital', vendas: 56, valor: 44800 },
      ]
    },
    {
      sheetName: 'Metas_Time',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'meta', label: 'Meta (Qtd)', type: 'number', required: true },
        { key: 'realizado', label: 'Realizado (Qtd)', type: 'number', required: true },
      ],
      sampleData: [
        { month: 'Jan', meta: 120, realizado: 118 },
        { month: 'Fev', meta: 125, realizado: 132 },
        { month: 'Mar', meta: 130, realizado: 127 },
        { month: 'Abr', meta: 135, realizado: 145 },
        { month: 'Mai', meta: 140, realizado: 138 },
        { month: 'Jun', meta: 145, realizado: 152 },
      ]
    }
  ]
};

// ============================================
// Marketing Page Template - SIMPLIFIED
// ============================================
export const marketingTemplate: PageTemplate = {
  pageId: 'marketing',
  pageName: 'Marketing',
  description: 'Investimento e leads por canal (ROI e CPL são calculados automaticamente)',
  sheets: [
    {
      sheetName: 'Canais',
      columns: [
        { key: 'canal', label: 'Canal', type: 'string', required: true },
        { key: 'investimento', label: 'Investimento (R$)', type: 'number', required: true },
        { key: 'leads', label: 'Leads Gerados', type: 'number', required: true },
        { key: 'conversao', label: 'Taxa Conversão (%)', type: 'percentage', required: false },
        // roi e cpl são calculados
      ],
      sampleData: [
        { canal: 'Google Ads', investimento: 45000, leads: 1250, conversao: 12.5 },
        { canal: 'Facebook Ads', investimento: 32000, leads: 980, conversao: 9.8 },
        { canal: 'Instagram Ads', investimento: 28000, leads: 850, conversao: 11.2 },
        { canal: 'LinkedIn Ads', investimento: 18000, leads: 420, conversao: 15.8 },
        { canal: 'Orgânico (SEO)', investimento: 8000, leads: 620, conversao: 18.5 },
      ]
    },
    {
      sheetName: 'Resultado_Mensal',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'investimento', label: 'Investimento (R$)', type: 'number', required: true },
        { key: 'receita', label: 'Receita Gerada (R$)', type: 'number', required: true },
        // roi = (receita - investimento) / investimento * 100 (calculado)
      ],
      sampleData: [
        { month: 'Jan', investimento: 95000, receita: 245000 },
        { month: 'Fev', investimento: 102000, receita: 278000 },
        { month: 'Mar', investimento: 98000, receita: 256000 },
        { month: 'Abr', investimento: 115000, receita: 321000 },
        { month: 'Mai', investimento: 108000, receita: 298000 },
        { month: 'Jun', investimento: 131000, receita: 368000 },
      ]
    },
    {
      sheetName: 'Funil',
      columns: [
        { key: 'etapa', label: 'Etapa', type: 'string', required: true },
        { key: 'valor', label: 'Quantidade', type: 'number', required: true },
        // taxa de conversão é calculada da progressão
      ],
      sampleData: [
        { etapa: 'Visitantes', valor: 15420 },
        { etapa: 'Leads', valor: 4120 },
        { etapa: 'MQLs', valor: 1856 },
        { etapa: 'SQLs', valor: 834 },
        { etapa: 'Clientes', valor: 125 },
      ]
    }
  ]
};

// ============================================
// Clients Page Template - SIMPLIFIED
// ============================================
export const clientsTemplate: PageTemplate = {
  pageId: 'clients',
  pageName: 'Clientes & Retenção',
  description: 'Base de clientes e segmentação (churn rate é calculado automaticamente)',
  sheets: [
    {
      sheetName: 'Base_Clientes',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'ativos', label: 'Clientes Ativos', type: 'number', required: true },
        { key: 'novos', label: 'Novos Clientes', type: 'number', required: true },
        { key: 'perdidos', label: 'Clientes Perdidos', type: 'number', required: true },
        // churnRate = perdidos / ativos * 100 (calculado)
      ],
      sampleData: [
        { month: 'Jan', ativos: 1482, novos: 45, perdidos: 8 },
        { month: 'Fev', ativos: 1519, novos: 42, perdidos: 5 },
        { month: 'Mar', ativos: 1556, novos: 39, perdidos: 7 },
        { month: 'Abr', ativos: 1588, novos: 48, perdidos: 6 },
        { month: 'Mai', ativos: 1625, novos: 43, perdidos: 4 },
        { month: 'Jun', ativos: 1542, novos: 52, perdidos: 6 },
      ]
    },
    {
      sheetName: 'Clientes_Servico',
      columns: [
        { key: 'servico', label: 'Serviço', type: 'string', required: true },
        { key: 'clientes', label: 'Clientes', type: 'number', required: true },
      ],
      sampleData: [
        { servico: 'Contabilidade', clientes: 856 },
        { servico: 'BPO Estratégico', clientes: 342 },
        { servico: 'BPO RH', clientes: 289 },
        { servico: 'ClickOn', clientes: 178 },
        { servico: 'Certificado Digital', clientes: 445 },
        { servico: 'FN EUA', clientes: 67 },
      ]
    },
    {
      sheetName: 'Regimes_Tributarios',
      columns: [
        { key: 'regime', label: 'Regime Tributário', type: 'string', required: true },
        { key: 'clientes', label: 'Clientes', type: 'number', required: true },
        { key: 'faturamentoMedio', label: 'Faturamento Médio Anual (R$)', type: 'number', required: false },
      ],
      sampleData: [
        { regime: 'Simples Nacional', clientes: 892, faturamentoMedio: 180000 },
        { regime: 'Lucro Presumido', clientes: 412, faturamentoMedio: 850000 },
        { regime: 'Lucro Real', clientes: 156, faturamentoMedio: 4500000 },
        { regime: 'MEI', clientes: 82, faturamentoMedio: 65000 },
      ]
    },
    {
      sheetName: 'Cross_Sell',
      columns: [
        { key: 'name', label: 'Qtd Serviços', type: 'string', required: true },
        { key: 'value', label: 'Clientes', type: 'number', required: true },
      ],
      sampleData: [
        { name: '1 Serviço', value: 687 },
        { name: '2 Serviços', value: 524 },
        { name: '3+ Serviços', value: 331 },
      ]
    },
    {
      sheetName: 'NPS',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'nps', label: 'NPS Score', type: 'number', required: true },
      ],
      sampleData: [
        { month: 'Jan', nps: 72 },
        { month: 'Fev', nps: 74 },
        { month: 'Mar', nps: 76 },
        { month: 'Abr', nps: 78 },
        { month: 'Mai', nps: 79 },
        { month: 'Jun', nps: 81 },
      ]
    }
  ]
};

// ============================================
// Services Page Template - SIMPLIFIED
// ============================================
export const servicesTemplate: PageTemplate = {
  pageId: 'services',
  pageName: 'Margem de Serviços',
  description: 'Receita e custo por serviço (lucro e margem são calculados automaticamente)',
  sheets: [
    {
      sheetName: 'Margem_Servicos',
      columns: [
        { key: 'servico', label: 'Serviço', type: 'string', required: true },
        { key: 'receita', label: 'Receita (R$)', type: 'number', required: true },
        { key: 'custo', label: 'Custo (R$)', type: 'number', required: true },
        { key: 'clientes', label: 'Clientes', type: 'number', required: false },
        // lucro = receita - custo (calculado)
        // margem = (receita - custo) / receita * 100 (calculado)
      ],
      sampleData: [
        { servico: 'Contabilidade Consultiva', receita: 475200, custo: 342144, clientes: 856 },
        { servico: 'BPO Estratégico', receita: 119600, custo: 77740, clientes: 342 },
        { servico: 'BPO RH', receita: 92480, custo: 62886, clientes: 289 },
        { servico: 'BPO Financeiro', receita: 78400, custo: 51184, clientes: 198 },
        { servico: 'ClickOn Treinamentos', receita: 53400, custo: 30972, clientes: 178 },
        { servico: 'Tributação e Legalização', receita: 89200, custo: 58348, clientes: 267 },
        { servico: 'Soluções de RH', receita: 67800, custo: 44070, clientes: 189 },
        { servico: 'Certificado Digital', receita: 44600, custo: 36568, clientes: 445 },
        { servico: 'FN EUA', receita: 92400, custo: 58344, clientes: 67 },
      ]
    },
    {
      sheetName: 'Evolucao_Margem',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'consultiva', label: 'Consultiva (%)', type: 'percentage', required: true },
        { key: 'bpo', label: 'BPO (%)', type: 'percentage', required: true },
        { key: 'clickon', label: 'ClickOn (%)', type: 'percentage', required: true },
        { key: 'certificado', label: 'Certificado (%)', type: 'percentage', required: true },
      ],
      sampleData: [
        { month: 'Jan', consultiva: 27.5, bpo: 33.8, clickon: 40.2, certificado: 17.5 },
        { month: 'Fev', consultiva: 27.8, bpo: 34.2, clickon: 41.0, certificado: 17.8 },
        { month: 'Mar', consultiva: 27.9, bpo: 34.5, clickon: 41.5, certificado: 17.9 },
        { month: 'Abr', consultiva: 28.0, bpo: 34.8, clickon: 41.8, certificado: 18.0 },
        { month: 'Mai', consultiva: 28.1, bpo: 35.0, clickon: 42.0, certificado: 18.0 },
        { month: 'Jun', consultiva: 28.0, bpo: 35.0, clickon: 42.0, certificado: 18.0 },
      ]
    }
  ]
};

// ============================================
// Overview Page Template - SIMPLIFIED
// ============================================
export const overviewTemplate: PageTemplate = {
  pageId: 'overview',
  pageName: 'Visão Geral',
  description: 'KPIs executivos e MRR (variações são calculadas automaticamente)',
  sheets: [
    {
      sheetName: 'MRR',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'mrr', label: 'MRR Total (R$)', type: 'number', required: true, description: 'Receita recorrente mensal' },
        { key: 'novos', label: 'Novos Clientes (R$)', type: 'number', required: false },
        { key: 'churn', label: 'Churn (R$)', type: 'number', required: false, description: 'Valor negativo de perdas' },
        { key: 'expansao', label: 'Expansão (R$)', type: 'number', required: false },
      ],
      sampleData: [
        { month: 'Jan', mrr: 850000, novos: 45000, churn: -12000, expansao: 15000 },
        { month: 'Fev', mrr: 898000, novos: 52000, churn: -9000, expansao: 18000 },
        { month: 'Mar', mrr: 945000, novos: 48000, churn: -11000, expansao: 22000 },
        { month: 'Abr', mrr: 1004000, novos: 61000, churn: -8000, expansao: 25000 },
        { month: 'Mai', mrr: 1057000, novos: 55000, churn: -10000, expansao: 28000 },
        { month: 'Jun', mrr: 1125000, novos: 67000, churn: -7500, expansao: 31000 },
      ]
    },
    {
      sheetName: 'KPIs',
      columns: [
        { key: 'indicador', label: 'Indicador', type: 'string', required: true },
        { key: 'valor', label: 'Valor Atual', type: 'string', required: true },
        { key: 'anterior', label: 'Valor Anterior', type: 'string', required: false },
        // variacao = (atual - anterior) / anterior * 100 (calculado)
      ],
      sampleData: [
        { indicador: 'MRR Atual', valor: '1125000', anterior: '1057000' },
        { indicador: 'Churn Rate', valor: '0.67', anterior: '0.95' },
        { indicador: 'LTV/CAC Ratio', valor: '4.37', anterior: '3.61' },
        { indicador: 'Receita/Colaborador', valor: '11250', anterior: '10570' },
        { indicador: 'Clientes Ativos', valor: '1542', anterior: '1488' },
        { indicador: 'Inadimplência', valor: '3.2', anterior: '2.8' },
      ]
    }
  ]
};

export const allTemplates: Record<string, PageTemplate> = {
  hr: hrTemplate,
  cashflow: cashflowTemplate,
  financial: financialTemplate,
  sales: salesTemplate,
  marketing: marketingTemplate,
  clients: clientsTemplate,
  services: servicesTemplate,
  overview: overviewTemplate,
};

// Generate and download Excel template with multiple sheets
export const downloadTemplate = (template: PageTemplate): void => {
  const wb = XLSX.utils.book_new();
  
  template.sheets.forEach(sheet => {
    // Only include non-computed columns in sample data
    const ws = XLSX.utils.json_to_sheet(sheet.sampleData);
    
    // Add column widths
    const colWidths = sheet.columns
      .filter(col => !col.computed)
      .map(col => ({ wch: Math.max(col.label.length + 2, 15) }));
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
  });
  
  XLSX.writeFile(wb, `template_${template.pageId}.xlsx`);
};

// Parse uploaded file - returns all sheets data
export const parseUploadedFile = async (file: File): Promise<Record<string, any[]>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        const result: Record<string, any[]> = {};
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          result[sheetName] = jsonData;
        });
        
        resolve(result);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo. Verifique o formato.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsBinaryString(file);
  });
};

// Smart validation with column mapping
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  mappingResults: Record<string, MappingResult>;
  needsUserReview: boolean;
}

export const validateDataSmart = (
  data: Record<string, any[]>, 
  template: PageTemplate
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const mappingResults: Record<string, MappingResult> = {};
  let needsUserReview = false;
  
  if (Object.keys(data).length === 0) {
    return { 
      valid: false, 
      errors: ['Arquivo vazio ou sem dados válidos.'],
      warnings: [],
      mappingResults: {},
      needsUserReview: false
    };
  }
  
  // Check each expected sheet
  for (const sheet of template.sheets) {
    const sheetData = getSheetData(data, sheet.sheetName);
    
    if (sheetData.length === 0) {
      // Only error if it's the first/main sheet
      if (sheet === template.sheets[0]) {
        errors.push(`Planilha principal "${sheet.sheetName}" não encontrada ou vazia.`);
      } else {
        warnings.push(`Planilha "${sheet.sheetName}" não encontrada - será usada com dados de exemplo.`);
      }
      continue;
    }
    
    // Get source columns from data
    const sourceColumns = Object.keys(sheetData[0] || {});
    
    // Generate mapping
    const mapping = generateMappings(sourceColumns, sheet.columns);
    mappingResults[sheet.sheetName] = mapping;
    
    if (mapping.needsUserReview) {
      needsUserReview = true;
    }
    
    // Check for missing required fields
    if (mapping.missingRequired.length > 0) {
      const missingLabels = mapping.missingRequired.map(key => {
        const col = sheet.columns.find(c => c.key === key);
        return col?.label || key;
      });
      warnings.push(`"${sheet.sheetName}": campos não encontrados: ${missingLabels.join(', ')}`);
    }
    
    // Check for unrecognized columns
    if (mapping.unmappedSource.length > 0) {
      warnings.push(`"${sheet.sheetName}": colunas não reconhecidas: ${mapping.unmappedSource.join(', ')}`);
    }
  }
  
  return { 
    valid: errors.length === 0, 
    errors, 
    warnings,
    mappingResults,
    needsUserReview
  };
};

// Legacy validation (for backward compatibility)
export const validateData = (
  data: Record<string, any[]>, 
  template: PageTemplate
): { valid: boolean; errors: string[] } => {
  const result = validateDataSmart(data, template);
  return { valid: result.valid, errors: result.errors };
};

// Transform data using mappings and apply computed fields
export const transformData = (
  data: Record<string, any[]>,
  template: PageTemplate,
  customMappings?: Record<string, ColumnMapping[]>
): Record<string, any[]> => {
  const result: Record<string, any[]> = {};
  
  for (const sheet of template.sheets) {
    const sheetData = getSheetData(data, sheet.sheetName);
    
    if (sheetData.length === 0) {
      result[sheet.sheetName] = sheet.sampleData;
      continue;
    }
    
    // Apply custom mappings if provided
    let transformedData = sheetData;
    if (customMappings && customMappings[sheet.sheetName]) {
      transformedData = applyMappings(sheetData, customMappings[sheet.sheetName]);
    }
    
    // Apply computed fields
    transformedData = applyComputedFields(transformedData, template.pageId);
    
    result[sheet.sheetName] = transformedData;
  }
  
  return result;
};

// Helper to get sheet data by name with fallbacks
export const getSheetData = (data: Record<string, any[]>, sheetName: string): any[] => {
  // Try exact match
  if (data[sheetName]) return data[sheetName];
  
  // Try with spaces instead of underscores
  const withSpaces = sheetName.replace(/_/g, ' ');
  if (data[withSpaces]) return data[withSpaces];
  
  // Try lowercase
  const lowerName = sheetName.toLowerCase();
  for (const key of Object.keys(data)) {
    if (key.toLowerCase() === lowerName || key.toLowerCase().replace(/_/g, ' ') === lowerName.replace(/_/g, ' ')) {
      return data[key];
    }
  }
  
  // Return first sheet as fallback for single-sheet uploads
  const keys = Object.keys(data);
  if (keys.length === 1) return data[keys[0]];
  
  return [];
};
