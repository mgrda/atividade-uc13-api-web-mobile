export const formatHour = (input: string | Date): string => {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    return "Hora inválida";
  }

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}