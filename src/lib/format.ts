export function formatSats(sats: number): string {
  return new Intl.NumberFormat("en-US").format(sats);
}
