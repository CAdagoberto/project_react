import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import style from './Project.module.css';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import Message from '../layout/Message';
import FormProject from '../projects/FormProject';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';

export default function Project() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();
    const [liquido, setLiquido] = useState('Sem valor até o momento');

    // Recalcula o valor disponível sempre que project ou services mudar
    useEffect(() => {
        if (project) {
            const totalServicesCost = services.reduce((total, service) => total + parseFloat(service.cost), 0);
            const available = parseFloat(project.budget) - totalServicesCost;
            setLiquido(available.toFixed(2)); // Exibir com 2 casas decimais
        }
    }, [project, services]);

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
                    setProject(data);
                    setServices(data.services);
                })
                .catch((err) => console.log(err));
        }, 1000);
    }, [id]);

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    function editProject(updatedProject) {
        setMessage('');

        if (updatedProject.budget < updatedProject.cost) {
            setMessage('O orçamento não pode ser menor do que o custo do projeto!');
            setType('error');
            return false;
        }

        fetch(`http://localhost:5000/projects/${updatedProject.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProject),
        })
            .then((res) => res.json())
            .then((data) => {
                setProject(data);
                setShowProjectForm(false);
                setMessage('Projeto Atualizado!');
                setType('success');
            })
            .catch((err) => console.log(err));
    }

    function createService(newService) {
        setMessage('');

        newService.id = uuidv4();

        const newServiceCost = parseFloat(newService.cost);
        const newCost = parseFloat(project.cost) + newServiceCost;

        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado! Verifique o valor do serviço.');
            setType('error');
            return false;
        }

        const updatedServices = [...services, newService];
        const updatedProject = { ...project, cost: newCost, services: updatedServices };

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProject),
        })
            .then((res) => res.json())
            .then(() => {
                setServices(updatedServices);
                setProject(updatedProject);
                setShowServiceForm(false);
                setMessage('Serviço adicionado com sucesso!');
                setType('success');
            })
            .catch((err) => console.log(err));
    }

    function removeService(id, cost) {
        const updatedServices = services.filter((service) => service.id !== id);
        const updatedCost = parseFloat(project.cost) - parseFloat(cost);
        const updatedProject = { ...project, cost: updatedCost, services: updatedServices };

        fetch(`http://localhost:5000/projects/${updatedProject.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProject),
        })
            .then((res) => res.json())
            .then(() => {
                setServices(updatedServices);
                setProject(updatedProject);
                setMessage('Serviço removido com sucesso!');
                setType('success');
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            {project && project.name ? (
                <div className={style.project_details}>
                    {message && <Message type={type} msg={message} />}
                    <Container customClass="column">
                        <div className={style.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={style.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={style.project_info}>
                                    <p><span>Categoria:</span> {project.category.name}</p>
                                    <p><span>Total de Orçamento:</span> R$ {project.budget}</p>
                                    <p><span>Total de Utilizado:</span> R$ {project.cost}</p>
                                    <p><span>Total Disponível:</span> R$ {liquido}</p>
                                </div>
                            ) : (
                                <FormProject
                                    handleSubmit={editProject}
                                    btnText="Editar Projeto"
                                    projectData={project}
                                />
                            )}
                        </div>
                        <div className={style.details_container}>
                            <h2>Adicionar um Serviço</h2>
                            <button className={style.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
                            </button>
                            {showServiceForm && (
                                <ServiceForm
                                    handleSubmit={createService}
                                    btnText="Adicionar Serviço"
                                    projectData={project}
                                />
                            )}
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="column">
                            {services.length > 0 ? (
                                services.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        desc={service.description}
                                        handleRemove={removeService}
                                    />
                                ))
                            ) : (
                                <p>Não há serviços cadastrados.</p>
                            )}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}
