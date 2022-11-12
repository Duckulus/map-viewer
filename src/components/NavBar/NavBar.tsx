import {Component} from "solid-js";
import styles from "./NavBar.module.css"

export const NavBar: Component = () => {
  return <div class={styles.NavBar}>
    <a href={import.meta.env.BASE_URL}>Home</a>
  </div>
}
