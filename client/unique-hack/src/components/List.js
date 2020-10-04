import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ProjectCard from './ProjectCard'
import styles from './List.module.css'

const List = ({ hack }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`http://localhost:4000/api/analyze-hackathon/?link=${hack.link}`)
        .then(res => {
            console.log(res)
            setLoading(false)
            setTimeout(() => {
                setData(res.data)
            }, 100)
        })
        .catch(function (error) {
            console.log(error)
        })
    }, [])

    return (
        <div className="d-flex flex-column align-items-center w-100">
            <div className={`${styles.headerCard} d-flex justify-content-center`} style={{ marginBottom: "20px" }}>
                <h1>
                    Showing Results For <span style={{ color: "#000c79", fontWeight: "500" }}>{hack.title}</span> 
                </h1>
            </div>
            {data.map((singleData, i) => {
                return (
                    <div key={"data" + i} style={{ marginBottom: "20px", width: "100%" }}>
                        <ProjectCard project={singleData}/>
                    </div>
                )
            })}
            {loading ? (
                <div style={{ marginTop: "100px", fontSize: "30px" }}>
                    Loading...
                </div>
            ):(
                <div/>
            )}
        </div>
    )
}

export default List