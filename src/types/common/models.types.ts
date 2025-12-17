import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Address {
  id_endereco?: bigint;
  id_cliente?: bigint;
  apelido_endereco?: string;
  cep: string;
  numero: string;
  rua: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  // uf: string;
  latitude?: Double;
  longitude?: Double;
  status?: number;
  data_criacao?: string | null; // ISO date string (e.g., "2025-09-10T16:05:00.000Z")
  data_atualizacao?: string | null; // Nullable, as per DateTime?
}

export interface Responsavel {
  nome: string;
  cpf: string;
  orgao_emissor: string;
  rg: string;
  nacionalidade: string;
  data_nascimento: string;
  estado_civil: string;
  email: string;
  telefone_contato: string;
  profissao: string;
  cep: string;
  logradouro: string;
  cidade: string;
  bairro: string;
  estado: string;
  numero: string;
  complemento?: string;
  data_insercao?: Date;
  id_cliente?: bigint;
}

export type ResponsavelTecnicoTipo = undefined | 'CREA' | 'CRQ' | 'MTE' | 'ANTT' | 'CRF';

export interface ResponsavelTecnico {
  Id?: bigint;
  nome: string;
  documento: string;
  tipo: ResponsavelTecnicoTipo;
  matricula_mtb: string;
  data_criacao?: Date;
  id_cliente?: bigint;
}

export interface Company {
  id_cliente: bigint;
  ativo: boolean | null;
  tm_cadastro: Date | string | null;
  projeto: string;
  pf_pj: string;
  pj_pf: number;
  telefone: string;
  telefonePj: string;
  ramal?: string;
  email?: string;
  emailCobranca?: string;
  cpf_cnpj: string;
  cpf: string;
  cnpj: string;
  nome: string;
  nomeFantasia?: string;
  razaoSocial?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia?: string;
  complemento?: string;
  autorizado: boolean;
  voucher: number;
  saldo: number;
  id_tipo: bigint;
  id_seguradora: bigint;
  celular?: string;
  login_nome: string;
  login_email: string;
  login: string;
  senha: string;
  tipo_cliente: string;
  responsaveis: Responsavel[];
  responsaveisTecnicos: ResponsavelTecnico[];
  id_login: bigint;
  password?: string;
  confirmPassword?: string;
}

export interface Category {
  id: bigint;
  name: string;
}

export interface ExistingDocument {
  idDocumento: number;
  idCliente: bigint;
  nomeDocumento: string;
  caminhoDocumento: string;
  dataCriacao: Date | string;
  usuarioCriacao: bigint | number;
  tipoDocumento: string;
  status: boolean;
  idDocumentoTipo: number;
}