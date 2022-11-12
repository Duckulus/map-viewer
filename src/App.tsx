import type {Component} from 'solid-js';
import {createSignal, For} from "solid-js";
import {UnzipFile} from "fflate"
import styles from './App.module.css';
import {NavBar} from "./components/NavBar/NavBar";
import {isMapFile} from "./utils/mapExpression";
import {Map} from "./components/Map";
import {extractFiles} from "./utils/zipUtils";


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


    if (!file.stream) {
      setError(
        "Your browser is not supported"
      );
      return;
    }

    const files = await extractFiles(file)

    setMaps(files.filter(f => isMapFile(f.name)))
  }

  return (
    <div class={styles.Layout}>
      <NavBar/>
      <div class={styles.border}>
        <form onSubmit={async e => await handleFileUpload(e)}>
          <input ref={fileUploadElement!} type={"file"} accept={"application/zip"}/>
          <br/>
          <button type={"submit"}>submit</button>
          <br/>
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
