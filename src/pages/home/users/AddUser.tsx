import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// router
import {
    addNewUser,
    fetchUsers,
    IUser,
    selectUserById,
    updateUser,
    userStatusSelector,
} from '../../../app/usersSlice';
import { nanoid } from '@reduxjs/toolkit';
// mui
import { CancelRounded, LibraryAddRounded } from '@mui/icons-material';
import { DatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import { Box, Button, TextField } from '@mui/material';
import AdapterJalali from '@date-io/date-fns-jalali';
import Title from '../../../components/HeaderTitle/Title';
import './addUser.scss';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { projectStatusSelector } from '../../../app/projectsSlice';

interface IProps {
    title: string;
}

const AddUser: React.FC<IProps> = ({ title }) => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useAppDispatch();

    // projects store
    const statusProject = useAppSelector(projectStatusSelector());

    // users store
    const statusUser = useAppSelector(userStatusSelector());
    const editUser = useAppSelector((state) =>
        selectUserById(state, userId!)
    ) as IUser;

    // local state
    const [name, setName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [kodmelli, setKodmelli] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [birthday, setBirthday] = React.useState(new Date());
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (statusUser === 'idle') {
            dispatch(fetchUsers());
        }
        if (editUser) {
            setName(editUser.name || '');
            setLastName(editUser.lastName || '');
            setKodmelli(editUser.kodmelli || '');
            setPhone(editUser?.phone || '');
            setBirthday(editUser?.birthday!);
        }
    }, [dispatch, editUser, statusProject, statusUser]);

    const sendUserDataHandler = () => {
        setLoading(true);
        if (userId) {
            //  edit user
            dispatch(
                updateUser({
                    id: userId,
                    name,
                    lastName,
                    kodmelli,
                    phone,
                    birthday,
                })
            );
        } else {
            // add new user
            dispatch(
                addNewUser({
                    id: nanoid(),
                    name,
                    lastName,
                    kodmelli,
                    phone,
                    birthday,
                })
            );
        }

        setLoading(false);
        navigate('/users');
    };

    return (
        <div className="addUser">
            <Title title={title} />
            <div>
                <form>
                    <div className="formItemLogin">
                        <label>نام: </label>
                        <TextField
                            id="standard-basic"
                            variant="outlined"
                            placeholder="علی"
                            size="small"
                            className="loginField"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="formItemLogin">
                        <label>نام خانوادگی: </label>
                        <TextField
                            id="standard-basic"
                            variant="outlined"
                            placeholder="بهمن ابادی"
                            size="small"
                            className="loginField"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="formItemLogin">
                        <label>کدملی: </label>
                        <TextField
                            id="standard-basic"
                            variant="outlined"
                            placeholder="002220022"
                            size="small"
                            className="loginField"
                            value={kodmelli}
                            onChange={(e) => setKodmelli(e.target.value)}
                        />
                    </div>
                    <div className="formItemLogin">
                        <label>تاریخ تولد: </label>
                        <LocalizationProvider dateAdapter={AdapterJalali}>
                            <DatePicker
                                mask="____/__/__"
                                value={birthday}
                                onChange={(newValue) => setBirthday(newValue!)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        className="loginField"
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="formItemLogin">
                        <label>شماره تماس: </label>
                        <TextField
                            id="standard-basic"
                            variant="outlined"
                            placeholder="09121112233"
                            size="small"
                            className="loginField"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="formItemLogin">
                        <Box p={2}>
                            <LoadingButton
                                variant="contained"
                                startIcon={<LibraryAddRounded />}
                                size="large"
                                loadingPosition="start"
                                onClick={sendUserDataHandler}
                                loading={loading}
                            >
                                ذخیره اطلاعات
                            </LoadingButton>
                        </Box>
                        <Button
                            size="large"
                            variant="outlined"
                            startIcon={<CancelRounded />}
                            onClick={() => navigate('/users')}
                        >
                            انصراف
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
