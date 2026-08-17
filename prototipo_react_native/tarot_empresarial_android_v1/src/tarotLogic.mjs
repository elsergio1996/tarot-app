export const spreads = {
  one: { id: 'one', name: 'Carta del día', count: 1 },
  three: { id: 'three', name: 'Pasado · Presente · Futuro', count: 3 },
  five: { id: 'five', name: 'Lectura profunda', count: 5 }
};

export function drawCards(deck, count, random = Math.random) {
  if (!Array.isArray(deck) || deck.length < count || count < 1) throw new Error('Mazo insuficiente');
  const pool = [...deck];
  const result = [];
  while (result.length < count) {
    const idx = Math.floor(random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

export function sessionPrice(basePrice, minutes, live = false) {
  if (basePrice < 0 || minutes <= 0) throw new Error('Datos inválidos');
  const multiplier = live ? 1.25 : 1;
  return Math.round(basePrice * (minutes / 30) * multiplier);
}
