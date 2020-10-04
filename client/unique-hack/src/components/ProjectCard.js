import React from 'react'
import styles from './ProjectCard.module.css'

const ProjectCard = ({ project }) => {
  return (
    <div className={`d-flex ${styles.container} justify-content-between w-100 align-items-center`}>
        <div className="d-flex">
            <img src={project.thumbnail} alt={project.title + "_image"} width="200" height="auto" className={styles.image}/>
            <div className="d-flex flex-column justify-content-between" style={{ marginLeft: "24px" }}>
                <h1>{project.title.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")}</h1>
                <div>
                    <span>Created by:</span>
                    <div className={styles.teamText}>
                        {project.contributors.map((member, i) => {
                            return (
                                <span key={"member" + i} style={{ fontWeight: "500" }}>{member + (i !== project.contributors.length - 1 ? (",") : (""))} </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
        <div style={{ width: "25%" }}>
            {project.similarProjects === undefined || project.similarProjects.length > 0 ? (
                <div>
                    Not Original :(
                </div>
            ):(
                <div>
                    This Project Appears to be Unique!
                </div>
            )}
        </div>
    </div>
  )
}

export default ProjectCard