import React, { useState } from 'react'
import styles from './Intro.module.css'

const Intro = ({ selected, setSelected }) => {
  const [searchResults, setSearchResults] = useState(["Search1", "Search2", "Search3"])

  function getSearchResults(query) {
    // setSearchResults()
  }

  return (
    <div className={`${styles.container} d-flex flex-column align-items-center`}>
      <div style={{ marginBottom: "28px" }}>
        <h1 className={styles.textGeneral + " " + styles.heading}>Welcome to uniqueHack!</h1>
        <p className={styles.textGeneral}>Search for the hackathon that you are judging and we’ll generate a similarity report for you!</p>
      </div>
      {selected === null ? (
        <div className="d-flex justify-content-center" style={{ width: "100%" }}>
          <input style={{ marginRight: "10px", width: "100%" }} type="search" id="hackSearch" className={styles.search} placeholder="Search Hackathons" />
          <button className={styles.searchButton} onClick={() => {
            getSearchResults(document.getElementById("hackSearch").value)
          }}>
            Search
          </button>
        </div>
      ):(
        <div/>
      )}
      {searchResults !== null && selected === null ? (
        <div style={{ marginTop: "18px", marginBottom: "18px" }} className="d-flex flex-column align-items-start w-100">
          <div style={{ marginBottom: "10px" }}>Select one of the follwing:</div>
          {searchResults.map((result, i) => {
            return (
              <button key={"result" + i} onClick={() => setSelected(result)} className={styles.selectionButton + " w-100"} style={{ marginBottom: "4px" }}>
                {result}
              </button>
            )
          })}
        </div>
      ):(
        <div/>
      )}
      {selected !== null ? (
        <>
          <div className="d-flex flex-column align-items-center" style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "18px" }}>You selected <span style={{ color: "#000c79", fontWeight: "500" }}>{selected}</span></div>
            <button onClick={() => setSelected(null)} className={styles.cancelSelection}>
              Cancel Selection
            </button>
          </div>
          <button className={styles.generateButton}>
            Generate Report
          </button>
        </>
      ):(
        <div/>
      )}
    </div>
  )
}

export default Intro