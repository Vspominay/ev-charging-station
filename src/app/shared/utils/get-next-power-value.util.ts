export const getNextPowerValue = (currentMax: number): number => {
  if (currentMax < 10) {
    return 10;
  }

  const scale = Math.pow(10, Math.floor(Math.log10(currentMax)));
  const normalized = currentMax / scale;
  const nextNormalized = normalized < 2 ? 2 : normalized < 5 ? 5 : 10;

  return nextNormalized * scale;
};
