import licensePlateImages from '@/assets/licensePlate/licensePlate';

const OLD_PLATE_REGEX = /^[A-Z]{3}\d{4}$/; // AAA1234
const NEW_PLATE_REGEX = /^[A-Z]{3}\d[A-Z]\d{2}$/; // AAA1A23

const formatOld = (raw: string) => `${raw.slice(0, 3)}-${raw.slice(3)}`;
const stripNonAlnum = (s: string) => s.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

/**
 * Retorna a imagem adequada e a placa formatada:
 * - Antigo => AAA-1234
 * - Novo (Mercosul) => AAA1A23
 */
const getPlacaInfo = (placa: string): { imagem: any; placaFormatada: string } => {
  const normalized = stripNonAlnum(placa);

  if (OLD_PLATE_REGEX.test(normalized)) {
    // Modelo antigo: mostrar com hífen
    return {
      imagem: licensePlateImages.oldModel,
      placaFormatada: formatOld(normalized),
    };
  }

  if (NEW_PLATE_REGEX.test(normalized)) {
    // Modelo novo (Mercosul): sem hífen
    return {
      imagem: licensePlateImages.newModel,
      placaFormatada: normalized,
    };
  }

  return {
    imagem: licensePlateImages.oldModel,
    placaFormatada: placa.trim().toUpperCase(),
  };
};

/**
 * Formata para envio na API:
 * - Antigo => AAA-1234
 * - Novo => AAA1A23
 * (Aceita entradas com/sem hífen, espaços, etc.)
 */
export const formatPlateText = (placa: string): string => {
  const normalized = stripNonAlnum(placa);

  if (OLD_PLATE_REGEX.test(normalized)) return formatOld(normalized);
  if (NEW_PLATE_REGEX.test(normalized)) return normalized;

  return normalized;
};

export default getPlacaInfo;
