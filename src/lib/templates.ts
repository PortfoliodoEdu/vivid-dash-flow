// Template definitions for each dashboard page
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
  columns: TemplateColumn[];
  sampleData: any[];
}

// HR Page Template
export const hrTemplate: PageTemplate = {
  pageId: 'hr',
  pageName: 'Recursos Humanos',
  description: 'Dados de funcionários, turnover, custo RH e satisfação por departamento',
  columns: [
    { key: 'departamento', label: 'Departamento', type: 'string', required: true },
    { key: 'funcionarios', label: 'Funcionários', type: 'number', required: true },
    { key: 'custo_rh', label: 'Custo RH (R$)', type: 'number', required: true },
    { key: 'turnover', label: 'Turnover (%)', type: 'percentage', required: true },
    { key: 'satisfacao', label: 'Satisfação (NPS)', type: 'number', required: false },
    { key: 'novas_contratacoes', label: 'Novas Contratações', type: 'number', required: false },
    { key: 'demissoes', label: 'Demissões', type: 'number', required: false },
  ],
  sampleData: [
    { departamento: 'Contábil', funcionarios: 25, custo_rh: 187500, turnover: 8.5, satisfacao: 72, novas_contratacoes: 3, demissoes: 2 },
    { departamento: 'Fiscal', funcionarios: 18, custo_rh: 135000, turnover: 12.0, satisfacao: 68, novas_contratacoes: 2, demissoes: 2 },
    { departamento: 'RH', funcionarios: 8, custo_rh: 72000, turnover: 5.0, satisfacao: 85, novas_contratacoes: 1, demissoes: 0 },
    { departamento: 'TI', funcionarios: 12, custo_rh: 144000, turnover: 15.0, satisfacao: 70, novas_contratacoes: 3, demissoes: 2 },
    { departamento: 'Comercial', funcionarios: 15, custo_rh: 112500, turnover: 18.0, satisfacao: 65, novas_contratacoes: 4, demissoes: 3 },
    { departamento: 'Administrativo', funcionarios: 10, custo_rh: 65000, turnover: 6.0, satisfacao: 78, novas_contratacoes: 1, demissoes: 1 },
  ]
};

// Cashflow Page Template
export const cashflowTemplate: PageTemplate = {
  pageId: 'cashflow',
  pageName: 'Fluxo de Caixa',
  description: 'Entradas, saídas e saldo mensal do fluxo de caixa',
  columns: [
    { key: 'mes', label: 'Mês', type: 'string', required: true },
    { key: 'entradas', label: 'Entradas (R$)', type: 'number', required: true },
    { key: 'saidas', label: 'Saídas (R$)', type: 'number', required: true },
    { key: 'saldo', label: 'Saldo (R$)', type: 'number', required: false },
  ],
  sampleData: [
    { mes: 'Jan', entradas: 850000, saidas: 720000, saldo: 130000 },
    { mes: 'Fev', entradas: 920000, saidas: 780000, saldo: 140000 },
    { mes: 'Mar', entradas: 1100000, saidas: 850000, saldo: 250000 },
    { mes: 'Abr', entradas: 980000, saidas: 820000, saldo: 160000 },
    { mes: 'Mai', entradas: 1050000, saidas: 890000, saldo: 160000 },
    { mes: 'Jun', entradas: 1200000, saidas: 950000, saldo: 250000 },
  ]
};

// Financial Page Template
export const financialTemplate: PageTemplate = {
  pageId: 'financial',
  pageName: 'Financeiro (DRE)',
  description: 'Demonstrativo de Resultado do Exercício mensal',
  columns: [
    { key: 'mes', label: 'Mês', type: 'string', required: true },
    { key: 'receita_bruta', label: 'Receita Bruta (R$)', type: 'number', required: true },
    { key: 'impostos', label: 'Impostos (R$)', type: 'number', required: true },
    { key: 'receita_liquida', label: 'Receita Líquida (R$)', type: 'number', required: true },
    { key: 'custos', label: 'Custos (R$)', type: 'number', required: true },
    { key: 'despesas', label: 'Despesas (R$)', type: 'number', required: true },
    { key: 'lucro', label: 'Lucro (R$)', type: 'number', required: true },
  ],
  sampleData: [
    { mes: 'Jan', receita_bruta: 1200000, impostos: 180000, receita_liquida: 1020000, custos: 450000, despesas: 320000, lucro: 250000 },
    { mes: 'Fev', receita_bruta: 1350000, impostos: 202500, receita_liquida: 1147500, custos: 480000, despesas: 340000, lucro: 327500 },
    { mes: 'Mar', receita_bruta: 1500000, impostos: 225000, receita_liquida: 1275000, custos: 520000, despesas: 360000, lucro: 395000 },
    { mes: 'Abr', receita_bruta: 1280000, impostos: 192000, receita_liquida: 1088000, custos: 460000, despesas: 330000, lucro: 298000 },
    { mes: 'Mai', receita_bruta: 1420000, impostos: 213000, receita_liquida: 1207000, custos: 500000, despesas: 350000, lucro: 357000 },
    { mes: 'Jun', receita_bruta: 1600000, impostos: 240000, receita_liquida: 1360000, custos: 550000, despesas: 380000, lucro: 430000 },
  ]
};

// Sales Page Template
export const salesTemplate: PageTemplate = {
  pageId: 'sales',
  pageName: 'Comercial & Vendas',
  description: 'Performance de vendedores, metas e conversões',
  columns: [
    { key: 'vendedor', label: 'Vendedor', type: 'string', required: true },
    { key: 'meta', label: 'Meta (R$)', type: 'number', required: true },
    { key: 'realizado', label: 'Realizado (R$)', type: 'number', required: true },
    { key: 'contatos', label: 'Contatos', type: 'number', required: true },
    { key: 'oportunidades', label: 'Oportunidades', type: 'number', required: true },
    { key: 'vendas_fechadas', label: 'Vendas Fechadas', type: 'number', required: true },
    { key: 'conversao', label: 'Conversão (%)', type: 'percentage', required: false },
  ],
  sampleData: [
    { vendedor: 'Carlos Silva', meta: 150000, realizado: 165000, contatos: 180, oportunidades: 45, vendas_fechadas: 12, conversao: 26.7 },
    { vendedor: 'Ana Santos', meta: 120000, realizado: 98000, contatos: 150, oportunidades: 38, vendas_fechadas: 8, conversao: 21.1 },
    { vendedor: 'Pedro Costa', meta: 130000, realizado: 142000, contatos: 200, oportunidades: 52, vendas_fechadas: 15, conversao: 28.8 },
    { vendedor: 'Maria Oliveira', meta: 140000, realizado: 155000, contatos: 170, oportunidades: 48, vendas_fechadas: 14, conversao: 29.2 },
    { vendedor: 'João Ferreira', meta: 100000, realizado: 87000, contatos: 120, oportunidades: 30, vendas_fechadas: 7, conversao: 23.3 },
  ]
};

// Marketing Page Template
export const marketingTemplate: PageTemplate = {
  pageId: 'marketing',
  pageName: 'Marketing',
  description: 'Investimento, leads e ROI por canal de marketing',
  columns: [
    { key: 'canal', label: 'Canal', type: 'string', required: true },
    { key: 'investimento', label: 'Investimento (R$)', type: 'number', required: true },
    { key: 'leads', label: 'Leads', type: 'number', required: true },
    { key: 'conversao', label: 'Conversão (%)', type: 'percentage', required: true },
    { key: 'roi', label: 'ROI (%)', type: 'percentage', required: true },
  ],
  sampleData: [
    { canal: 'Google Ads', investimento: 45000, leads: 320, conversao: 3.2, roi: 245 },
    { canal: 'Facebook Ads', investimento: 28000, leads: 180, conversao: 2.8, roi: 180 },
    { canal: 'LinkedIn', investimento: 35000, leads: 95, conversao: 5.5, roi: 320 },
    { canal: 'Email Marketing', investimento: 8000, leads: 450, conversao: 4.2, roi: 520 },
    { canal: 'Indicações', investimento: 5000, leads: 85, conversao: 12.0, roi: 850 },
    { canal: 'Eventos', investimento: 25000, leads: 120, conversao: 8.5, roi: 280 },
  ]
};

// Clients Page Template
export const clientsTemplate: PageTemplate = {
  pageId: 'clients',
  pageName: 'Clientes & Retenção',
  description: 'Base de clientes, churn e NPS mensal',
  columns: [
    { key: 'mes', label: 'Mês', type: 'string', required: true },
    { key: 'clientes_ativos', label: 'Clientes Ativos', type: 'number', required: true },
    { key: 'novos_clientes', label: 'Novos Clientes', type: 'number', required: true },
    { key: 'clientes_perdidos', label: 'Clientes Perdidos', type: 'number', required: true },
    { key: 'reativados', label: 'Reativados', type: 'number', required: false },
    { key: 'nps', label: 'NPS', type: 'number', required: false },
    { key: 'ticket_medio', label: 'Ticket Médio (R$)', type: 'number', required: false },
  ],
  sampleData: [
    { mes: 'Jan', clientes_ativos: 1420, novos_clientes: 45, clientes_perdidos: 12, reativados: 5, nps: 72, ticket_medio: 2800 },
    { mes: 'Fev', clientes_ativos: 1458, novos_clientes: 52, clientes_perdidos: 14, reativados: 8, nps: 74, ticket_medio: 2850 },
    { mes: 'Mar', clientes_ativos: 1502, novos_clientes: 58, clientes_perdidos: 14, reativados: 6, nps: 71, ticket_medio: 2920 },
    { mes: 'Abr', clientes_ativos: 1538, novos_clientes: 48, clientes_perdidos: 12, reativados: 4, nps: 75, ticket_medio: 2880 },
    { mes: 'Mai', clientes_ativos: 1575, novos_clientes: 55, clientes_perdidos: 18, reativados: 7, nps: 73, ticket_medio: 2950 },
    { mes: 'Jun', clientes_ativos: 1612, novos_clientes: 62, clientes_perdidos: 25, reativados: 10, nps: 76, ticket_medio: 3020 },
  ]
};

// Services Page Template
export const servicesTemplate: PageTemplate = {
  pageId: 'services',
  pageName: 'Margem de Serviços',
  description: 'Receita, custo e margem por linha de serviço',
  columns: [
    { key: 'servico', label: 'Serviço', type: 'string', required: true },
    { key: 'receita', label: 'Receita (R$)', type: 'number', required: true },
    { key: 'custo', label: 'Custo (R$)', type: 'number', required: true },
    { key: 'margem', label: 'Margem (%)', type: 'percentage', required: false },
    { key: 'clientes', label: 'Clientes', type: 'number', required: false },
  ],
  sampleData: [
    { servico: 'Contabilidade', receita: 520000, custo: 260000, margem: 50, clientes: 450 },
    { servico: 'BPO Financeiro', receita: 380000, custo: 171000, margem: 55, clientes: 180 },
    { servico: 'Departamento Pessoal', receita: 290000, custo: 145000, margem: 50, clientes: 320 },
    { servico: 'Fiscal', receita: 420000, custo: 189000, margem: 55, clientes: 380 },
    { servico: 'Certificação Digital', receita: 85000, custo: 25500, margem: 70, clientes: 520 },
    { servico: 'Consultoria', receita: 180000, custo: 72000, margem: 60, clientes: 45 },
    { servico: 'Treinamentos', receita: 95000, custo: 38000, margem: 60, clientes: 120 },
    { servico: 'FN EUA', receita: 150000, custo: 60000, margem: 60, clientes: 35 },
  ]
};

// Overview Page Template (KPIs gerais)
export const overviewTemplate: PageTemplate = {
  pageId: 'overview',
  pageName: 'Visão Geral',
  description: 'KPIs principais consolidados por mês',
  columns: [
    { key: 'mes', label: 'Mês', type: 'string', required: true },
    { key: 'receita_total', label: 'Receita Total (R$)', type: 'number', required: true },
    { key: 'lucro_liquido', label: 'Lucro Líquido (R$)', type: 'number', required: true },
    { key: 'clientes_ativos', label: 'Clientes Ativos', type: 'number', required: true },
    { key: 'ticket_medio', label: 'Ticket Médio (R$)', type: 'number', required: true },
    { key: 'churn', label: 'Churn (%)', type: 'percentage', required: false },
    { key: 'nps', label: 'NPS', type: 'number', required: false },
  ],
  sampleData: [
    { mes: 'Jan', receita_total: 1200000, lucro_liquido: 250000, clientes_ativos: 1420, ticket_medio: 2800, churn: 0.8, nps: 72 },
    { mes: 'Fev', receita_total: 1350000, lucro_liquido: 327500, clientes_ativos: 1458, ticket_medio: 2850, churn: 0.9, nps: 74 },
    { mes: 'Mar', receita_total: 1500000, lucro_liquido: 395000, clientes_ativos: 1502, ticket_medio: 2920, churn: 0.9, nps: 71 },
    { mes: 'Abr', receita_total: 1280000, lucro_liquido: 298000, clientes_ativos: 1538, ticket_medio: 2880, churn: 0.8, nps: 75 },
    { mes: 'Mai', receita_total: 1420000, lucro_liquido: 357000, clientes_ativos: 1575, ticket_medio: 2950, churn: 1.1, nps: 73 },
    { mes: 'Jun', receita_total: 1600000, lucro_liquido: 430000, clientes_ativos: 1612, ticket_medio: 3020, churn: 1.5, nps: 76 },
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

// Generate and download Excel template
export const downloadTemplate = (template: PageTemplate): void => {
  const ws = XLSX.utils.json_to_sheet(template.sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, template.pageName);
  
  // Add column widths
  const colWidths = template.columns.map(col => ({ wch: Math.max(col.label.length, 15) }));
  ws['!cols'] = colWidths;
  
  XLSX.writeFile(wb, `template_${template.pageId}.xlsx`);
};

// Parse uploaded file
export const parseUploadedFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo. Verifique o formato.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsBinaryString(file);
  });
};

// Validate data against template
export const validateData = (data: any[], template: PageTemplate): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const requiredColumns = template.columns.filter(c => c.required).map(c => c.key);
  
  if (data.length === 0) {
    return { valid: false, errors: ['Arquivo vazio ou sem dados válidos.'] };
  }
  
  const firstRow = data[0];
  const dataKeys = Object.keys(firstRow).map(k => k.toLowerCase().replace(/\s+/g, '_'));
  
  requiredColumns.forEach(col => {
    const colVariations = [col, col.replace(/_/g, ' '), template.columns.find(c => c.key === col)?.label.toLowerCase()];
    const found = colVariations.some(v => dataKeys.includes(v?.toLowerCase() || ''));
    if (!found) {
      const colLabel = template.columns.find(c => c.key === col)?.label;
      errors.push(`Coluna obrigatória não encontrada: ${colLabel}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
};
