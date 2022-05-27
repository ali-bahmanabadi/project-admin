import * as React from 'react';
import Title from '../../../components/HeaderTitle/Title';
import TasksTable from '../../../components/datatable/TasksTable';
import {
    fetchLogin,
    loginDataSelector,
    loginStatusSelector,
} from '../../../app/loginSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import './tasks.scss';

const Tasks = () => {
    const dispatch = useAppDispatch();

    const loginStatus = useAppSelector(loginStatusSelector());
    const loginData = useAppSelector(loginDataSelector());

    React.useEffect(() => {
        if (loginStatus === 'idle') {
            dispatch(fetchLogin());
        }
    }, [dispatch, loginStatus]);

    let button = <Title title="وظایف" />;
    if (loginData && loginData.position && loginData.position === 'admin') {
        button = (
            <Title
                title="وظایف"
                titleButton="افزودن وظیفه جدید"
                titleButtonHref="/tasks/add-task"
            />
        );
    }

    return (
        <div className="tasksList">
            {button}
            <TasksTable />
        </div>
    );
};

export default Tasks;
