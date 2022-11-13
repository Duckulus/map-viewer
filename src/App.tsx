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
    if(maps().length==0) setError("No Map found in this File")
  }

  return (
    <div class={styles.Layout}>
      <NavBar/>
      <div class={styles.border}>
        <form onSubmit={async e => await handleFileUpload(e)}>
          <div class="mb-3">
            <label for="formFile" class="form-label">Upload Map File</label>
            <input ref={fileUploadElement!} class="form-control" type="file" id="formFile" accept={"application/zip"}/>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
          <br/>
          <a class={styles.error}>{error()}</a>
        </form>
        {mapUploaded() &&
            <>
              {maps().length > 0 ?
                <>
                  <h3>Select a Map</h3>
                  <div class="card" style="width: 18rem;">
                    <ul class="list-group list-group-flush">
                      <For each={maps()}>{(map) =>
                        <li class={"list-group-item"}>
                          <a onclick={() => {
                            setCurrentMap(map)
                          }
                          }>
                            {map.name}
                          </a>
                        </li>
                      }</For>
                    </ul>
                  </div>
                </> : <></>
              }
            </>
        }
        {currentMap() && <Map map={currentMap()!}/>}
      </div>
    </div>
  );
};

export default App;
