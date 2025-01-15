import style from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'
import FormProject from '../projects/FormProject'

export default function Project() {
    const { id } = useParams()

    const [project, setProject] = useState(null)
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    setProject(data)
                })
                .catch((err) => console.log(err))
        }, 1000)
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function editProject(project) {
        if(project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor do que o custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
            .then((res) => res.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                //mensagem
                setMessage('Projeto Atualizado!')
                setType('success')
            })
            .catch((err) => console.log(err))
    }

    return (
        <>
            {project && project.name ? (
                <div  className={style.project_details}>
                    {message && <Message type={type} msg={message} />}
                    <Container customClass='column' >
                        <div  className={style.details_container}>
                            <div>
                                <h1>Projeto: {project.name}</h1>
                            </div>
                            <button className={style.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>
                            <div className={style.project_info}>
                                {!showProjectForm ? (
                                    <div className={style.form}>
                                        <p>
                                            <span>Categoria: </span> {project.category.name}
                                        </p>
                                        <p>
                                            <span>Total de Orçamento: </span> R$ {project.budget}
                                        </p>
                                        <p>
                                            <span>Total de Utilizado: </span> R$ {project.cost}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={style.form}>
                                        <FormProject  handleSubmit={editProject} btnText='Editar Projeto' projectData={project}/>
                                    </div>
                                )}
                            </div>
                        </div>

                    </Container>
                </div>
            ): (
                <Loading />
            )}
        </>
    )
}
