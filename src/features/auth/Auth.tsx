import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import  Modal from 'react-modal'
import * as Yup from 'yup'
import { Button, CircularProgress, TextField } from '@material-ui/core';

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
    Modal.setAppElement("#root")
    const openSingIn = useSelector(selectOpenSignIn)
    const openSingUp = useSelector(selectOpenSignUp)
    const isLoadingAuth = useSelector(selectIsLoadingAuth)
    const dispatch: AppDispatch = useDispatch()

    return (
        <div>
            <Modal
                isOpen={openSingUp}
                onRequestClose={async () => {
                    dispatch(resetOpenSignUp)
                }}
            >
                <Formik
                    initialErrors={{ email: "required" }}
                    initialValues={{ email: "", password: "" }}
                    onSubmit={async values => {
                        dispatch(fetchCredStart())
                        const resultReg = await dispatch(fetchAsyncRegister(values))

                        if (fetchAsyncRegister.fulfilled.match(resultReg)) {
                            await dispatch(fetchAsyncLogin(values))
                            await dispatch(fetchAsyncCreateProfile({ nickName: "anonymous" }))

                            await dispatch(fetchAsyncGetProfiles())
                            // await dispatch()
                            // await dispatch()
                            await dispatch(fetchAsyncGetMyProfile())
                        }
                        dispatch(fetchCredEnd())
                        dispatch(resetOpenSignUp())
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                        .email("メールアドレスが間違っています。")
                        .required("メールアドレスは必須です。"),
                        password: Yup.string().required("パスワードが間違っています。").min(4)
                    })}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        errors,
                        touched,
                        isValid,
                    }) =>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.auth_signUp}>
                                    <h1 className={styles.auth_title}>Instagram</h1>
                                    <br/>
                                    <div className={styles.auth_progress}>
                                        {isLoadingAuth && <CircularProgress />}
                                    </div>
                                    <br/>
                                    <TextField
                                        placeholder="email" type="input" name="email"
                                        onChange={handleChange} onBlur={handleBlur} value={values.email}
                                    />
                                    <br/>
                                    {touched.email && errors.email ? (
                                        <div className={styles.auth_error}>{errors.email}</div>
                                    ) : null
                                    }
                                    <TextField
                                        placeholder="password" type="password" name="password"
                                        onChange={handleChange} onBlur={handleBlur} value={values.password}
                                    />
                                    {touched.password && errors.password ? (
                                        <div className={styles.auth_error}>{errors.password}</div>
                                    ) : null
                                    }
                                    <br/>
                                    <br/>
                                    <Button
                                        variant="contained" color="primary"
                                        disabled={!isValid} type="submit"
                                    >
                                        登録する
                                    </Button>
                                    <br/>
                                    <br/>
                                    <span
                                    className={styles.auth_text}
                                    onChange={async () => {
                                        await dispatch(setOpenSignIn())
                                        await dispatch(resetOpenSignUp())
                                    }}
                                    >
                                        アカウントをお持ちの方はこちら
                                    </span>
                                </div>
                            </form>
                        </div>
                    }
                </Formik>
            </Modal>
        </div>
    )
}

export default Auth
