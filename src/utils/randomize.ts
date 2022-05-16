export function shuffle_array(a: any[]) {
  let currentIndex = a.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]];
  }
  return a;
}
