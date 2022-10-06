import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Home() {
    let navigate = useNavigate();

    let ValidRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const [userData, setUserData] = React.useState({
        email: "",
        password: ""
    })
    const [userDataError, setUserDataError] = React.useState({})

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value }, setUserDataError(validation(name, value)))
    }


    const validation = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) {
                    return 'email requied'
                } else {
                    if (!userData.email.match(ValidRex)) {
                        return 'enter valid email'
                    }
                    else {
                        return ''
                    }
                }
            case 'password':
                if (!value) {
                    return "please Input password *"
                } else {
                    const uppercaseRegExp = /(?=.*?[A-Z])/;
                    const lowercaseRegExp = /(?=.*?[a-z])/;
                    const digitsRegExp = /(?=.*?[0-9])/;
                    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
                    const minLengthRegExp = /.{8,}/;
                    const passwordLength = userData.password.length;
                    const uppercasePassword = uppercaseRegExp.test(userData.password);
                    const lowercasePassword = lowercaseRegExp.test(userData.password);
                    const digitsPassword = digitsRegExp.test(userData.password);
                    const specialCharPassword = specialCharRegExp.test(userData.password);
                    const minLengthPassword = minLengthRegExp.test(userData.password);
                    if (passwordLength === 0) {
                        return "Password is empty";
                    } else if (!uppercasePassword) {
                        return "At least one Uppercase";
                    } else if (!lowercasePassword) {
                        return "At least one Lowercase";
                    } else if (!digitsPassword) {
                        return "At least one digit";
                    } else if (!specialCharPassword) {
                        return "At least one Special Characters";
                    } else if (!minLengthPassword) {
                        return "At least minumum 8 characters";
                    } else {
                        return "";
                    }
                    // return ""
                }
            default:
                break;
        }
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
            console.log(userData)

            loginUser(userData)
        }

    }
    const loginUser = async (userData) => {
        const res = await axios({
            method: 'POST',
            url: `http://localhost:9090/api/v1/login`,
            data: userData
        })
        if (res.status === 200) {
            toast.success(res.data.message)
            navigate("/dashboard"); 
            localStorage.setItem("auth",JSON.stringify(res.data.userAuth))
            localStorage.setItem('token',JSON.stringify(res?.data?.userAuth?.token))
            setUserData({
                email: "",
                password: ""
            })
        } else {
            toast.error(res.data.message || 'Invalid user Credentials')

        }
        console.log(res)

    }
    return (<>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        {/* <MenuIcon /> */}
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Keep Notes
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>


            <Box
                component="form"
                noValidate
                autoComplete="off"
            >
                <Grid container spacing={3}>
                    <Grid item xs={2} md={2} lg={2}>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} gap={5} sx={{ marginTop: "10px" }}>
                        <TextField sx={{ width: "100%", marginTop: "5px" }}
                            name='email'
                            value={userData.email}
                            onChange={(e) => handleChange(e)}
                            id="standard-basic"
                            label="Email"
                            variant="standard"
                            helperText={userDataError?.email?.length > 0 ? userDataError?.email : null}
                            error={userDataError?.email?.length > 0 ? true : false}
                        />
                        <TextField sx={{ width: "100%", marginTop: "5px" }}
                            name='password'
                            value={userData.password}
                            onChange={(e) => handleChange(e)}
                            id="standard-basic"
                            label="Password"
                            variant="standard"
                            helperText={userDataError?.password?.length > 0 ? userDataError?.password : null}
                            error={userDataError?.password?.length > 0 ? true : false}
                        />
                        <Button sx={{ width: "100%", marginTop: "30px" }} variant="contained" onClick={onSubmit} >Login</Button>

                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                    </Grid>

                </Grid>
            </Box>
        </Box>

    </>)
}

export default Home