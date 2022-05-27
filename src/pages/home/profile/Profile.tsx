import * as React from 'react';
import { EditRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    fetchLogin,
    ILoginData,
    loginDataSelector,
    loginStatusSelector,
} from '../../../app/loginSlice';
import {
    fetchUsers,
    IUser,
    selectUsersEntities,
    userStatusSelector,
} from '../../../app/usersSlice';
import './profile.scss';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const Profile = () => {
    const navigate = useNavigate();

    const location = useLocation();
    let userData: any = location.state as IUser;

    console.log(location);

    const dispatch = useAppDispatch();

    // login store
    const loginStatus = useAppSelector(loginStatusSelector());
    const loginData = useAppSelector(loginDataSelector());

    // users store
    const usersStatus = useAppSelector(userStatusSelector());
    const usersData = useAppSelector(selectUsersEntities);

    React.useEffect(() => {
        if (loginStatus === 'idle') {
            dispatch(fetchLogin());
        }
        if (usersStatus === 'idle') {
            dispatch(fetchUsers());
        }
    }, [dispatch, loginStatus, usersStatus]);

    const handleButtonClick = () => {
        if (userData) {
            navigate(`/users/edit-user/${userData.id}`);
        }
    };

    if (
        userData == null &&
        loginStatus === 'success' &&
        loginData.position === 'admin'
    ) {
        userData = loginData as ILoginData;
    }
    if (
        userData == null &&
        loginStatus === 'success' &&
        loginData.position === 'user'
    ) {
        userData = usersData[loginData.userId as string];
    }

    return (
        <div className="profile">
            <div className="profileWrapper">
                <div className="profileButton">
                    {location.pathname !== '/profile' && (
                        <Button
                            variant="contained"
                            startIcon={<EditRounded />}
                            onClick={handleButtonClick}
                        >
                            ویرایش
                        </Button>
                    )}
                </div>
                <div className="topDetail">
                    <img
                        src="https://cdn01.zoomit.ir/2021/2/apple-car-hyundai-2-copy-1200x800.jpg?w=768"
                        alt=""
                        className="profileImage"
                    />
                    <div>
                        <div className="name">{userData?.name}</div>
                        <div className="lastName">{userData?.lastName}</div>
                    </div>
                </div>
                <div className="otherDetail">
                    <div className="right">
                        <span className="title">کدملی</span>
                        <span className="value">{userData?.kodmelli}</span>
                        <span className="title">تاریخ تولد</span>
                        <span className="value">
                            {new Date(userData?.birthday).toLocaleDateString(
                                'fa-IR'
                            )}
                        </span>
                    </div>
                    <div className="left">
                        <span className="title">شماره تماس</span>
                        <span className="value">{userData?.phone}</span>
                        <span className="title">سمت</span>
                        <span className="value">
                            {location.pathname === '/profile' &&
                            loginData &&
                            loginData.position === 'admin'
                                ? 'مدیریت'
                                : 'کاربر'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
