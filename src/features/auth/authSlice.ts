import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import axios from 'axios'
import { PROPS_AUTHEN, PROPS_NICKNAME, PROPS_PROFILE } from '../types'

const apiUrl = process.env.REACT_APP_DEV_API_URL

export const fetchAsyncLogin = createAsyncThunk(
    "auth/post",
    async (authen: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
            headers: {
                "Content-Type":"application/json",
            }
        })
        return res.data
    }
)

export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    async (auth: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiUrl}api/register/`, auth, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        return res.data
    }
)

export const fetchAsyncCreateProfile = createAsyncThunk(
    "profile/post",
    async (nickName: PROPS_NICKNAME) => {
        const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`
            }
        })
        return res.data
    }
)

export const fetchAsyncUpdateProfile = createAsyncThunk(
    "profile/put",
    async (profile: PROPS_PROFILE) => {
        const uploadData = new FormData()
        uploadData.append("nickName", profile.nickName)
        profile.img && uploadData.append("img", profile.img, profile.img.name)

        const res = await axios.put(`${apiUrl}api/profile/${profile.id}/`, uploadData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`
            }
        })
        return res.data
    }
)

export const fetchAsyncGetMyProfile = createAsyncThunk(
    "profile/get",
    async () => {
        const res = await axios.get(`${apiUrl}api/myprofile/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`
            }
        })
        return res.data[0]
    }
)

export const fetchAsyncGetProfiles = createAsyncThunk(
    "profiles/get",
    async () => {
        const res = await axios.get(`${apiUrl}api/profile/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`
            }
        })
        return res.data
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        openSignIn: true,
        openSignUp: false,
        openProfile: false,
        isLoadingAuth: false,
        myProfile: {
            id: 0,
            nickName: "",
            userProfile: 0,
            created_on: "",
            img: "",
        },
        profiles: [
            {
                id: 0,
                nickName: "",
                userProfile: 0,
                created_on: "",
                img: "",
            }
        ]
    },
    reducers: {
        fetchCredStart(state) {
            state.isLoadingAuth = true
        },
        fetchCredEnd(state) {
            state.isLoadingAuth = false
        },
        setOpenSignIn(state) {
            state.openSignIn = true
        },
        resetOpenSignIn(state) {
            state.openSignIn = false
        },

        setOpenSignUp(state) {
            state.openSignUp = true
        },
        resetOpenSignUp(state) {
            state.openSignUp = false
        },
        setOpenProfile(state) {
            state.openProfile = true
        },
        resetOpenProfile(state) {
            state.openProfile = false
        },
        editNickName (state, action) {
            state.myProfile.nickName = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            localStorage.setItem("localJWT", action.payload.access)
        })
        builder.addCase(fetchAsyncCreateProfile.fulfilled, (state, action) => {
            state.myProfile = action.payload
        })
        builder.addCase(fetchAsyncGetMyProfile.fulfilled, (state, action) => {
            state.myProfile = action.payload
        })
        builder.addCase(fetchAsyncGetProfiles.fulfilled, (state, action) => {
            state.profiles = action.payload
        })
        builder.addCase(fetchAsyncUpdateProfile.fulfilled, (state, action) => {
            state.myProfile = action.payload
            state.profiles = state.profiles.map(profile =>
                profile.id === action.payload.id ? action.payload : profile
            )
        })
    }
})

export const {
    fetchCredStart,
    fetchCredEnd,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    setOpenProfile,
    resetOpenProfile,
    editNickName,
} = authSlice.actions

export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth

export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp
export const selectOpenProfile = (state: RootState) => state.auth.openProfile
export const selectProfile = (state: RootState) => state.auth.myProfile
export const selectProfiles = (state: RootState) => state.auth.profiles

export default authSlice.reducer
