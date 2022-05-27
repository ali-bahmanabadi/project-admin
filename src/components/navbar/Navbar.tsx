import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout, Fullscreen, Diamond } from '@mui/icons-material';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import Dialog from '../dialog/Dialog';
import {
    fetchLogin,
    ILoginData,
    loginDataSelector,
    loginStatusSelector,
} from '../../app/loginSlice';
import {
    fetchUsers,
    IUser,
    selectUserById,
    userStatusSelector,
} from '../../app/usersSlice';
import './navbar.scss';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // login store
    const loginStatus = useAppSelector(loginStatusSelector());
    const loginData: ILoginData = useAppSelector(loginDataSelector());

    // user store
    const usersStatus = useAppSelector(userStatusSelector());
    const userById = useAppSelector((state) =>
        selectUserById(state, loginData.userId ? loginData.userId : '')
    ) as IUser | undefined;

    const [fullScreenStatus, setFullScreenStatus] = React.useState(false);

    React.useEffect(() => {
        if (loginStatus === 'idle') {
            dispatch(fetchLogin());
        }
        if (loginData && usersStatus === 'idle' && loginData.userId != null) {
            dispatch(fetchUsers());
        }
    }, [dispatch, loginData, loginStatus, usersStatus]);

    const handleFullScreen = () => {
        var elem = document.documentElement as any;
        if (fullScreenStatus === false) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen();
            }
        }
        setFullScreenStatus(!fullScreenStatus);
    };

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpenDialog = () => setOpenDialog(true);

    const handleCloseDialog = () => setOpenDialog(false);

    // set username
    let username: string = '';
    if (loginData && loginData.position && loginData.position === 'admin') {
        username =
            loginData.name || loginData.lastName
                ? loginData.name + ' ' + loginData.lastName
                : 'مدیریت';
    } else if (
        loginData &&
        loginData.position &&
        loginData.position === 'user'
    ) {
        username =
            userById && (userById.name || userById.lastName)
                ? userById.name + ' ' + userById.lastName
                : 'کاربر';
    }

    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="title">
                    <Diamond />
                    <span>مدیریت پروژه</span>
                </div>
                <div className="items">
                    <div className="item"></div>
                    <div className="item">
                        {!fullScreenStatus ? (
                            <Fullscreen
                                onClick={handleFullScreen}
                                className="icon"
                            />
                        ) : (
                            <FullscreenExitOutlinedIcon
                                onClick={handleFullScreen}
                                className="icon"
                            />
                        )}
                    </div>

                    <div className="item">
                        <Logout
                            className="icon"
                            onClick={handleClickOpenDialog}
                        />
                        <Dialog
                            open={openDialog}
                            handleClose={handleCloseDialog}
                            handleCloseNavigate={() => navigate('/login')}
                            title="آیا قصد خروج ار برنامه را دارید؟"
                            description="با این کار از برنامه خارج شده و به صفحه ' LOGIN ' هدایت می
                    شوید."
                        />
                    </div>
                    <div className="item">{username}</div>
                    <div className="item">
                        <img
                            src="https://dkstatics-public.digikala.com/digikala-reviews/b40c184030004b42a20e9462b183fbb06cd1364a_1632644979.jpg?x-oss-process=image/quality,q_70"
                            alt=""
                            className="avatar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
