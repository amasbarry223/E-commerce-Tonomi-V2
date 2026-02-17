/**
 * Utilitaires de tri déterministes
 */

/**
 * Trie un tableau de manière déterministe avec un tri secondaire par ID
 */
export function deterministicSort<T>(
  array: T[],
  compareFn: (a: T, b: T) => number,
  getId: (item: T) => string
): T[] {
  return [...array].sort((a, b) => {
    const diff = compareFn(a, b)
    return diff !== 0 ? diff : getId(a).localeCompare(getId(b))
  })
}

/**
 * Trie par date (plus récent en premier) avec tri secondaire par ID
 */
export function sortByDate<T>(array: T[], getDate: (item: T) => string, getId: (item: T) => string): T[] {
  return deterministicSort(
    array,
    (a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime(),
    getId
  )
}

/**
 * Trie par nombre (décroissant) avec tri secondaire par ID
 */
export function sortByNumber<T>(array: T[], getNumber: (item: T) => number, getId: (item: T) => string): T[] {
  return deterministicSort(
    array,
    (a, b) => getNumber(b) - getNumber(a),
    getId
  )
}

