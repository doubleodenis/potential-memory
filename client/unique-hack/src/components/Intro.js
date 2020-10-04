import React from 'react'
import styles from './Intro.module.css'

const Intro = ({ selected, setSelected }) => {
  return (
    <div className={`${styles.container} d-flex flex-column align-items-center`}>
      <div style={{ marginBottom: "28px" }}>
        <h1 className={styles.textGeneral + " " + styles.heading}>Welcome to uniqueHack!</h1>
        <p className={styles.textGeneral}>Search for the hackathon that you are judging and we’ll generate a similarity report for you!</p>
      </div>
      <div className="d-flex justify-content-center" style={{ marginBottom: selected ? "40px" : "0px", width: "100%" }}>
        <input style={{ marginRight: "10px", width: "100%" }} type="search" id="hackSearch" className={styles.search} placeholder="Search Hackathons" />
        <button className={styles.searchButton}>
          Search
        </button>
      </div>
      {selected ? (
        <button className={styles.generateButton}>
          Generate Report
        </button>
      ):(
        <div/>
      )}
    </div>
  )
}

export default Intro