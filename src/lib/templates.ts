// Complete template definitions for each dashboard page
import * as XLSX from 'xlsx';

export interface TemplateColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'percentage';
  required: boolean;
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
// HR Page Template - COMPLETE
// ============================================
export const hrTemplate: PageTemplate = {
  pageId: 'hr',
  pageName: 'Recursos Humanos',
  description: 'Dados completos de RH: colaboradores por departamento, produtividade, turnover mensal e vagas',
  sheets: [
    {
      sheetName: 'Departamentos',
      columns: [
        { key: 'departamento', label: 'Departamento', type: 'string', required: true },
        { key: 'colaboradores', label: 'Colaboradores', type: 'number', required: true },
        { key: 'custo', label: 'Custo RH (R$)', type: 'number', required: true },
        { key: 'turnover', label: 'Turnover (%)', type: 'percentage', required: true },
        { key: 'nps', label: 'NPS Interno', type: 'number', required: true },
        { key: 'absenteismo', label: 'Absenteísmo (%)', type: 'percentage', required: true },
      ],
      sampleData: [
        { departamento: 'Operacional', colaboradores: 45, custo: 225000, turnover: 2.2, nps: 68, absenteismo: 1.5 },
        { departamento: 'Comercial', colaboradores: 12, custo: 96000, turnover: 3.5, nps: 72, absenteismo: 0.8 },
        { departamento: 'Administrativo', colaboradores: 18, custo: 108000, turnover: 1.8, nps: 75, absenteismo: 1.2 },
        { departamento: 'Marketing', colaboradores: 8, custo: 56000, turnover: 1.5, nps: 78, absenteismo: 0.5 },
        { departamento: 'TI', colaboradores: 7, custo: 63000, turnover: 2.0, nps: 80, absenteismo: 0.3 },
        { departamento: 'RH', colaboradores: 5, custo: 35000, turnover: 1.0, nps: 82, absenteismo: 0.4 },
        { departamento: 'Financeiro', colaboradores: 5, custo: 42000, turnover: 0.8, nps: 76, absenteismo: 0.6 },
      ]
    },
    {
      sheetName: 'Produtividade',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'receitaColab', label: 'Receita/Colaborador (R$)', type: 'number', required: true },
        { key: 'custoColab', label: 'Custo RH/Colaborador (R$)', type: 'number', required: true },
      ],
      sampleData: [
        { month: 'Jan', receitaColab: 8500, custoColab: 6250 },
        { month: 'Fev', receitaColab: 8980, custoColab: 6250 },
        { month: 'Mar', receitaColab: 9450, custoColab: 6250 },
        { month: 'Abr', receitaColab: 10040, custoColab: 6250 },
        { month: 'Mai', receitaColab: 10570, custoColab: 6250 },
        { month: 'Jun', receitaColab: 11250, custoColab: 6250 },
      ]
    },
    {
      sheetName: 'Turnover_Mensal',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'admissoes', label: 'Admissões', type: 'number', required: true },
        { key: 'desligamentos', label: 'Desligamentos', type: 'number', required: true },
        { key: 'turnover', label: 'Turnover (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { month: 'Jan', admissoes: 3, desligamentos: 2, turnover: 2.0 },
        { month: 'Fev', admissoes: 2, desligamentos: 1, turnover: 1.0 },
        { month: 'Mar', admissoes: 4, desligamentos: 3, turnover: 3.0 },
        { month: 'Abr', admissoes: 5, desligamentos: 2, turnover: 2.0 },
        { month: 'Mai', admissoes: 3, desligamentos: 1, turnover: 1.0 },
        { month: 'Jun', admissoes: 2, desligamentos: 2, turnover: 2.0 },
      ]
    },
    {
      sheetName: 'Vagas',
      columns: [
        { key: 'status', label: 'Status', type: 'string', required: true },
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
// Cashflow Page Template - COMPLETE
// ============================================
export const cashflowTemplate: PageTemplate = {
  pageId: 'cashflow',
  pageName: 'Fluxo de Caixa',
  description: 'Fluxo de caixa mensal, categorias de despesas e projeções',
  sheets: [
    {
      sheetName: 'Fluxo_Mensal',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'entradas', label: 'Entradas (R$)', type: 'number', required: true },
        { key: 'saidas', label: 'Saídas (R$)', type: 'number', required: true },
        { key: 'saldo', label: 'Saldo (R$)', type: 'number', required: false },
      ],
      sampleData: [
        { month: 'Jan', entradas: 450000, saidas: 382353, saldo: 67647 },
        { month: 'Fev', entradas: 520000, saidas: 430056, saldo: 89944 },
        { month: 'Mar', entradas: 480000, saidas: 413784, saldo: 66216 },
        { month: 'Abr', entradas: 610000, saidas: 504470, saldo: 105530 },
        { month: 'Mai', entradas: 550000, saidas: 469986, saldo: 80014 },
        { month: 'Jun', entradas: 670000, saidas: 554090, saldo: 115910 },
      ]
    },
    {
      sheetName: 'Categorias_Despesas',
      columns: [
        { key: 'categoria', label: 'Categoria', type: 'string', required: true },
        { key: 'valor', label: 'Valor (R$)', type: 'number', required: true },
        { key: 'percentual', label: 'Percentual (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { categoria: 'Pessoal', valor: 195000, percentual: 35.2 },
        { categoria: 'Marketing', valor: 131000, percentual: 23.6 },
        { categoria: 'Operacional', valor: 88500, percentual: 16.0 },
        { categoria: 'Impostos', valor: 90450, percentual: 16.3 },
        { categoria: 'Diversos', valor: 49140, percentual: 8.9 },
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
// Financial Page Template - COMPLETE
// ============================================
export const financialTemplate: PageTemplate = {
  pageId: 'financial',
  pageName: 'Financeiro (DRE)',
  description: 'DRE completo e indicadores financeiros',
  sheets: [
    {
      sheetName: 'DRE',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'receitaBruta', label: 'Receita Bruta (R$)', type: 'number', required: true },
        { key: 'impostos', label: 'Impostos (R$)', type: 'number', required: true },
        { key: 'receitaLiquida', label: 'Receita Líquida (R$)', type: 'number', required: true },
        { key: 'custos', label: 'Custos (R$)', type: 'number', required: true },
        { key: 'despesas', label: 'Despesas (R$)', type: 'number', required: true },
        { key: 'lucro', label: 'Lucro (R$)', type: 'number', required: true },
      ],
      sampleData: [
        { month: 'Jan', receitaBruta: 450000, impostos: 60750, receitaLiquida: 389250, custos: 247425, despesas: 74178, lucro: 67647 },
        { month: 'Fev', receitaBruta: 520000, impostos: 70200, receitaLiquida: 449800, custos: 269892, despesas: 89964, lucro: 89944 },
        { month: 'Mar', receitaBruta: 480000, impostos: 64800, receitaLiquida: 415200, custos: 274032, despesas: 74952, lucro: 66216 },
        { month: 'Abr', receitaBruta: 610000, impostos: 82350, receitaLiquida: 527650, custos: 316590, despesas: 105530, lucro: 105530 },
        { month: 'Mai', receitaBruta: 550000, impostos: 74250, receitaLiquida: 475750, custos: 309988, despesas: 85748, lucro: 80014 },
        { month: 'Jun', receitaBruta: 670000, impostos: 90450, receitaLiquida: 579550, custos: 347730, despesas: 115910, lucro: 115910 },
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
// Sales Page Template - COMPLETE
// ============================================
export const salesTemplate: PageTemplate = {
  pageId: 'sales',
  pageName: 'Comercial & Vendas',
  description: 'Performance de vendedores, pipeline, vendas por serviço/produto e metas mensais',
  sheets: [
    {
      sheetName: 'Vendedores',
      columns: [
        { key: 'vendedor', label: 'Vendedor', type: 'string', required: true },
        { key: 'oportunidadesConvertidas', label: 'Oport. Convertidas', type: 'number', required: true },
        { key: 'metaVendas', label: 'Meta (Qtd)', type: 'number', required: true },
        { key: 'conversao', label: 'Conversão (%)', type: 'percentage', required: true },
        { key: 'ticket', label: 'Ticket Médio (R$)', type: 'number', required: true },
        { key: 'comissao', label: 'Comissão (R$)', type: 'number', required: false },
        { key: 'ligacoes', label: 'Ligações', type: 'number', required: true },
        { key: 'whatsapp', label: 'WhatsApp', type: 'number', required: true },
        { key: 'contatosNecessarios', label: 'Contatos/Venda', type: 'number', required: false },
        { key: 'pipeline', label: 'Pipeline (Qtd)', type: 'number', required: false },
      ],
      sampleData: [
        { vendedor: 'Carlos Silva', oportunidadesConvertidas: 28, metaVendas: 25, conversao: 18.5, ticket: 3200, comissao: 22400, ligacoes: 145, whatsapp: 89, contatosNecessarios: 8.3, pipeline: 42 },
        { vendedor: 'Ana Santos', oportunidadesConvertidas: 32, metaVendas: 30, conversao: 21.2, ticket: 3800, comissao: 30400, ligacoes: 134, whatsapp: 112, contatosNecessarios: 7.7, pipeline: 38 },
        { vendedor: 'Pedro Costa', oportunidadesConvertidas: 24, metaVendas: 25, conversao: 16.8, ticket: 2900, comissao: 17400, ligacoes: 167, whatsapp: 78, contatosNecessarios: 10.2, pipeline: 51 },
        { vendedor: 'Mariana Lima', oportunidadesConvertidas: 35, metaVendas: 30, conversao: 23.4, ticket: 4100, comissao: 35875, ligacoes: 112, whatsapp: 98, contatosNecessarios: 6.0, pipeline: 35 },
        { vendedor: 'João Oliveira', oportunidadesConvertidas: 29, metaVendas: 25, conversao: 19.3, ticket: 3400, comissao: 24650, ligacoes: 156, whatsapp: 67, contatosNecessarios: 7.7, pipeline: 45 },
      ]
    },
    {
      sheetName: 'Pipeline',
      columns: [
        { key: 'estagio', label: 'Estágio', type: 'string', required: true },
        { key: 'quantidade', label: 'Quantidade', type: 'number', required: true },
        { key: 'valor', label: 'Valor (R$)', type: 'number', required: true },
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
        { key: 'valor', label: 'Valor (R$)', type: 'number', required: true },
        { key: 'margem', label: 'Margem (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { servico: 'Contabilidade', vendas: 45, valor: 162000, margem: 28 },
        { servico: 'BPO Estratégico', vendas: 32, valor: 128000, margem: 35 },
        { servico: 'BPO RH', vendas: 28, valor: 84000, margem: 32 },
        { servico: 'ClickOn', vendas: 18, valor: 54000, margem: 42 },
        { servico: 'Certificado Digital', vendas: 56, valor: 44800, margem: 18 },
      ]
    },
    {
      sheetName: 'Vendas_Produto',
      columns: [
        { key: 'produto', label: 'Produto', type: 'string', required: true },
        { key: 'vendas', label: 'Vendas (Qtd)', type: 'number', required: true },
        { key: 'valor', label: 'Valor (R$)', type: 'number', required: true },
      ],
      sampleData: [
        { produto: 'Contab. Simples Nacional', vendas: 28, valor: 56000 },
        { produto: 'Contab. Lucro Presumido', vendas: 12, valor: 72000 },
        { produto: 'Contab. Lucro Real', vendas: 5, valor: 34000 },
        { produto: 'BPO Financeiro Completo', vendas: 18, valor: 86400 },
        { produto: 'Folha de Pagamento', vendas: 22, valor: 52800 },
        { produto: 'ClickOn Pro', vendas: 14, valor: 42000 },
        { produto: 'e-CNPJ A3', vendas: 34, valor: 27200 },
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
// Marketing Page Template - COMPLETE
// ============================================
export const marketingTemplate: PageTemplate = {
  pageId: 'marketing',
  pageName: 'Marketing',
  description: 'Performance por canal, ROI mensal e funil de conversão',
  sheets: [
    {
      sheetName: 'Canais',
      columns: [
        { key: 'canal', label: 'Canal', type: 'string', required: true },
        { key: 'investimento', label: 'Investimento (R$)', type: 'number', required: true },
        { key: 'leads', label: 'Leads', type: 'number', required: true },
        { key: 'conversao', label: 'Conversão (%)', type: 'percentage', required: true },
        { key: 'roi', label: 'ROI (%)', type: 'percentage', required: true },
      ],
      sampleData: [
        { canal: 'Google Ads', investimento: 45000, leads: 1250, conversao: 12.5, roi: 280 },
        { canal: 'Facebook Ads', investimento: 32000, leads: 980, conversao: 9.8, roi: 195 },
        { canal: 'Instagram Ads', investimento: 28000, leads: 850, conversao: 11.2, roi: 220 },
        { canal: 'LinkedIn Ads', investimento: 18000, leads: 420, conversao: 15.8, roi: 310 },
        { canal: 'Orgânico (SEO)', investimento: 8000, leads: 620, conversao: 18.5, roi: 580 },
      ]
    },
    {
      sheetName: 'ROI_Mensal',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'investimento', label: 'Investimento (R$)', type: 'number', required: true },
        { key: 'receita', label: 'Receita Gerada (R$)', type: 'number', required: true },
        { key: 'roi', label: 'ROI (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { month: 'Jan', investimento: 95000, receita: 245000, roi: 158 },
        { month: 'Fev', investimento: 102000, receita: 278000, roi: 172 },
        { month: 'Mar', investimento: 98000, receita: 256000, roi: 161 },
        { month: 'Abr', investimento: 115000, receita: 321000, roi: 179 },
        { month: 'Mai', investimento: 108000, receita: 298000, roi: 176 },
        { month: 'Jun', investimento: 131000, receita: 368000, roi: 181 },
      ]
    },
    {
      sheetName: 'Funil',
      columns: [
        { key: 'etapa', label: 'Etapa', type: 'string', required: true },
        { key: 'valor', label: 'Quantidade', type: 'number', required: true },
        { key: 'taxa', label: 'Taxa Conversão (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { etapa: 'Visitantes', valor: 15420, taxa: 100 },
        { etapa: 'Leads', valor: 4120, taxa: 26.7 },
        { etapa: 'MQLs', valor: 1856, taxa: 45.0 },
        { etapa: 'SQLs', valor: 834, taxa: 44.9 },
        { etapa: 'Clientes', valor: 125, taxa: 15.0 },
      ]
    }
  ]
};

// ============================================
// Clients Page Template - COMPLETE
// ============================================
export const clientsTemplate: PageTemplate = {
  pageId: 'clients',
  pageName: 'Clientes & Retenção',
  description: 'Base de clientes mensal, serviços, regimes tributários, cross-sell e NPS',
  sheets: [
    {
      sheetName: 'Base_Clientes',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'ativos', label: 'Clientes Ativos', type: 'number', required: true },
        { key: 'novos', label: 'Novos Clientes', type: 'number', required: true },
        { key: 'perdidos', label: 'Clientes Perdidos', type: 'number', required: true },
        { key: 'reativados', label: 'Reativados', type: 'number', required: false },
      ],
      sampleData: [
        { month: 'Jan', ativos: 1482, novos: 45, perdidos: 8, reativados: 3 },
        { month: 'Fev', ativos: 1519, novos: 42, perdidos: 5, reativados: 4 },
        { month: 'Mar', ativos: 1556, novos: 39, perdidos: 7, reativados: 2 },
        { month: 'Abr', ativos: 1588, novos: 48, perdidos: 6, reativados: 5 },
        { month: 'Mai', ativos: 1625, novos: 43, perdidos: 4, reativados: 3 },
        { month: 'Jun', ativos: 1542, novos: 52, perdidos: 6, reativados: 7 },
      ]
    },
    {
      sheetName: 'Clientes_Servico',
      columns: [
        { key: 'servico', label: 'Serviço', type: 'string', required: true },
        { key: 'clientes', label: 'Clientes', type: 'number', required: true },
        { key: 'percentual', label: 'Percentual (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { servico: 'Contabilidade', clientes: 856, percentual: 55.5 },
        { servico: 'BPO Estratégico', clientes: 342, percentual: 22.2 },
        { servico: 'BPO RH', clientes: 289, percentual: 18.7 },
        { servico: 'ClickOn', clientes: 178, percentual: 11.5 },
        { servico: 'Certificado Digital', clientes: 445, percentual: 28.9 },
        { servico: 'FN EUA', clientes: 67, percentual: 4.3 },
      ]
    },
    {
      sheetName: 'Produtos_Servico',
      columns: [
        { key: 'servico', label: 'Serviço', type: 'string', required: true },
        { key: 'produto', label: 'Produto', type: 'string', required: true },
        { key: 'clientes', label: 'Clientes', type: 'number', required: true },
      ],
      sampleData: [
        { servico: 'Contabilidade', produto: 'Contabilidade Simples Nacional', clientes: 412 },
        { servico: 'Contabilidade', produto: 'Contabilidade Lucro Presumido', clientes: 298 },
        { servico: 'Contabilidade', produto: 'Contabilidade Lucro Real', clientes: 146 },
        { servico: 'BPO Estratégico', produto: 'BPO Financeiro Completo', clientes: 156 },
        { servico: 'BPO Estratégico', produto: 'BPO Controladoria', clientes: 98 },
        { servico: 'BPO Estratégico', produto: 'BPO Fiscal', clientes: 88 },
        { servico: 'BPO RH', produto: 'Folha de Pagamento', clientes: 189 },
        { servico: 'BPO RH', produto: 'Gestão de Benefícios', clientes: 67 },
        { servico: 'BPO RH', produto: 'Recrutamento', clientes: 33 },
        { servico: 'ClickOn', produto: 'ClickOn Basic', clientes: 89 },
        { servico: 'ClickOn', produto: 'ClickOn Pro', clientes: 56 },
        { servico: 'ClickOn', produto: 'ClickOn Enterprise', clientes: 33 },
        { servico: 'Certificado Digital', produto: 'e-CPF A1', clientes: 156 },
        { servico: 'Certificado Digital', produto: 'e-CPF A3', clientes: 123 },
        { servico: 'Certificado Digital', produto: 'e-CNPJ A1', clientes: 98 },
        { servico: 'Certificado Digital', produto: 'e-CNPJ A3', clientes: 68 },
        { servico: 'FN EUA', produto: 'LLC Formation', clientes: 34 },
        { servico: 'FN EUA', produto: 'Bookkeeping USA', clientes: 23 },
        { servico: 'FN EUA', produto: 'Tax Filing', clientes: 10 },
      ]
    },
    {
      sheetName: 'Regimes_Tributarios',
      columns: [
        { key: 'regime', label: 'Regime Tributário', type: 'string', required: true },
        { key: 'clientes', label: 'Clientes', type: 'number', required: true },
        { key: 'faturamentoMedio', label: 'Faturamento Médio Anual (R$)', type: 'number', required: true },
        { key: 'percentual', label: 'Percentual (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { regime: 'Simples Nacional', clientes: 892, faturamentoMedio: 180000, percentual: 57.8 },
        { regime: 'Lucro Presumido', clientes: 412, faturamentoMedio: 850000, percentual: 26.7 },
        { regime: 'Lucro Real', clientes: 156, faturamentoMedio: 4500000, percentual: 10.1 },
        { regime: 'MEI', clientes: 82, faturamentoMedio: 65000, percentual: 5.3 },
      ]
    },
    {
      sheetName: 'Cross_Sell',
      columns: [
        { key: 'name', label: 'Qtd Serviços', type: 'string', required: true },
        { key: 'value', label: 'Clientes', type: 'number', required: true },
        { key: 'percentual', label: 'Percentual (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { name: '1 Serviço', value: 687, percentual: 44.5 },
        { name: '2 Serviços', value: 524, percentual: 34.0 },
        { name: '3+ Serviços', value: 331, percentual: 21.5 },
      ]
    },
    {
      sheetName: 'NPS',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'nps', label: 'NPS Score', type: 'number', required: true },
        { key: 'promotores', label: 'Promotores (%)', type: 'percentage', required: false },
        { key: 'detratores', label: 'Detratores (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { month: 'Jan', nps: 72, promotores: 65, detratores: 8 },
        { month: 'Fev', nps: 74, promotores: 68, detratores: 7 },
        { month: 'Mar', nps: 76, promotores: 70, detratores: 6 },
        { month: 'Abr', nps: 78, promotores: 72, detratores: 6 },
        { month: 'Mai', nps: 79, promotores: 73, detratores: 5 },
        { month: 'Jun', nps: 81, promotores: 75, detratores: 5 },
      ]
    }
  ]
};

// ============================================
// Services Page Template - COMPLETE
// ============================================
export const servicesTemplate: PageTemplate = {
  pageId: 'services',
  pageName: 'Margem de Serviços',
  description: 'Margem por linha de serviço e evolução mensal',
  sheets: [
    {
      sheetName: 'Margem_Servicos',
      columns: [
        { key: 'servico', label: 'Serviço', type: 'string', required: true },
        { key: 'receita', label: 'Receita (R$)', type: 'number', required: true },
        { key: 'custo', label: 'Custo (R$)', type: 'number', required: true },
        { key: 'lucro', label: 'Lucro (R$)', type: 'number', required: false },
        { key: 'margem', label: 'Margem (%)', type: 'percentage', required: false },
        { key: 'clientes', label: 'Clientes', type: 'number', required: true },
      ],
      sampleData: [
        { servico: 'Contabilidade Consultiva', receita: 475200, custo: 342144, lucro: 133056, margem: 28.0, clientes: 856 },
        { servico: 'BPO Estratégico', receita: 119600, custo: 77740, lucro: 41860, margem: 35.0, clientes: 342 },
        { servico: 'BPO RH', receita: 92480, custo: 62886, lucro: 29594, margem: 32.0, clientes: 289 },
        { servico: 'BPO Financeiro', receita: 78400, custo: 51184, lucro: 27216, margem: 34.7, clientes: 198 },
        { servico: 'ClickOn Treinamentos', receita: 53400, custo: 30972, lucro: 22428, margem: 42.0, clientes: 178 },
        { servico: 'Tributação e Legalização', receita: 89200, custo: 58348, lucro: 30852, margem: 34.6, clientes: 267 },
        { servico: 'Soluções de RH', receita: 67800, custo: 44070, lucro: 23730, margem: 35.0, clientes: 189 },
        { servico: 'Certificado Digital', receita: 44600, custo: 36568, lucro: 8032, margem: 18.0, clientes: 445 },
        { servico: 'FN EUA', receita: 92400, custo: 58344, lucro: 34056, margem: 36.9, clientes: 67 },
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
// Overview Page Template - COMPLETE
// ============================================
export const overviewTemplate: PageTemplate = {
  pageId: 'overview',
  pageName: 'Visão Geral',
  description: 'KPIs executivos: MRR, composição de crescimento e produtividade',
  sheets: [
    {
      sheetName: 'MRR',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'mrr', label: 'MRR Total (R$)', type: 'number', required: true },
        { key: 'novos', label: 'Novos Clientes (R$)', type: 'number', required: true },
        { key: 'churn', label: 'Churn (R$)', type: 'number', required: true },
        { key: 'expansao', label: 'Expansão (R$)', type: 'number', required: true },
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
      sheetName: 'Produtividade',
      columns: [
        { key: 'month', label: 'Mês', type: 'string', required: true },
        { key: 'receita', label: 'Receita/Colaborador (R$)', type: 'number', required: true },
      ],
      sampleData: [
        { month: 'Jan', receita: 8500 },
        { month: 'Fev', receita: 8980 },
        { month: 'Mar', receita: 9450 },
        { month: 'Abr', receita: 10040 },
        { month: 'Mai', receita: 10570 },
        { month: 'Jun', receita: 11250 },
      ]
    },
    {
      sheetName: 'KPIs',
      columns: [
        { key: 'indicador', label: 'Indicador', type: 'string', required: true },
        { key: 'valor', label: 'Valor Atual', type: 'string', required: true },
        { key: 'anterior', label: 'Valor Anterior', type: 'string', required: false },
        { key: 'variacao', label: 'Variação (%)', type: 'percentage', required: false },
      ],
      sampleData: [
        { indicador: 'MRR Atual', valor: '1125000', anterior: '1057000', variacao: 6.4 },
        { indicador: 'Churn Rate', valor: '0.67', anterior: '0.95', variacao: -29.5 },
        { indicador: 'LTV/CAC Ratio', valor: '4.37', anterior: '3.61', variacao: 21.1 },
        { indicador: 'Receita/Colaborador', valor: '11250', anterior: '10570', variacao: 6.4 },
        { indicador: 'Clientes Ativos', valor: '1542', anterior: '1488', variacao: 3.6 },
        { indicador: 'Inadimplência', valor: '3.2', anterior: '2.8', variacao: 14.3 },
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
    const ws = XLSX.utils.json_to_sheet(sheet.sampleData);
    
    // Add column widths
    const colWidths = sheet.columns.map(col => ({ wch: Math.max(col.label.length + 2, 15) }));
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

// Validate data against template
export const validateData = (data: Record<string, any[]>, template: PageTemplate): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (Object.keys(data).length === 0) {
    return { valid: false, errors: ['Arquivo vazio ou sem dados válidos.'] };
  }
  
  // Check if at least the first sheet has data
  const firstSheetName = template.sheets[0].sheetName;
  const possibleNames = [firstSheetName, firstSheetName.replace(/_/g, ' '), Object.keys(data)[0]];
  
  let foundFirstSheet = false;
  for (const name of possibleNames) {
    if (data[name] && data[name].length > 0) {
      foundFirstSheet = true;
      break;
    }
  }
  
  if (!foundFirstSheet) {
    errors.push(`Planilha principal "${firstSheetName}" não encontrada ou vazia.`);
  }
  
  return { valid: errors.length === 0, errors };
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
