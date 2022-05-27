import {
    createAsyncThunk,
    createSlice,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    return response.data;
});

export const addNewTask = createAsyncThunk(
    'tasks/addNewTask',
    async (taskData: ITask) => {
        await axios.post('http://localhost:5000/tasks', taskData);
        return taskData;
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId) => {
        await axios.delete(`http://localhost:5000/tasks/${taskId}`);
        return taskId;
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (data: ITask) => {
        const { id, ...option } = data;
        await axios.patch(`http://localhost:5000/tasks/${id}`, option);
        return data;
    }
);

const tasksAdapter = createEntityAdapter();

export const {
    selectById: selectTaskById,
    selectIds: selectTaskIds,
    selectEntities: selectTasks,
    selectAll: selectAllTask,
} = tasksAdapter.getSelectors<RootState>((state) => state.tasks);

export interface ITaskState {
    status: 'idle' | 'loading' | 'success' | 'error';
}

export interface ITask {
    id: string;
    title: string;
    taskCoefficient: string;
    taskProgress: string;
    projectId: string;
    userId: string;
    taskPerformer: string;
    projectName: string;
}

const initialState = tasksAdapter.getInitialState<ITaskState>({
    status: 'idle',
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                tasksAdapter.upsertMany(state, action.payload);
                state.status = 'success';
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'error';
                console.log(action.payload);
            })
            .addCase(addNewTask.fulfilled, tasksAdapter.addOne)
            .addCase(deleteTask.fulfilled, (state, action) => {
                tasksAdapter.removeOne(state, action.payload as any);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                tasksAdapter.updateOne(state, {
                    id: action.payload.id,
                    changes: action.payload,
                });
            });
    },
});

export const taskStatusSelector = () => (state: RootState) =>
    state.tasks.status;

export default tasksSlice.reducer;
