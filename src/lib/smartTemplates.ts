import * as XLSX from 'xlsx';

// ==========================================
// FILOSOFIA: DADOS BRUTOS, NÃO CALCULADOS
// O usuário insere FATOS, o sistema calcula
// ==========================================

export interface SmartTemplate {
  id: string;
  name: string;
  description: string;
  sheets: SmartSheet[];
}

export interface SmartSheet {
  name: string;
  description: string;
  columns: SmartColumn[];
  examples: Record<string, any>[];
}

export interface SmartColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  description: string;
  options?: string[]; // Para tipo 'select'
}

// Templates simplificados - apenas dados brutos
export const smartTemplates: Record<string, SmartTemplate> = {
  overview: {
    id: 'overview',
    name: 'Visão Geral',
    description: 'Histórico mensal consolidado da empresa',
    sheets: [
      {
        name: 'Historico_Mensal',
        description: 'Dados mensais consolidados',
        columns: [
          { key: 'mes_ano', label: 'Mês/Ano', type: 'date', required: true, description: 'Ex: 2024-01' },
          { key: 'receita_total', label: 'Receita Total (R$)', type: 'number', required: true, description: 'Faturamento bruto do mês' },
          { key: 'custos_totais', label: 'Custos Totais (R$)', type: 'number', required: true, description: 'Soma de todas as despesas' },
          { key: 'numero_clientes', label: 'Nº Clientes Ativos', type: 'number', required: false, description: 'Total de clientes no mês' },
          { key: 'numero_funcionarios', label: 'Nº Funcionários', type: 'number', required: false, description: 'Headcount do mês' },
        ],
        examples: [
          { mes_ano: '2024-01', receita_total: 150000, custos_totais: 80000, numero_clientes: 45, numero_funcionarios: 12 },
          { mes_ano: '2024-02', receita_total: 165000, custos_totais: 82000, numero_clientes: 48, numero_funcionarios: 13 },
        ]
      }
    ]
  },

  hr: {
    id: 'hr',
    name: 'Recursos Humanos',
    description: 'Dados de colaboradores e departamentos',
    sheets: [
      {
        name: 'Colaboradores',
        description: 'Lista de funcionários ativos',
        columns: [
          { key: 'nome', label: 'Nome', type: 'text', required: true, description: 'Nome completo' },
          { key: 'departamento', label: 'Departamento', type: 'text', required: true, description: 'Ex: Contabilidade, RH' },
          { key: 'cargo', label: 'Cargo', type: 'text', required: true, description: 'Função atual' },
          { key: 'data_admissao', label: 'Data Admissão', type: 'date', required: true, description: 'Formato: YYYY-MM-DD' },
          { key: 'salario', label: 'Salário (R$)', type: 'number', required: true, description: 'Salário bruto mensal' },
        ],
        examples: [
          { nome: 'João Silva', departamento: 'Contabilidade', cargo: 'Analista', data_admissao: '2022-03-15', salario: 4500 },
          { nome: 'Maria Santos', departamento: 'RH', cargo: 'Coordenadora', data_admissao: '2021-08-01', salario: 6000 },
        ]
      },
      {
        name: 'Movimentacoes',
        description: 'Admissões e desligamentos',
        columns: [
          { key: 'data', label: 'Data', type: 'date', required: true, description: 'Data do evento' },
          { key: 'nome', label: 'Nome', type: 'text', required: true, description: 'Nome do colaborador' },
          { key: 'departamento', label: 'Departamento', type: 'text', required: true, description: 'Departamento' },
          { key: 'tipo', label: 'Tipo', type: 'select', required: true, description: 'Admissão ou Desligamento', options: ['Admissão', 'Desligamento'] },
        ],
        examples: [
          { data: '2024-01-15', nome: 'Pedro Costa', departamento: 'TI', tipo: 'Admissão' },
          { data: '2024-02-28', nome: 'Ana Lima', departamento: 'Comercial', tipo: 'Desligamento' },
        ]
      }
    ]
  },

  financial: {
    id: 'financial',
    name: 'Financeiro',
    description: 'Lançamentos financeiros e DRE',
    sheets: [
      {
        name: 'Lancamentos',
        description: 'Receitas e despesas detalhadas',
        columns: [
          { key: 'data', label: 'Data Competência', type: 'date', required: true, description: 'Mês de competência' },
          { key: 'categoria', label: 'Categoria', type: 'text', required: true, description: 'Ex: Receita de Serviços, Salários' },
          { key: 'tipo', label: 'Tipo', type: 'select', required: true, description: 'Receita ou Despesa', options: ['Receita', 'Despesa'] },
          { key: 'valor', label: 'Valor (R$)', type: 'number', required: true, description: 'Valor do lançamento' },
          { key: 'descricao', label: 'Descrição', type: 'text', required: false, description: 'Detalhamento opcional' },
        ],
        examples: [
          { data: '2024-01-01', categoria: 'Receita de Serviços', tipo: 'Receita', valor: 50000, descricao: 'Consultoria Empresa X' },
          { data: '2024-01-05', categoria: 'Salários', tipo: 'Despesa', valor: 35000, descricao: 'Folha de Pagamento' },
          { data: '2024-01-10', categoria: 'Impostos', tipo: 'Despesa', valor: 8000, descricao: 'DAS Simples Nacional' },
        ]
      }
    ]
  },

  sales: {
    id: 'sales',
    name: 'Comercial',
    description: 'Pipeline de vendas e metas',
    sheets: [
      {
        name: 'Oportunidades',
        description: 'Funil de vendas',
        columns: [
          { key: 'id', label: 'ID', type: 'text', required: true, description: 'Identificador único' },
          { key: 'cliente', label: 'Cliente/Lead', type: 'text', required: true, description: 'Nome do prospect' },
          { key: 'vendedor', label: 'Vendedor', type: 'text', required: true, description: 'Responsável' },
          { key: 'etapa', label: 'Etapa', type: 'select', required: true, description: 'Fase do funil', options: ['Prospecção', 'Qualificação', 'Proposta', 'Negociação', 'Fechado Ganho', 'Fechado Perdido'] },
          { key: 'valor', label: 'Valor (R$)', type: 'number', required: true, description: 'Valor estimado' },
          { key: 'data_criacao', label: 'Data Criação', type: 'date', required: true, description: 'Quando entrou no funil' },
        ],
        examples: [
          { id: 'OP-001', cliente: 'Empresa ABC', vendedor: 'Ana Silva', etapa: 'Negociação', valor: 15000, data_criacao: '2024-01-10' },
          { id: 'OP-002', cliente: 'Tech Corp', vendedor: 'Carlos Souza', etapa: 'Fechado Ganho', valor: 22000, data_criacao: '2024-01-05' },
        ]
      },
      {
        name: 'Metas',
        description: 'Metas por vendedor',
        columns: [
          { key: 'mes', label: 'Mês Referência', type: 'date', required: true, description: 'Ex: 2024-01' },
          { key: 'vendedor', label: 'Vendedor', type: 'text', required: true, description: 'Nome do vendedor' },
          { key: 'meta', label: 'Meta (R$)', type: 'number', required: true, description: 'Meta mensal em reais' },
        ],
        examples: [
          { mes: '2024-01', vendedor: 'Ana Silva', meta: 100000 },
          { mes: '2024-01', vendedor: 'Carlos Souza', meta: 80000 },
        ]
      }
    ]
  },

  marketing: {
    id: 'marketing',
    name: 'Marketing',
    description: 'Campanhas e leads',
    sheets: [
      {
        name: 'Campanhas',
        description: 'Performance de campanhas',
        columns: [
          { key: 'mes', label: 'Mês', type: 'date', required: true, description: 'Mês de referência' },
          { key: 'campanha', label: 'Nome Campanha', type: 'text', required: true, description: 'Identificação da campanha' },
          { key: 'canal', label: 'Canal', type: 'select', required: true, description: 'Origem', options: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'Indicação', 'Orgânico'] },
          { key: 'investimento', label: 'Investimento (R$)', type: 'number', required: true, description: 'Valor gasto' },
          { key: 'leads', label: 'Leads Gerados', type: 'number', required: true, description: 'Quantidade de leads' },
          { key: 'conversoes', label: 'Conversões', type: 'number', required: false, description: 'Vendas originadas' },
        ],
        examples: [
          { mes: '2024-01', campanha: 'Black Friday', canal: 'Google Ads', investimento: 5000, leads: 150, conversoes: 12 },
          { mes: '2024-01', campanha: 'Institucional', canal: 'LinkedIn', investimento: 2000, leads: 45, conversoes: 5 },
        ]
      }
    ]
  },

  clients: {
    id: 'clients',
    name: 'Clientes',
    description: 'Base de clientes e contratos',
    sheets: [
      {
        name: 'Clientes',
        description: 'Cadastro de clientes ativos',
        columns: [
          { key: 'nome', label: 'Nome/Razão Social', type: 'text', required: true, description: 'Nome do cliente' },
          { key: 'servico', label: 'Serviço Principal', type: 'text', required: true, description: 'Ex: Contabilidade, BPO' },
          { key: 'regime', label: 'Regime Tributário', type: 'select', required: false, description: 'Tipo de tributação', options: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'MEI'] },
          { key: 'mensalidade', label: 'Mensalidade (R$)', type: 'number', required: true, description: 'Valor do contrato mensal' },
          { key: 'data_inicio', label: 'Data Início', type: 'date', required: true, description: 'Início do contrato' },
        ],
        examples: [
          { nome: 'Padaria Bom Pão', servico: 'Contabilidade', regime: 'Simples Nacional', mensalidade: 800, data_inicio: '2023-01-01' },
          { nome: 'Tech Solutions', servico: 'BPO Financeiro', regime: 'Lucro Presumido', mensalidade: 3500, data_inicio: '2022-06-15' },
        ]
      },
      {
        name: 'Movimentacoes',
        description: 'Entradas e saídas de clientes',
        columns: [
          { key: 'data', label: 'Data', type: 'date', required: true, description: 'Data do evento' },
          { key: 'cliente', label: 'Cliente', type: 'text', required: true, description: 'Nome do cliente' },
          { key: 'tipo', label: 'Tipo', type: 'select', required: true, description: 'Novo ou Churn', options: ['Novo Cliente', 'Churn', 'Upgrade', 'Downgrade'] },
          { key: 'valor_impacto', label: 'Impacto MRR (R$)', type: 'number', required: true, description: 'Valor positivo ou negativo' },
        ],
        examples: [
          { data: '2024-01-15', cliente: 'Nova Empresa LTDA', tipo: 'Novo Cliente', valor_impacto: 1500 },
          { data: '2024-01-28', cliente: 'Antiga Corp', tipo: 'Churn', valor_impacto: -2000 },
        ]
      }
    ]
  },

  services: {
    id: 'services',
    name: 'Serviços',
    description: 'Margens e rentabilidade por serviço',
    sheets: [
      {
        name: 'Servicos',
        description: 'Performance por linha de serviço',
        columns: [
          { key: 'mes', label: 'Mês', type: 'date', required: true, description: 'Mês de referência' },
          { key: 'servico', label: 'Serviço', type: 'text', required: true, description: 'Linha de serviço' },
          { key: 'receita', label: 'Receita (R$)', type: 'number', required: true, description: 'Faturamento do serviço' },
          { key: 'custo_direto', label: 'Custo Direto (R$)', type: 'number', required: true, description: 'Custos alocados' },
          { key: 'clientes', label: 'Nº Clientes', type: 'number', required: false, description: 'Clientes neste serviço' },
        ],
        examples: [
          { mes: '2024-01', servico: 'Contabilidade', receita: 80000, custo_direto: 40000, clientes: 120 },
          { mes: '2024-01', servico: 'BPO Financeiro', receita: 35000, custo_direto: 15000, clientes: 25 },
        ]
      }
    ]
  },

  cashflow: {
    id: 'cashflow',
    name: 'Fluxo de Caixa',
    description: 'Entradas e saídas de caixa',
    sheets: [
      {
        name: 'Movimentacoes',
        description: 'Fluxo de caixa diário/semanal',
        columns: [
          { key: 'data', label: 'Data', type: 'date', required: true, description: 'Data da movimentação' },
          { key: 'tipo', label: 'Tipo', type: 'select', required: true, description: 'Entrada ou Saída', options: ['Entrada', 'Saída'] },
          { key: 'categoria', label: 'Categoria', type: 'text', required: true, description: 'Ex: Recebimento, Fornecedor' },
          { key: 'valor', label: 'Valor (R$)', type: 'number', required: true, description: 'Valor da movimentação' },
          { key: 'descricao', label: 'Descrição', type: 'text', required: false, description: 'Detalhamento' },
        ],
        examples: [
          { data: '2024-01-05', tipo: 'Entrada', categoria: 'Recebimento Clientes', valor: 45000, descricao: 'Mensalidades Janeiro' },
          { data: '2024-01-10', tipo: 'Saída', categoria: 'Folha de Pagamento', valor: 35000, descricao: 'Salários' },
        ]
      }
    ]
  }
};

// Gera o arquivo XLSX a partir do template
export const generateSmartTemplate = (templateId: string): ArrayBuffer => {
  const template = smartTemplates[templateId];
  if (!template) throw new Error(`Template ${templateId} não encontrado`);

  const wb = XLSX.utils.book_new();

  template.sheets.forEach(sheet => {
    const headers = sheet.columns.map(col => col.key);
    const ws = XLSX.utils.json_to_sheet(sheet.examples, { header: headers });
    
    // Ajusta largura das colunas
    ws['!cols'] = headers.map(() => ({ wch: 18 }));
    
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
};

// Analisa arquivo uploaded e retorna resumo
export interface FileAnalysis {
  fileName: string;
  totalRows: number;
  sheets: {
    name: string;
    rows: number;
    columns: string[];
    preview: Record<string, any>[];
  }[];
  warnings: string[];
}

export const analyzeUploadedFile = async (file: File, templateId: string): Promise<FileAnalysis> => {
  const template = smartTemplates[templateId];
  const warnings: string[] = [];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheets = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];
          const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

          // Verifica colunas esperadas
          const expectedSheet = template?.sheets.find(s => 
            s.name.toLowerCase() === sheetName.toLowerCase() ||
            s.name.replace(/_/g, ' ').toLowerCase() === sheetName.toLowerCase()
          );

          if (expectedSheet) {
            const requiredCols = expectedSheet.columns.filter(c => c.required).map(c => c.key);
            const missingCols = requiredCols.filter(col => 
              !columns.some(c => c.toLowerCase() === col.toLowerCase())
            );
            if (missingCols.length > 0) {
              warnings.push(`Aba "${sheetName}": colunas obrigatórias não encontradas: ${missingCols.join(', ')}`);
            }
          }

          return {
            name: sheetName,
            rows: jsonData.length,
            columns,
            preview: jsonData.slice(0, 3) // Primeiras 3 linhas para preview
          };
        });

        const totalRows = sheets.reduce((sum, s) => sum + s.rows, 0);

        resolve({
          fileName: file.name,
          totalRows,
          sheets,
          warnings
        });
      } catch (error) {
        reject(new Error('Erro ao processar arquivo. Verifique se é um XLSX/CSV válido.'));
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsArrayBuffer(file);
  });
};

// Processa e transforma os dados uploaded
export const processUploadedData = async (file: File): Promise<Record<string, any[]>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const result: Record<string, any[]> = {};
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        });

        resolve(result);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo.'));
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsArrayBuffer(file);
  });
};
