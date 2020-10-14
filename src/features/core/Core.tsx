import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    withStyles,
    Button,
    Grid,
    Avatar,
    Badge,
    CircularProgress
} from '@material-ui/core'
import { MdAddAPhoto } from 'react-icons/md'

import { AppDispatch } from '../../app/store'
import Auth from '../auth/Auth'
import styles from './Core.module.css'

import {
    editNickName,
    selectProfile,
    selectIsLoadingAuth,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    setOpenProfile,
    resetOpenProfile,
    fetchAsyncGetMyProfile,
    fetchAsyncGetProfiles,
} from '../auth/authSlice'

import {
    selectPosts,
    selectIsLoadingPost,
    setOpenNewPost,
    resetOpenNewPost,
    fetchAsyncGetPosts,
    fetchAsyncGetComments,
} from '../post/postSlice'

const StylesBadge = withStyles(theme => ({
    badge: {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "$ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
        transform: "scale(.8)",
        opacity: 1,
        },
        "100%": {
        transform: "scale(2.4)",
        opacity: 0,
        },
    },
}))(Badge)

const Core: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const profile = useSelector(selectProfile)
    const posts = useSelector(selectPosts)
    const isLoadingPost = useSelector(selectIsLoadingPost)
    const isLoadingAuth = useSelector(selectIsLoadingAuth)

    useEffect(() => {
        const fetchBootLoader = async () => {
            if (localStorage.localJWT) {
                dispatch(resetOpenSignIn())
                const result = await dispatch(fetchAsyncGetMyProfile())
                if (fetchAsyncGetMyProfile.rejected.match(result)) {
                    dispatch(setOpenSignIn())
                    return null
                }
                await dispatch(fetchAsyncGetPosts())
                await dispatch(fetchAsyncGetProfiles())
                await dispatch(fetchAsyncGetComments())
            }
        }
        fetchBootLoader()
    },[dispatch])

    return (
        <div>
            <Auth />
            <div className={styles.core_header}>
                <h1 className={styles.core_title}>Instagram</h1>
                {profile?.nickName ? (
                    <>
                        <button
                            className={styles.core_btnModal}
                            onClick={() => {
                                dispatch(setOpenNewPost())
                                dispatch(resetOpenProfile())
                            }}
                        >
                            <MdAddAPhoto />
                        </button>
                        <div className={styles.core_logout}>
                            {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
                            <Button
                                onClick={() => {
                                    localStorage.removeItem("localJWT")
                                    dispatch(editNickName(""))
                                    dispatch(resetOpenProfile())
                                    dispatch(resetOpenNewPost())
                                    dispatch(setOpenSignIn())
                                }}
                            >
                                ログアウト
                            </Button>
                            <button
                                className={styles.core_btnModal}
                                onClick={() => {
                                    dispatch(setOpenProfile())
                                    dispatch(resetOpenNewPost())
                                }}
                            >
                                <StylesBadge
                                    overlap="circle"
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    variant="dot"
                                >
                                    <Avatar alt="who?" src={profile.img} />{" "}
                                </StylesBadge>
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <Button
                            onClick={() => {
                                dispatch(setOpenSignIn())
                                dispatch(resetOpenSignUp())
                            }}
                        >
                            ログイン
                        </Button>
                        <Button
                            onClick={() => {
                                dispatch(setOpenSignUp())
                                dispatch(resetOpenSignIn())
                            }}
                        >
                            サインアップ
                        </Button>
                    </div>
                )}
            </div>
            {profile?.nickName && (
                <>
                    <div className={styles.core_posts}>
                        <Grid container spacing={4}>
                            {posts.slice(0).reverse().map(post => (
                                <Grid key={post.id} item xs={12} md={4}>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </>
            )}
        </div>
    )
}

export default Core
