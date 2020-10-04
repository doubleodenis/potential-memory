import React from 'react'
import ProjectCard from './ProjectCard'

const testData = [{
    image: "",
    name: "Flying Pants",
    team: ["Jimbo Son", "Hudson Hornet", "Kris Kyler"],
    details: ""
},{
    image: "",
    name: "Swimming Socks",
    team: ["Basolun Fondo", "Hudson Hornet", "Kris Kyler", "Piano Man"],
    details: ""
},{
    image: "",
    name: "Dying Weasel",
    team: ["Basil Jusin", "Hudson Hornet"],
    details: ""
}]

const List = () => {
  return (
    <div className="d-flex flex-column w-100">
        {testData.map((data, i) => {
            return (
                <div style={{ marginBottom: "20px" }}>
                    <ProjectCard projectName={data.name} team={data.team}/>
                </div>
            )
        })}
    </div>
  )
}

export default List