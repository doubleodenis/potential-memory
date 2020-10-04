import React, { useState } from 'react';
import Intro from './components/Intro'
import List from './components/List'
import styles from './App.module.css'

function App() {
  const [ready, setReady] = useState(false)
  const [inputSelected, setInputSelected] = useState(false)

  return (
    <div id="mainContainer" className={`w-100 d-flex justify-content-center align-items-center ${styles.bigContainer}`}>
      {!ready ? (
        <Intro selected={inputSelected} setSelected={setInputSelected}/>
      ):(
        <List/>
      )}
    </div>
  )
}

export default App
