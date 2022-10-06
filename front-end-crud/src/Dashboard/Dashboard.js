import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, toolbarClasses } from '@mui/material';
import image from "../Dashboard/nature.jpg"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function Dashboard() {
    const [userData, setUserData] = React.useState({
        title: '',
        message: '',
        image:''
    })
    const [userDataError, setUserDataError] = React.useState({})
    const [cardList, setCardList] = React.useState([])
    const [updateId, setUpdateId] = React.useState("")
    const tokens = localStorage.getItem("token")
    const token = JSON.parse(tokens)

    const validation = (name, value) => {
        switch (name) {
            case 'title':
                if (!value) {
                    return 'enter Title'
                } else {
                    return
                }
            case 'message':
                if (!value) {
                    return 'enter message'
                } else {
                    return
                }

            default:
                break;
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value }, setUserDataError(validation(name, value)))
    }

    const onSubmit = () => {
        let allErrors = {}
        Object.keys(userData).forEach(key => {
            const error = validation(key, userData[key])
            if (error && error.length) {
                allErrors[key] = error
            }
        });
        if (Object.keys(allErrors).length) {
            return setUserDataError(allErrors)
        } else {
            createNotes(userData)
        }
    }
    const createNotes = async (userData) => {

        if (updateId === "") {
            const result = await axios({
                method: 'POST',
                url: 'http://localhost:9090/api/v1/create',
                headers: { "token": `${token}` },
                data: userData
            }).then(result=>{
                if (result?.status) {
                    getListCard()
                    setUserData({
                        title: "", message: "",image:''
                    })
                    toast.success(result?.data?.message)
                }
            })
            .catch(err=>{
                toast.error("image too large")
            })
           
        } else {
            const data = await axios({
                method: 'POST',
                url: `http://localhost:9090/api/v1/edit/${updateId}`,
                data: userData
            })
            if (data?.status) {
                toast(data.data.message)
                setUserData({
                    title: "", message: ""
                })
                getListCard()
            }
        }

    }
    const getListCard = async () => {
        const data = await axios({
            method: 'GET',
            url: "http://localhost:9090/api/v1/listnotes",
            headers: { "token": `${token}` },
        })
        setCardList(data?.data?.data)
    }

    const deleteNote = async (id) => {
        console.log(id)
        const data = await axios({
            method: 'POST',
            url: `http://localhost:9090/api/v1/delete/${id}`,
        })
        if (data?.status) {
            toast(data.data.message)
            getListCard()
        }
    }

    const editNote = async (val, id) => {
        setUpdateId(id)
        setUserData({
            title: val?.title,
            message: val?.message
        })

    }

    const handleImageChange=(e)=>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            setUserData({...userData, image:reader.result})
        }


    }
    useEffect(() => {
        getListCard()

    }, [])
    return (
        <>
            <Grid container>
                <Grid item xs={12} style={{ textAlign: "center", border: '1px solid grey', margin: "10px 21px 10px 21px" }}>
                    <h1>write here</h1>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={2} md={2} lg={2}>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} gap={5} sx={{ marginTop: "10px" }}>
                        <FormControl gap={5} fullWidth sx={{ m: 2, justifyContent: 'center', display: 'flex' }} variant="standard">
                            <TextField
                                label="Title"
                                id="outlined-size-small"
                                size="small"
                                name='title'
                                onChange={(e) => handleChange(e)}
                                value={userData?.title}

                            />
                            <span style={{ color: "red" }}>{userDataError?.title}</span>
                            <br />
                            <TextareaAutosize
                                label="Message"
                                style={{ width: '100%' }}
                                minRows={5}
                                placeholder="Message"
                                value={userData?.message}
                                name='message'
                                onChange={(e) => handleChange(e)}

                            />
                            <span style={{ color: "red" }}>{userDataError?.message}</span>
                            <br />
                            <IconButton  aria-label="upload picture" component="label">
                                <input hidden accept="image/*" type="file" onChange={(e)=>handleImageChange(e)}/>
                                <PhotoCamera />
                            </IconButton>
                            <Button sx={{ width: "100%", marginTop: "30px" }} variant="contained" onClick={onSubmit} >add</Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    </Grid>

                </Grid>
            </Grid>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {
                    cardList?.map((val, index) => (
                        <Grid item xs={12} lg={3} sm={6} md={4} xl={3}>
                            <Card sx={{ width: "100%" }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={val?.image|| image}
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {val.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {val.message}
                                        </Typography>
                                        <Typography sx={{ display: "flex", justifyContent: "end" }}>
                                            <Typography onClick={() => deleteNote(val._id)}>
                                                <DeleteIcon />

                                            </Typography>
                                            <Typography sx={{ marginLeft: "20px" }} onClick={() => editNote(val, val._id)}>
                                                <EditIcon />
                                            </Typography>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>

                    ))
                }

            </Grid>
        </>
    )
}

export default Dashboard;