import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';
import projectsSlice from './projectsSlice';
import tasksSlice from './tasksSlice';
import usersSlice from './usersSlice';

const store = configureStore({
    reducer: {
        projects: projectsSlice,
        users: usersSlice,
        tasks: tasksSlice,
        login: loginSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export default store;
