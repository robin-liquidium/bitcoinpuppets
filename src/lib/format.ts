export function formatSats(sats: number) {
  return new Intl.NumberFormat("en-US").format(sats);
}
