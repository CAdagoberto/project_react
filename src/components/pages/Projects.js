import { useLocation } from "react-router-dom";
import Message from "../layout/Message";
import Container from '../layout/Container'
import Loading from "../layout/Loading";
import LinkButton from '../layout/LinkButton'
import style from './Projects.module.css'
import ProjectCards from "../projects/ProjectCards";
import { useState, useEffect } from "react";


export default function Projects() {

    const [project, setProject] = useState([])
    const location = useLocation()
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectRemove, setProjectRemove] = useState('')
    let mensagem = ''

    if(location.state) {
        mensagem = location.state.message
    }

    useEffect(() => {
        setTimeout(() => {
            fetch('http://localhost:5000/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(resp => resp.json())
            .then(data => {
                setProject(data)
                setRemoveLoading(true)
            }).catch(err => {
                console.log(err)
            })
        }, 1000)
    }, [])

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
        .then(data => {
            setProject(project.filter((project) => project.id !== id))
            setProjectRemove('O projeto Foi apagado')
        })
        .catch(err => {
            console.log(err)
        })
    }


    
    return (
        <div className={style.project_container}>
            <div className={style.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to='/newproject' text='Criar Projeto' />
            </div>
                {mensagem &&  <Message msg={mensagem} type='success'/>}
                {projectRemove &&  <Message msg={projectRemove} type='success'/>}
                <Container customClass='start'>
                        {project.length > 0 && 
                            project.map((pro) => ( 
                                <ProjectCards 
                                name={pro.name}
                                id={pro.id}
                                budget={pro.budget}
                                category={pro.category.name}
                                key={pro.id}
                                handleRemove={removeProject}
                                />
                            ))
                        }
                        {!removeLoading && <Loading />}
                        {removeLoading && project.length === 0 && (
                            <p>Não há projetos cadastrados</p>
                        )}
                </Container>
        </div>
    )
}