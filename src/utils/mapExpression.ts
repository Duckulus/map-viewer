export const isMapFile = (input: string) => {
  let regex = /map_[0-9]+\.dat/i;
  return regex.test(input);
}