import React from 'react'
import styles from './ProjectCard.module.css'

const ProjectCard = ({ projectName, team }) => {
  return (
    <div className={`d-flex ${styles.container} justify-content-between`}>
        <div className="d-flex">
            <img src="project_image.jpg" alt="Project Image" width="200" height="auto" className={styles.image}/>
            <div>
                <h2>{projectName}</h2>
                <div className={styles.teamText}>
                    {team.map((member, i) => {
                        return (
                            <span>{member + (i !== team.length - 1 ? (",") : (""))} </span>
                        )
                    })}
                </div>
            </div>
        </div>
        <div>
            Details Go Here
        </div>
    </div>
  )
}

export default ProjectCard