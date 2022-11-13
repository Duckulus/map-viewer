import {Component, createEffect, createSignal} from "solid-js";
import {UnzipFile} from "fflate";
import {drawPixelToImageData} from "../utils/canvasUtils";
import {mapColors} from "../utils/colors";
import {gunzipFile, MapType, parseRawNbt} from "../utils/zipUtils";


export const Map: Component<{ map: UnzipFile }> = (props) => {
  const [currentMap, setCurrentMap] = createSignal<MapType>()

  createEffect(() => {
    try {
      setCurrentMap(parseRawNbt(gunzipFile(props.map)))
    } catch (e) {
      setCurrentMap(undefined)
    }
  })
  if(props.map){
    return <div class={"card"}>
      <ul>
        <li>Name: {props.map.name}</li>
        <li>Compression: {props.map.compression}</li>
        <li>Size: {props.map.size}</li>
        <li>DataVersion: {currentMap()?.dataVersion}</li>
        <li>Dimension: {currentMap()?.dimention}</li>
      </ul>
      <MapCanvas map={currentMap()!}/>
    </div>
  }
  else {
    return <></>
  }
}

const MapCanvas: Component<{ map: MapType }> = (props) => {
  let canvas: HTMLCanvasElement

  createEffect(() => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if(props.map) {
      const imageData = ctx.createImageData(128, 128)
      for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 128; j++) {
          let color = mapColors[props.map.colors[i + j * 128] - 4]
          if (color) {
            const {r, g, b} = color
            drawPixelToImageData(imageData, i, j, 128, r, g, b, false)
          } else {
            drawPixelToImageData(imageData, i, j, 128, 0, 0, 0, true)
          }

        }
      }
      ctx.putImageData(imageData, 0, 0)
    } else {
      ctx.fillRect(0,0,128,128)
    }
  })

  return <canvas width={128} height={128} ref={canvas!}/>
}