/**
 * Télécharge un fichier CSV à partir d'en-têtes et de lignes.
 * Échappe les cellules avec des guillemets pour un CSV valide.
 */
export function downloadCsv(headers: string[], rows: string[][], filename: string): void {
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n")

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Génère un nom de fichier avec la date du jour (ex. commandes_2026-02-23.csv). */
export function csvFilename(prefix: string): string {
  return `${prefix}_${new Date().toISOString().split("T")[0]}.csv`
}
