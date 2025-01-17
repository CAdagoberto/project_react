import style from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'
import FormProject from '../projects/FormProject'
import ServiceForm from '../service/ServiceForm'
import {parse, v4 as uuidv4} from 'uuid'

export default function Project() {
    const { id } = useParams()

    const [project, setProject] = useState(null)
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
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
                   setProject(data)
                })
                .catch((err) => console.log(err))
        }, 1000)
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    function editProject(project) {
        setMessage('')


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

    function createService() {
        setMessage('')

        
        const lastService = project.services[project.services.length - 1] 

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
        //maximum value validation
        if(newCost > parseFloat(project.budget)) {
            setMessage('Orçamento Ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then(res => res.json())
        .then(data => {
            //exibir services

            //Mensagem
            setMessage('Serviço Adicionado com sucesso!')
            setType('success')
            console.log(data)
        }).catch(err => {
            console.log(err)
        })
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

                        <div className={style.details_container}>
                               <h2>Adicionar um serviço</h2>
                               <button className={style.btn} onClick={toggleServiceForm}>
                                {!showProjectForm ? 'Adicionar Serviço' : 'Fechar'}
                            </button>
                            <div className={style.project_info}>
                                    {showServiceForm && (
                                        <ServiceForm 
                                            handleSubmit={createService}
                                            btnText='Adicionar serviço'
                                            projectData={project}
                                        />
                                    )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass='start'>
                                    <p>Intens de serviços</p>
                        </Container>
                    </Container>
                </div>
            ): (
                <Loading />
            )}
        </>
    )
}
