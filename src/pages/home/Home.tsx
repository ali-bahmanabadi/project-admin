import * as React from 'react';
import {
    fetchLogin,
    loginDataSelector,
    loginStatusSelector,
} from '../../app/loginSlice';
// components
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Dashboard from './dashboard/Dashboard';
import AddUser from './users/AddUser';
import AddProject from './projects/AddProject';
import AddTask from './tasks/AddTask';
// router
import { Navigate, Route, Routes } from 'react-router-dom';
//redux
// css
import './home.scss';
import Projects from './projects/Projects';
import Tasks from './tasks/Tasks';
import Users from './users/Users';
import Profile from './profile/Profile';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

const Home = () => {
    const dispatch = useAppDispatch();

    const loginStatus = useAppSelector(loginStatusSelector());
    const loginData = useAppSelector(loginDataSelector());

    React.useEffect(() => {
        if (loginStatus === 'idle') {
            dispatch(fetchLogin());
        }
    }, [dispatch, loginStatus]);

    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="main">
                    <div className="container">
                        <Routes>
                            <Route path="/">
                                <Route
                                    index
                                    element={<Navigate to="/login" replace />}
                                />
                                {loginData &&
                                    loginData.position &&
                                    loginData.position === 'admin' && (
                                        <>
                                            <Route
                                                path="dashboard"
                                                element={<Dashboard />}
                                            />
                                            {/* project page  */}
                                            <Route path="projects">
                                                <Route
                                                    index
                                                    element={<Projects />}
                                                />
                                                <Route
                                                    path="add-project"
                                                    element={
                                                        <AddProject pageTitle="افزورن پروژه جدید" />
                                                    }
                                                />
                                                <Route
                                                    path="edit-project/:projectId"
                                                    element={
                                                        <AddProject pageTitle="ویرایش پروژه" />
                                                    }
                                                />
                                            </Route>
                                            {/* user page  */}
                                            <Route path="users">
                                                <Route
                                                    index
                                                    element={<Users />}
                                                />
                                                <Route
                                                    path="add-user"
                                                    element={
                                                        <AddUser title="افزودن کاربر جدید" />
                                                    }
                                                />
                                                <Route
                                                    path=":userId"
                                                    element={<Profile />}
                                                />
                                                <Route
                                                    path="edit-user/:userId"
                                                    element={
                                                        <AddUser title="ویرایش اطلاعات کاربر" />
                                                    }
                                                />
                                            </Route>
                                        </>
                                    )}
                                {/* task page  */}
                                <Route path="tasks">
                                    <Route index element={<Tasks />} />
                                    {loginData &&
                                        loginData.position &&
                                        loginData.position === 'admin' && (
                                            <Route
                                                path="add-task"
                                                element={
                                                    <AddTask pageTitle="افزودن وظیفه جدید" />
                                                }
                                            />
                                        )}

                                    <Route
                                        path="edit-task/:taskId"
                                        element={
                                            <AddTask pageTitle="ویرایش وظیفه" />
                                        }
                                    />
                                </Route>

                                {/* profile page  */}
                                <Route path="profile">
                                    <Route index element={<Profile />} />
                                    <Route
                                        path="edit-profile"
                                        element={
                                            <AddUser title="ویرایش اطلاعات کاربر" />
                                        }
                                    />
                                </Route>
                            </Route>
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
