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
  const [mapUploaded, setMapUploaded] = createSignal(false)
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
    setMapUploaded(true)
    setMaps(files.filter(f => isMapFile(f.name)))
  }

  return (
    <div class={styles.Layout}>
      <NavBar/>
      <div class={styles.border}>
        <h3>Upload your World File</h3>
        <form onSubmit={async e => await handleFileUpload(e)}>
          <input ref={fileUploadElement!} type={"file"} accept={"application/zip"}/>
          <br/>
          <button type={"submit"}>submit</button>
          <br/>
          <a class={styles.error}>{error()}</a>
        </form>
        {mapUploaded() &&
            <>
              {maps().length>0 ?
                <>
                  <h3>Select a Map</h3>
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
                </> :
                <>
                  <h3>No Maps found in this Archive</h3>
                </>

              }
            </>
        }
        {currentMap() && <Map map={currentMap()!}/>}
      </div>
    </div>
  );
};

export default App;
