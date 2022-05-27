import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export const fetchLogin = createAsyncThunk('login/fetchLogin', async () => {
    const response = await axios.get('http://localhost:5000/login');
    return response.data;
});

export const setStatus = createAsyncThunk(
    'login/setStatus',
    async (data: ILoginData) => {
        // const { status, userId } = data
        await axios.patch('http://localhost:5000/login', data);
        return data;
    }
);

export interface ILoginData {
    position?: string;
    userId?: string;
    name?: string;
    lastName?: string;
    kodmelli?: string;
    phone?: string;
    birthday?: string | Date;
}

export interface ILoginState {
    status: 'idle' | 'loading' | 'success' | 'error';
    data: ILoginData;
}

const initialState: ILoginState = {
    status: 'idle',
    data: {},
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.status = 'success';
                state.data = action.payload;
            })
            .addCase(fetchLogin.rejected, (state) => {
                state.status = 'error';
            })
            .addCase(setStatus.fulfilled, (state, action) => {
                Object.assign(state.data, action.payload);
            });
    },
});

export const loginStatusSelector = () => (state: RootState) =>
    state.login.status;

export const loginDataSelector = () => (state: RootState) => state.login.data;

export default loginSlice.reducer;
