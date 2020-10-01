import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import  Modal from 'react-modal'
import * as Yup from 'yup'
import { TextField } from '@material-ui/core';

import { AppDispatch } from '../../app/store'
import  styles from './Auth.module.css'

import {
    selectIsLoadingAuth,
    selectOpenSignIn,
    selectOpenSignUp,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchCredStart,
    fetchCredEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncCreateProfile,
    fetchAsyncGetMyProfile,
    fetchAsyncGetProfiles,
} from './authSlice'

const customStyles = {
    overlay : {
        backgroundColor: "#777777"
    },
    content: {
        top: "55%",
        left: "50%",
        width: 280,
        height: 350,
        transform: "translate(-50%, -50%)"
    },
}

const Auth: React.FC = () => {
    return (
        <div>
            
        </div>
    )
}

export default Auth
