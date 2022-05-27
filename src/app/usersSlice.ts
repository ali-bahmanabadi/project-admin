import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export interface IUser {
    id: string;
    name?: string;
    lastName?: string;
    kodmelli?: string;
    phone?: string;
    birthday?: Date;
}

export interface IUsersState {
    status: 'idle' | 'loading' | 'success' | 'error';
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const Response = await axios.get('http://localhost:5000/users');
    return Response.data;
});

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId) => {
        await axios.delete(`http://localhost:5000/users/${userId}`);
        return userId;
    }
);

export const addNewUser = createAsyncThunk(
    'users/addNewUser',
    async (data: IUser) => {
        await axios.post('http://localhost:5000/users', data);
        return data;
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (data: IUser) => {
        const { id, ...option } = data;
        await axios.patch(`http://localhost:5000/users/${id}`, option);
        return data;
    }
);

const usersAdapter = createEntityAdapter();

export const {
    selectAll: selectAllUsers,
    selectEntities: selectUsersEntities,
    selectById: selectUserById,
    selectIds: selectUsersIds,
} = usersAdapter.getSelectors<RootState>((state) => state.users);

const initialState = usersAdapter.getInitialState<IUsersState>({
    status: 'idle',
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = 'success';
            usersAdapter.upsertMany(state, action.payload);
        });
        builder.addCase(fetchUsers.rejected, (state) => {
            state.status = 'error';
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            usersAdapter.removeOne(state, action.payload as any);
        });
        builder.addCase(addNewUser.fulfilled, usersAdapter.addOne);
        builder.addCase(updateUser.fulfilled, (state, action) => {
            usersAdapter.updateOne(state, {
                id: action.payload.id,
                changes: action.payload,
            });
        });
    },
});

export const userStatusSelector = () => (state: RootState) =>
    state.users.status;

export default usersSlice.reducer;
