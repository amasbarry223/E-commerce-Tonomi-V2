/**
 * Utilitaires pour l'export de données
 */

/**
 * Exporte des données en CSV
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  getRow: (item: T) => string[],
  filename: string
): void {
  const rows = data.map(getRow)
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell)}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

