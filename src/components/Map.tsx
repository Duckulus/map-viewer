import {Component, createEffect, createSignal} from "solid-js";
import {Gunzip, UnzipFile} from "fflate";
import * as nbt from "nbt"
import {drawPixelToImageData} from "../utils/canvasUtils";
import {mapColors} from "../utils/colors";

type Map = {
  dataVersion: number,
  dimention: string,
  colors: number[]
}

const parseRawNbt = (rawNbt: any): Map => {
  const object = rawNbt.value
  return {
    dataVersion: object.DataVersion.value,
    dimention: object.data.value.dimension.value,
    colors: object.data.value.colors.value
  }
}

export const Map: Component<{ map: UnzipFile }> = (props) => {
  const [currentMap, setCurrentMap] = createSignal<Map>()

  createEffect(() => {
    const gzip = new Gunzip()
    gzip.ondata = (data) => {
      if (data) {
        const nbtCompound = nbt.parseUncompressed(data.buffer)
        setCurrentMap(parseRawNbt(nbtCompound))
      }
    }

    props.map.ondata = (err, data, final) => {
      if (err) {
        console.error(err)
      }
      if (final) {
        props.map.terminate()
        return
      }
      if (data && !final) {
        gzip.push(data, true)
      }

    }

    props.map.start()
  })


  return <div>
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

const MapCanvas: Component<{ map: Map }> = (props) => {
  let canvas: HTMLCanvasElement

  createEffect(() => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const imageData = ctx.createImageData(128, 128)
    for (let i = 0; i < 128; i++) {
      for (let j = 0; j < 128; j++) {
        let color = mapColors[props.map.colors[i + j * 128] - 4]
        if(color) {
          const {r, g, b} = color
          drawPixelToImageData(imageData, i, j, 128, r, g, b,false)
        } else {
          drawPixelToImageData(imageData, i, j, 128, 0,0,0,true)
        }

      }
    }
    ctx.putImageData(imageData, 0, 0)
  })

  return <canvas width={128} height={128} ref={canvas!}/>
}