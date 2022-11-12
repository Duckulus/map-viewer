export const drawPixelToImageData = (imageData: ImageData, x: number, y: number, width: number, r: number, g: number, b: number, transparent: boolean) => {
  const value = y * (width * 4) + x * 4
  imageData.data[value] = r
  imageData.data[value + 1] = g
  imageData.data[value + 2] = b
  imageData.data[value + 3] = transparent? 0 : 255
}