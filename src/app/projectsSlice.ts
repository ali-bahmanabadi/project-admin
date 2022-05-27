import {
    createAsyncThunk,
    createSlice,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export interface IProject {
    id: string;
    title: string;
    projectStart: string | Date;
    projectFinish: string | Date;
    projectWorkersId?: string[];
    projectTasksId?: [];
    projectProgress?: number;
}

export interface ProjectsState {
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
}

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async () => {
        const response = await axios.get('http://localhost:5000/projects');
        return response.data;
    }
);

export const addNewProject = createAsyncThunk(
    'projects/newProjects',
    async (newProjectData: IProject) => {
        await axios.post('http://localhost:5000/projects', newProjectData);
        return newProjectData;
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (projectId) => {
        await axios.delete(`http://localhost:5000/projects/${projectId}`);
        console.log('async thunk: ', projectId);
        return projectId;
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async (data: IProject) => {
        const { id, ...option } = data;
        await axios.patch(`http://localhost:5000/projects/${id}`, option);
        return data;
    }
);

const projectsAdapter = createEntityAdapter();

export const {
    selectById: selectProjectById,
    selectIds: selectProjectIds,
    selectEntities: selectProjects,
    selectAll: selectAllProjects,
} = projectsAdapter.getSelectors<RootState>((state) => state.projects);

const initialState = projectsAdapter.getInitialState<ProjectsState>({
    status: 'idle',
    error: null,
});

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'success';
                projectsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload as string;
            })
            .addCase(addNewProject.fulfilled, projectsAdapter.addOne)
            .addCase(deleteProject.fulfilled, (state, action) => {
                projectsAdapter.removeOne(state, action.payload as any);
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                projectsAdapter.updateOne(state, {
                    id: action.payload.id,
                    changes: action.payload,
                });
            });
    },
});

export const projectStatusSelector = () => (state: RootState) =>
    state.projects.status;

export default projectsSlice.reducer;
