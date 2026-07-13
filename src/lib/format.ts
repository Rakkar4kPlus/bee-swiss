export function formatPrice(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(value);
}

export function orderStatusLabel(status: string) {
  switch (status) {
    case "NEU":
      return "Neu";
    case "IN_BEARBEITUNG":
      return "In Bearbeitung";
    case "ERLEDIGT":
      return "Erledigt";
    default:
      return status;
  }
}
