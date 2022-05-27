import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
    fetchProjects,
    projectStatusSelector,
} from '../../../app/projectsSlice';
import Title from '../../../components/HeaderTitle/Title';
import ProjectsTable from '../../../components/datatable/ProjectsTable';
import './projects.scss';

const Projects = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(projectStatusSelector());

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProjects());
        }
    }, [dispatch, status]);

    return (
        <div className="projectsList">
            <Title
                title="پروژه ها"
                titleButton="افزودن پروژه جدید"
                titleButtonHref="/projects/add-project"
            />
            {status === 'loading' && <h1>Loading...</h1>}
            {status === 'success' && <ProjectsTable />}
            {status === 'error' && <h1>پروژه ها دریافت نشد</h1>}
        </div>
    );
};

export default Projects;
