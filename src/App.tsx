import type {Component} from 'solid-js';
import {createSignal, For} from "solid-js";
import {AsyncUnzipInflate, Unzip, UnzipFile} from "fflate"
import styles from './App.module.css';
import {NavBar} from "./components/NavBar/NavBar";
import {isMapFile} from "./utils/mapExpression";
import {Map} from "./components/Map";


const App: Component = () => {

  const [error, setError] = createSignal("")
  const [maps, setMaps] = createSignal<UnzipFile[]>([])
  const [currentMap, setCurrentMap] = createSignal<UnzipFile>()
  let fileUploadElement: HTMLInputElement

  const handleFileUpload = async (e: Event) => {
    e.preventDefault()
    setError("")
    setCurrentMap(undefined)
    const file = fileUploadElement.files![0] ?? null
    if (!file) {
      setError("Upload a file")
      return
    }

    const reader = new Unzip()
    reader.register(AsyncUnzipInflate)

    const files: Array<UnzipFile> = [];

    reader.onfile = (f) => {
      files.push(f)
    }

    if (!file.stream) {
      setError(
        "Your browser is not supported"
      );
      return;
    }

    const fileReader = file.stream().getReader()

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

    setMaps(files.filter(f => isMapFile(f.name)))
  }

  return (
    <div class={styles.Layout}>
      <NavBar/>
      <div class={styles.border}>
        <form onSubmit={async e => await handleFileUpload(e)}>
          <input ref={fileUploadElement!} type={"file"} accept={"application/zip"}/>
          <button type={"submit"}>submit</button>
          <a class={styles.error}>{error()}</a>
        </form>
        <ul>
          <For each={maps()}>{(map) =>
            <li>
              <a onclick={() => {
                setCurrentMap(map)
              }
              }>
                {map.name}
              </a>
            </li>
          }</For>
        </ul>
        {currentMap() && <Map map={currentMap()!}/>}
      </div>
    </div>
  );
};

export default App;
