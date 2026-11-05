// Notes fictives pour la démonstration, à remplacer par de vrais avis. Toujours affichées avec le mot « démo ».
export function demoRating(handle: string) {
  const seed = [...handle].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return { rating: 4 + ((seed % 9) + 1) / 10, count: 8 + (seed % 90) }
}
