import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";

interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

export const signInUser = createAsyncThunk<User, FieldValues>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.User.login(data);
      localStorage.setItem("user", JSON.stringify(userDto));
      return userDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const registerUser = createAsyncThunk<User, FieldValues>(
  "account/registerUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.User.register(data);
      localStorage.setItem("user", JSON.stringify(userDto));
      return userDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const userDto = await agent.User.currentUser();
      localStorage.setItem("user", JSON.stringify(userDto));
      return userDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    });
    builder.addMatcher(
      isAnyOf(
        registerUser.fulfilled,
        signInUser.fulfilled,
        fetchCurrentUser.fulfilled
      ),
      (state, action) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(fetchCurrentUser.rejected, registerUser.rejected),
      (_, action) => {
        throw action.payload;
      }
    );
  },
});

export const { signOut, setUser } = accountSlice.actions;
