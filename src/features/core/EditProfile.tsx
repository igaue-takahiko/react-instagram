import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import  Modal from 'react-modal'
import { Button, TextField, IconButton } from '@material-ui/core'
import { MdAddAPhoto } from 'react-icons/md'

import  styles from './Core.module.css'
import { AppDispatch } from '../../app/store'
import { File } from '../types'

import {
    editNickName,
    selectProfile,
    selectOpenProfile,
    resetOpenProfile,
    fetchCredStart,
    fetchCredEnd,
    fetchAsyncUpdateProfile,
} from '../auth/authSlice'

const customStyles = {
    content: {
        top: "55%",
        left: "50%",
        width: 200,
        height: 220,
        padding: "50%",
        transform: "translate(-50%, -50%)",
    }
}

const EditProfile: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const openProfile = useSelector(selectOpenProfile)
    const profile = useSelector(selectProfile)
    const [ image, setImage ] = useState<File | null>(null)

    const updateProfile = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        const packet = { id: profile.id, nickName: profile.nickName, img: image }

        await dispatch(fetchCredStart)
        await dispatch(fetchAsyncUpdateProfile(packet))
        await dispatch(fetchCredEnd())
        await dispatch(resetOpenProfile())
    }

    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput")
        fileInput?.click()
    }

    return (
        <>
            <Modal
                isOpen={openProfile}
                style={customStyles}
                onRequestClose={async () => {
                    await dispatch(resetOpenProfile())
                }}
            >
                <form className={styles.core_signUp}>
                    <h1 className={styles.core_title}>Instagram</h1>
                    <br/>
                    <TextField
                        type="text" placeholder="ニックネーム" value={profile?.nickName}
                        onChange={event => dispatch(editNickName(event.target.value))}
                    />
                    <input
                        type="file" id="imageInput" hidden={true}
                        onChange={event => setImage(event.target.files![0])}
                    />
                    <br/>
                    <IconButton onClick={handlerEditPicture}>
                        <MdAddAPhoto />
                    </IconButton>
                    <br/>
                    <Button
                        type="submit" color="primary" variant="contained"
                        disabled={!profile?.nickName} onClick={updateProfile}
                    >
                        アップデート
                    </Button>
                </form>
            </Modal>
        </>
    )
}

export default EditProfile
