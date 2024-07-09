export function prettifyDate(dateString) {
  return `${new Intl.DateTimeFormat("de-DE", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Europe/Berlin",
  }).format(new Date(dateString))} Uhr`;
}
