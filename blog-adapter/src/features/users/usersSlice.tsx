import { createSlice, createAsyncThunk, PayloadAction, createEntityAdapter } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { Status } from "../posts/postsSlice";
import { RootState } from "../../app/store";
import { store } from "../../app/store";

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

type User = {
    id: number | string;
    name: string;
    username: string;
    email: string;
    address: object;
    phone: string;
    website: string;
    company: object;
}

type Users = User[];

type UsersPayload = PayloadAction<Users>;

// ADAPTER
const usersAdapter = createEntityAdapter<User>({
    selectId: (user) => user.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const fetchUsers = createAsyncThunk<Users>('users/fetchUsers', async () => {

    const response = await axios.get(USERS_URL);
    const data: Users = response.data;
    return [...data];
});

const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState(),
    reducers: {},
    extraReducers(builder){
        // Senza funzioni js come il push nell'array, si sta facendo un override totale dell'initialState 
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            usersAdapter.setAll(state, action.payload)
        })
    }
});

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors((state: RootState) => state.users)

export default usersSlice.reducer;