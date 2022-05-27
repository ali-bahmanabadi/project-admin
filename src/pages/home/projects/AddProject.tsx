import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUsers,
    IUser,
    selectUsersEntities,
    userStatusSelector,
} from '../../../app/usersSlice';
import { CancelRounded, LibraryAddRounded } from '@mui/icons-material';
import { DatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import {
    Button,
    Checkbox,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import AdapterJalali from '@date-io/date-fns-jalali';
import './addProject.scss';
import {
    addNewProject,
    IProject,
    selectProjectById,
    updateProject,
} from '../../../app/projectsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { Box } from '@mui/system';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface IProps {
    pageTitle: String;
}

const AddProject: React.FC<IProps> = ({ pageTitle }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { projectId } = useParams();

    // users store
    const usersStatus = useAppSelector(userStatusSelector());
    const users = useAppSelector(selectUsersEntities);
    const usersId = Object.values(users).map((user: any) => user.id);

    // projects store
    const projectData = useAppSelector(
        (state) => selectProjectById(state, projectId!) as IProject
    );

    // local state
    const [title, setTitle] = React.useState(projectData?.title || '');
    const [projectStart, setProjectStart] = React.useState<Date | string>(
        projectData?.projectStart || new Date()
    );
    const [projectFinish, setProjectFinish] = React.useState<Date | string>(
        projectData?.projectFinish || new Date()
    );
    const [projectWorkersId, setProjectWorkersId] = React.useState<string[]>(
        projectData?.projectWorkersId || []
    );
    const [status, setStatus] = React.useState('idle');

    React.useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchUsers());
        }
    }, [dispatch, usersStatus]);

    const sendNewProjectDataHandler = () => {
        setStatus('pending');
        // edit project
        if (projectId) {
            dispatch(
                updateProject({
                    id: projectId,
                    title,
                    projectStart,
                    projectFinish,
                    projectWorkersId,
                })
            );
        } else {
            // add new project
            dispatch(
                addNewProject({
                    id: nanoid(),
                    title,
                    projectStart,
                    projectFinish,
                    projectWorkersId,
                    projectTasksId: [],
                    projectProgress: 0,
                })
            );
        }

        setStatus('idle');
        navigate('/projects');
    };

    const handleSelectWorker = (
        event: SelectChangeEvent<typeof projectWorkersId>
    ) => {
        // const value = event.target.value;
        const {
            target: { value },
        } = event;
        setProjectWorkersId(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const canSave = () => {
        return [title].every(Boolean) && status === 'idle';
    };

    return (
        <div className="addProject">
            <div className="addProjectTitle">{pageTitle}</div>
            <div>
                <form>
                    <div className="formItemLogin">
                        <label>اسم پروژه: </label>
                        <TextField
                            id="standard-basic"
                            variant="outlined"
                            placeholder="اسم"
                            size="small"
                            className="loginField"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="formItemLogin">
                        <label>تاریخ شروع پروژه: </label>
                        <LocalizationProvider dateAdapter={AdapterJalali}>
                            <DatePicker
                                mask="____/__/__"
                                value={projectStart}
                                onChange={(newValue) =>
                                    setProjectStart(newValue!)
                                }
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
                        <label>تاریخ پایان پروژه: </label>
                        <LocalizationProvider dateAdapter={AdapterJalali}>
                            <DatePicker
                                mask="____/__/__"
                                value={projectFinish}
                                onChange={(newValue) =>
                                    setProjectFinish(newValue!)
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        className="loginField"
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                    <div
                        className="formItemLogin"
                        style={{ overflow: 'hidden' }}
                    >
                        <label>کارمندان پروژه :</label>
                        <Select
                            className="loginField"
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={projectWorkersId}
                            onChange={handleSelectWorker}
                            color="primary"
                            renderValue={(selected) =>
                                selected
                                    .map(
                                        (userId) =>
                                            (users[userId] as any)?.name +
                                            ' ' +
                                            (users[userId] as any)?.lastName
                                    )
                                    .join(' - ')
                            }
                            MenuProps={MenuProps}
                            style={{ overflow: 'hidden' }}
                        >
                            {usersId.map((userId) => (
                                <MenuItem key={userId} value={userId}>
                                    <Checkbox
                                        checked={
                                            projectWorkersId.indexOf(userId) >
                                            -1
                                        }
                                    />
                                    <ListItemText
                                        primary={
                                            (users[userId] as any)?.name +
                                            ' ' +
                                            (users[userId] as any)?.lastName
                                        }
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className="formItemLogin">
                        <Box p={2}>
                            <LoadingButton
                                variant="contained"
                                startIcon={<LibraryAddRounded />}
                                size="large"
                                loadingPosition="start"
                                onClick={sendNewProjectDataHandler}
                                loading={status === 'pending'}
                                disabled={!canSave()}
                            >
                                ذخیره اطلاعات
                            </LoadingButton>
                        </Box>
                        <Button
                            size="large"
                            variant="outlined"
                            startIcon={<CancelRounded />}
                            onClick={() => navigate('/projects')}
                        >
                            انصراف
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProject;
