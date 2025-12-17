// src\services\api\modules\brasilApi.ts
import axios from 'axios';
import { CnpjResponse, CepResponse } from '@/types/api/brasilApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sleep } from '@/utils/other';

export interface CpfResponse {
  status: number;
  cpf: string;
  nome: string;
  nascimento: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  pacoteUsado: number;
  saldo: number;
  consultaID: string;
  delay: number;
}

export const brasilApi = {
  getCNPJ: async (cnpj: string): Promise<CnpjResponse> => {
    const onlyNumbers = cnpj.replace(/[^\d]+/g, '');
    const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${onlyNumbers}`);
    return response.data;
  },
  getCEP: async (cep: string): Promise<CepResponse> => {
    const onlyNumbers = cep.replace(/[^\d]+/g, '');
    const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${onlyNumbers}`);
    return response.data;
  },
  getCPF: async (cpf: string): Promise<CpfResponse> => {
    const onlyNumbers = cpf.replace(/[^\d]+/g, '');

    try {
      const cachedData = await AsyncStorage.getItem(`cpf-${onlyNumbers}`);
      if (cachedData) {
        // simular consulta
        await sleep(1000);

        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.warn('Error fetching CPF data from AsyncStorage:', err);
    }

    const response = await axios.get(`https://api.cpfcnpj.com.br/68680e717bb374f3e213f2eff69c916e/3/${onlyNumbers}`);

    if (response.status === 200) {
      try {
        await AsyncStorage.setItem(`cpf-${onlyNumbers}`, JSON.stringify(response.data));
      } catch (e) {
        console.warn('Error saving CPF data to AsyncStorage:', e);
      }
    }

    return response.data;
  },
};
