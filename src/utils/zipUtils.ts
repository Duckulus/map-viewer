import {AsyncUnzipInflate, Gunzip, Unzip, UnzipFile} from "fflate";
import * as nbt from "nbt"

export type MapType = {
  dataVersion: number,
  dimention: string,
  colors: number[]
}

export const extractFiles = async (archive: File): Promise<Array<UnzipFile>> => {
  const reader = new Unzip()
  reader.register(AsyncUnzipInflate)

  const files: Array<UnzipFile> = [];

  reader.onfile = (f) => {
    files.push(f)
  }


  const fileReader = archive.stream().getReader()

  while (true) {
    const {done, value} = await fileReader.read();
    if (done) {
      reader.push(new Uint8Array(0), true);
      break;
    }
    for (let i = 0; i < value.length; i += 65536) {
      reader.push(value.subarray(i, i + 65536));
    }
  }

  return files
}

export const gunzipFile = (map: UnzipFile) => {
  const gzip = new Gunzip()
  let nbtData: any

  gzip.ondata = (data) => {
    if (data) {
      nbtData = nbt.parseUncompressed(data.buffer)

    }
  }

  map.ondata = (err, data, final) => {
    if (err) {
      console.error(err)
      return;
    }
    if (final) {
      map.terminate()
      return
    }
    if (data && !final) {
      gzip.push(data, true)
    }

  }

  map.start()

  while (true) {
    if(nbtData) return nbtData
  }
}

export const parseRawNbt = (rawNbt: any): MapType => {
  const object = rawNbt.value
  return {
    dataVersion: object.DataVersion.value,
    dimention: object.data.value.dimension.value,
    colors: object.data.value.colors.value
  }
}