import * as React from 'react';
// component
import Title from '../../../components/HeaderTitle/Title';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { CancelRounded, LibraryAddRounded } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// redux
import {
    fetchProjects,
    projectStatusSelector,
    selectAllProjects,
    selectProjects,
} from '../../../app/projectsSlice';
import {
    fetchUsers,
    selectUsersEntities,
    userStatusSelector,
} from '../../../app/usersSlice';
import {
    addNewTask,
    fetchTasks,
    ITask,
    selectTaskById,
    taskStatusSelector,
    updateTask,
} from '../../../app/tasksSlice';
import { nanoid } from '@reduxjs/toolkit';
import {
    fetchLogin,
    loginDataSelector,
    loginStatusSelector,
} from '../../../app/loginSlice';
// css
import './addTask.scss';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

interface IProps {
    pageTitle: string;
}

const AddTask: React.FC<IProps> = ({ pageTitle }) => {
    const dispatch = useAppDispatch();
    const { taskId: taskParamsId } = useParams();
    const navigate = useNavigate();
    const ref = React.useRef<HTMLDivElement>(null);

    // projects store
    const projectsStatus = useAppSelector(projectStatusSelector());
    const allProjects = useAppSelector(selectAllProjects);
    const projectsEntities = useAppSelector(selectProjects);

    // users store
    const usersStatus = useAppSelector(userStatusSelector());
    const usersEntities = useAppSelector(selectUsersEntities);

    // task store
    const taskStatus = useAppSelector(taskStatusSelector());
    const taskForEdit = useAppSelector(
        (state) => selectTaskById(state, taskParamsId!) as ITask
    );

    // login store
    const loginStatus = useAppSelector(loginStatusSelector());
    const loginData = useAppSelector(loginDataSelector());

    // local state
    const [title, setTitle] = React.useState('');
    const [taskCoefficient, setTaskCoefficient] = React.useState('1');
    const [taskProgress, setTaskProgress] = React.useState('0');
    const [projectId, setProjectId] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [taskPerformer, setTaskPerformer] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [projectName, setProjectName] = React.useState('');

    React.useEffect(() => {
        if (taskStatus === 'idle') {
            dispatch(fetchTasks());
        }

        if (taskParamsId && taskStatus === 'success') {
            setTitle(taskForEdit.title || '');
            setTaskCoefficient(taskForEdit.taskCoefficient || '1');
            setTaskProgress(taskForEdit.taskProgress || '0');
            setProjectId(taskForEdit.projectId || '');
            setTaskPerformer(taskForEdit.taskPerformer || '');
            setProjectName(taskForEdit.projectName || '');
            setUserId(taskForEdit.userId || '');
        }
    }, [dispatch, taskParamsId, taskStatus, taskForEdit]);

    let usersForThisProject;
    if (
        projectId &&
        projectsStatus === 'success' &&
        usersStatus === 'success'
    ) {
        const usersForThisProjectIds = (projectsEntities[projectId] as any)
            .projectWorkersId;

        usersForThisProject = usersForThisProjectIds.map(
            (userId: string) => usersEntities[userId]
        );

        // console.log(usersForThisProjectIds);
        // console.log(usersForThisProject);
    }

    // dispatch projects & data & login
    React.useEffect(() => {
        if (projectsStatus === 'idle') {
            dispatch(fetchProjects());
        }
        if (usersStatus === 'idle') {
            dispatch(fetchUsers());
        }
        if (loginStatus === 'idle') {
            dispatch(fetchLogin());
        }
    }, [dispatch, loginStatus, projectsStatus, usersStatus]);

    const sendTaskDataHandler = () => {
        setLoading(true);
        const taskNanoId = nanoid();

        // save edited task
        if (taskParamsId) {
            dispatch(
                updateTask({
                    id: taskParamsId,
                    title,
                    taskCoefficient,
                    taskProgress,
                    projectId,
                    userId,
                    taskPerformer,
                    projectName,
                })
            );
        } else {
            // add new task
            dispatch(
                addNewTask({
                    id: taskNanoId,
                    title,
                    taskCoefficient,
                    taskProgress,
                    projectId,
                    userId,
                    taskPerformer,
                    projectName,
                })
            );
        }
        setLoading(false);
        navigate('/tasks');
    };

    const handleUserId = (e: any) => {
        const id = e.target.value;
        setUserId(id);
        const userFullName =
            (usersEntities[id] as any).name +
            ' ' +
            (usersEntities[id] as any).lastName;
        setTaskPerformer(userFullName);
        console.log(userFullName);
    };

    const handleProjectId = (e: any) => {
        const id = e.target.value;
        setProjectId(id);
        const projectTitle = (projectsEntities[id] as any)?.title;
        setProjectName(projectTitle);
        console.log(projectTitle);
    };

    // validate login 'user' or 'admin'
    let readOnly;
    let selectDisable = false;

    if (loginData && loginData.position && loginData.position === 'user') {
        readOnly = {
            readOnly: true,
        };
        selectDisable = true;
    }

    return (
        <div className="addTask">
            <Title title={pageTitle} />
            <div className="addTaskWrapper">
                <form>
                    <div className="formItemLogin">
                        <label>اسم: </label>
                        <TextField
                            id="standard-basic"
                            variant="outlined"
                            placeholder="اسم"
                            size="small"
                            className="loginField"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            InputProps={readOnly}
                        />
                    </div>
                    <div className="formItemLogin">
                        <label>ضریب: </label>
                        <TextField
                            id="standard-basic"
                            variant="outlined"
                            placeholder="عدد سختی پروزه را وارد کنید"
                            size="small"
                            className="loginField"
                            type="number"
                            value={taskCoefficient}
                            onChange={(e) => setTaskCoefficient(e.target.value)}
                            InputProps={readOnly}
                        />
                    </div>
                    <div className="formItemLogin">
                        <label>درصد پیشرفت: </label>
                        <TextField
                            id="standard-basic"
                            variant="outlined"
                            placeholder="درصد پیشرفت پروژه بین 0 تا 100 را وارد کنید"
                            size="small"
                            className="loginField"
                            type="number"
                            value={taskProgress}
                            onChange={(e) => setTaskProgress(e.target.value)}
                            ref={ref}
                            inputRef={(input) => {
                                if (input != null && selectDisable)
                                    input.focus();
                            }}
                        />
                    </div>
                    <div className="formItemLogin">
                        <label>پروژه مربوطه:</label>
                        <Select
                            className="loginField"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={projectId}
                            onChange={handleProjectId}
                            size="small"
                            disabled={selectDisable}
                        >
                            {allProjects &&
                                projectsStatus === 'success' &&
                                allProjects.map((project: any) => (
                                    <MenuItem
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.title}
                                    </MenuItem>
                                ))}
                        </Select>
                    </div>
                    {projectId && (
                        <div className="formItemLogin">
                            <label>انجام دهنده:</label>
                            <Select
                                className="loginField"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={userId}
                                onChange={handleUserId}
                                size="small"
                                disabled={selectDisable}
                            >
                                {usersForThisProject &&
                                    usersForThisProject.length > 0 &&
                                    usersForThisProject.map((user: any) => (
                                        <MenuItem value={user.id} key={user.id}>
                                            {`${user.name} ${user.lastName}`}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </div>
                    )}
                    <div className="formItemLogin">
                        <Box p={2}>
                            <LoadingButton
                                variant="contained"
                                startIcon={<LibraryAddRounded />}
                                size="large"
                                loadingPosition="start"
                                onClick={sendTaskDataHandler}
                                loading={loading}
                            >
                                ذخیره اطلاعات
                            </LoadingButton>
                        </Box>
                        <Button
                            size="large"
                            variant="outlined"
                            startIcon={<CancelRounded />}
                            onClick={() => navigate('/tasks')}
                        >
                            انصراف
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
