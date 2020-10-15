import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import  Modal from 'react-modal'
import { Button, TextField, IconButton } from '@material-ui/core'
import { MdAddAPhoto } from 'react-icons/md'

import  styles from './Core.module.css'
import { AppDispatch } from '../../app/store'
import { File } from '../types'

import {
    selectOpenNewPost,
    resetOpenNewPost,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncNewPost,
} from '../post/postSlice'

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

const NewPost: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const openNewPost = useSelector(selectOpenNewPost)

    const [ title, setTitle ] = useState("")
    const [ image, setImage ] = useState<File | null>(null)

    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput")
        fileInput?.click()
    }

    const newPost = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        const packet = { title: title, img: image }
        await dispatch(fetchPostStart())
        await dispatch(fetchAsyncNewPost(packet))
        await dispatch(fetchPostEnd())
        setTitle("")
        setImage(null)
        dispatch(resetOpenNewPost())
    }

    return (
        <>
            <Modal
                style={customStyles}
                isOpen={openNewPost}
                onRequestClose={async () => {
                    await dispatch(resetOpenNewPost())
                }}
            >
                <form className={styles.core_signUp}>
                    <h1 className={styles.core_title}>Instagram</h1>
                    <br/>
                    <TextField
                        type="text" placeholder="Please enter caption"
                        onChange={event => setTitle(event.target.value)}
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
                        disabled={!title || !image} variant="contained"
                        color="primary" onClick={newPost}
                    >
                        登録する
                    </Button>
                </form>
            </Modal>
        </>
    )
}

export default NewPost
