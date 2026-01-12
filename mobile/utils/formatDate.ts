export const formatDate = (input: string | Date): string => {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  return date.toLocaleDateString("pt-BR");
};