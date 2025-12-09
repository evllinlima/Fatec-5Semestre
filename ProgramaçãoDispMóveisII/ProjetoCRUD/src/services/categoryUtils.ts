/**
 * Utilitários para categorias de produtos
 * Mantém valores em lowercase para API, mas exibe com labels legíveis
 */

// Valores reais para API (lowercase)
export const CATEGORY_VALUES = [
  'cleanser',
  'toner',
  'serum',
  'moisturizer',
  'sunscreen',
  'mask',
  'other',
] as const;

// Mapa de valores para labels legíveis
export const CATEGORY_LABELS: Record<string, string> = {
  cleanser: 'Limpador',
  toner: 'Tônico',
  serum: 'Sérum',
  moisturizer: 'Hidratante',
  sunscreen: 'Protetor Solar',
  mask: 'Máscara',
  other: 'Outro',
};

/**
 * Converte categoria para label legível
 * @param category - valor lowercase (ex: 'serum')
 * @returns label capitalizado (ex: 'Sérum')
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category.toLowerCase()] || category;
}

/**
 * Converte categoria para emoji
 * @param category - valor lowercase (ex: 'serum')
 * @returns emoji correspondente
 */


/**
 * Normaliza categoria para lowercase
 * @param category - entrada (ex: 'Sérum' ou 'SERUM')
 * @returns categoria em lowercase (ex: 'serum')
 */
export function normalizeCategoryValue(category: string): string {
  return category.toLowerCase();
}
