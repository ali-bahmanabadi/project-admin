import { useEffect } from 'react';
import Title from '../../../components/HeaderTitle/Title';
import UsersTable from '../../../components/datatable/UsersTable';
import { fetchUsers, userStatusSelector } from '../../../app/usersSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import './users.scss';

const Users = () => {
    const dispatch = useAppDispatch();
    const usersStatus = useAppSelector(userStatusSelector());

    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchUsers());
        }
    }, [dispatch, usersStatus]);
    return (
        <div className="usersList">
            <Title
                title="کارمندان"
                titleButton="افزودن کارمند جدید"
                titleButtonHref="/users/add-user"
            />
            <UsersTable />
        </div>
    );
};

export default Users;
