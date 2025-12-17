// services/fetchMockAPI.ts
export interface CompanyInfo {
  nome: string;
  cnpj: string;
  nomeComercial: string;
  local: string;
}

export interface CustodyChainItem {
  title: string;
  company: string;
  date: string;
  color: string;
}

export interface CryptedData {
  sequencialId: string;
  produto: string;
  empresa: CompanyInfo;
  lote: string;
  quantidade: string;
  tamanho: string;
  fabricacao: string;
  validade: string;
  custodyChain: CustodyChainItem[];
}

export interface SimpleData {
  id: string;
  produto: string;
  fabricante: string;
  lote: string;
  fabricacao: string;
  validade: string;
  rastreio: any[];
}

export interface ProcessedResult {
  type: 'crypted' | 'simple';
  data: CryptedData | SimpleData;
}

// Mock companies data
const MOCK_COMPANIES: Record<string, CompanyInfo> = {
  '0056': {
    nome: 'Bayer do Brasil',
    cnpj: '18.459.628/0001-15',
    nomeComercial: 'Bayer CropScience',
    local: 'São Paulo, SP',
  },
  '0123': {
    nome: 'Syngenta Brasil',
    cnpj: '60.744.463/0010-80',
    nomeComercial: 'Syngenta Proteção de Cultivos',
    local: 'São Paulo, SP',
  },
  '0789': {
    nome: 'BASF Brasil',
    cnpj: '48.539.407/0001-18',
    nomeComercial: 'BASF Agro',
    local: 'São Paulo, SP',
  },
  '0345': {
    nome: 'Corteva Agriscience',
    cnpj: '61.064.929/0001-79',
    nomeComercial: 'Corteva Brasil',
    local: 'São Paulo, SP',
  },
};

// Simulate API delay and potential errors
const simulateAPICall = async <T>(operation: () => T, delay: number = 2000): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 10% chance of timeout/error
      if (Math.random() < 0.1) {
        reject(new Error('Timeout: Falha na conexão com o servidor'));
        return;
      }

      try {
        const result = operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
};

// Format date helper
const formatDate = (dateStr: string): string => {
  if (dateStr && dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  return 'N/A';
};

// Format date with time helper
const formatDateWithTime = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Generate mock custody chain
const generateMockCustodyChain = (empresaInfo: CompanyInfo, year: string = '2025'): CustodyChainItem[] => {
  const baseDate = new Date(`${year}-06-30`);

  return [
    {
      title: 'Produção',
      company: `${empresaInfo.nomeComercial} - ${empresaInfo.local}`,
      date: formatDateWithTime(new Date(baseDate.getTime())),
      color: '#22c55e',
    },
    {
      title: 'Embalagem',
      company: `${empresaInfo.nomeComercial} - Centro de Embalagem`,
      date: formatDateWithTime(new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000)),
      color: '#3b82f6',
    },
    {
      title: 'Transporte',
      company: 'TransAgro Logística',
      date: formatDateWithTime(new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000)),
      color: '#eab308',
    },
    {
      title: 'Armazenamento',
      company: `Centro de Distribuição - ${empresaInfo.local}`,
      date: formatDateWithTime(new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000)),
      color: '#a855f7',
    },
    {
      title: 'Venda',
      company: `Casa da Agricultura - ${empresaInfo.local}`,
      date: formatDateWithTime(new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000)),
      color: '#f97316',
    },
    {
      title: 'Fiscalização MAPA',
      company: 'Fiscal João Silva - CRF 12345',
      date: formatDateWithTime(new Date(baseDate.getTime() + 16 * 24 * 60 * 60 * 1000)),
      color: '#ef4444',
    },
    {
      title: 'Aplicação',
      company: 'Fazenda Santa Maria - José Carlos',
      date: formatDateWithTime(new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000)),
      color: '#14b8a6',
    },
  ];
};

// Process encrypted QR data
export const processCryptedQRData = async (hashData: string): Promise<ProcessedResult> => {
  return simulateAPICall(() => {
    const parts = hashData.split('|');

    if (parts.length < 8) {
      throw new Error('Formato de dados não reconhecido na hash descriptografada.');
    }

    const [sequencialId, empresa, produto, lote, dataFabricacao, dataValidade, quantidade, tamanho] = parts;

    const empresaInfo = MOCK_COMPANIES[empresa] || {
      nome: 'Empresa não identificada',
      cnpj: 'N/A',
      nomeComercial: 'Empresa não identificada',
      local: 'N/A',
    };

    const custodyChain = generateMockCustodyChain(empresaInfo, '2025');

    return {
      type: 'crypted' as const,
      data: {
        sequencialId,
        produto: produto.replace(/-/g, ' '),
        empresa: empresaInfo,
        lote,
        quantidade,
        tamanho,
        fabricacao: formatDate(dataFabricacao),
        validade: formatDate(dataValidade),
        custodyChain,
      },
    };
  });
};



