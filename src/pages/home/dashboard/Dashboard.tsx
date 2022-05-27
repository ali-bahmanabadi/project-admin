import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProjects,
    projectStatusSelector,
    selectProjects,
} from '../../../app/projectsSlice';
import {
    fetchTasks,
    selectAllTask,
    taskStatusSelector,
} from '../../../app/tasksSlice';
import {
    fetchUsers,
    selectUsersIds,
    userStatusSelector,
} from '../../../app/usersSlice';
import Widget from '../../../components/widget/Widget';
import Featured from '../../../components/featured/Featured';
import Chart from '../../../components/chart/Chart';
import {
    AssignmentIndRounded,
    PeopleAltRounded,
    TaskAltRounded,
} from '@mui/icons-material';
import './dashboard.scss';
import { useAppSelector } from '../../../app/hooks';

const Dashboard = () => {
    const dispatch = useDispatch();

    // users store
    const usersStatus = useAppSelector(userStatusSelector());
    const usersIds = useAppSelector(selectUsersIds);
    const usersLength = usersIds.length;

    // task store
    const taskStatus = useAppSelector(taskStatusSelector());
    const allTask = useAppSelector(selectAllTask);
    const tasksLength = allTask.length;

    // project store
    const projectStatus = useAppSelector(projectStatusSelector());
    const projectsData = useAppSelector(selectProjects);
    const projectsLength = Object.keys(projectsData).length;

    useEffect(() => {
        if (projectStatus === 'idle') {
            dispatch(fetchProjects());
        }
        if (taskStatus === 'idle') {
            dispatch(fetchTasks());
        }
        if (usersStatus === 'idle') {
            dispatch(fetchUsers());
        }
    }, [dispatch, projectStatus, taskStatus, usersStatus]);

    // data for chart
    // ----------------------------------------------------------
    const projectDataClone = JSON.parse(JSON.stringify(projectsData));

    const chartData: any = {};

    if (projectStatus === 'success' && taskStatus === 'success') {
        for (const key in projectsData) {
            chartData[key] = [];
        }

        allTask.forEach((task) => {
            if (chartData[(task as any).projectId] !== undefined) {
                chartData[(task as any).projectId].push(task);
            }
        });
    }

    // Calculate the percentage of project progress
    // ----------------------------------------------------------

    const finalData: any = {};

    if (projectStatus === 'success' && taskStatus === 'success') {
        for (const key in projectsData) {
            finalData[key] = [];
        }

        allTask.forEach((task) => {
            if (finalData[(task as any).projectId] !== undefined) {
                finalData[(task as any).projectId].push(task);
            }
        });

        for (const key in finalData) {
            if (finalData[key].length > 0) {
                const coefficient: any[] = [];
                const progress: any[] = [];
                finalData[key].forEach((task: any) => {
                    progress.push(+(task.taskProgress * task.taskCoefficient));
                    coefficient.push(+task.taskCoefficient);
                });
                const coefficientTotal = coefficient.reduce((a, b) => a + b, 0);
                const progressTotal = progress.reduce((a, b) => a + b, 0);
                const finalProgress = (
                    progressTotal / coefficientTotal
                )?.toFixed(1);

                projectDataClone[key].projectProgress = finalProgress;
            }
        }
    }

    // =================================================

    const chartRender = [];
    if (chartData) {
        for (const key in chartData) {
            console.log(chartData[key]);
            chartRender.push(
                <div className="charts">
                    <Featured
                        projectName={projectDataClone[key].title}
                        projectUsers={
                            projectDataClone[key].projectWorkersId.length
                        }
                        projectTasks={chartData[key].length}
                        percentage={projectDataClone[key].projectProgress}
                    />
                    <Chart title="وظایف پروژه" data={chartData[key]} />
                </div>
            );
        }
    }

    return (
        <>
            <div className="widgets">
                <Widget
                    title="پروژه ها"
                    number={projectsLength}
                    icon={<TaskAltRounded />}
                />
                <Widget
                    title="کارمندان"
                    number={usersLength}
                    icon={<PeopleAltRounded />}
                />
                <Widget
                    title="وظایف"
                    number={tasksLength}
                    icon={<AssignmentIndRounded />}
                />
            </div>

            {chartRender &&
                chartRender.length > 0 &&
                chartRender.map((chart, index) => (
                    <React.Fragment key={index}>{chart} </React.Fragment>
                ))}
        </>
    );
};

export default Dashboard;
