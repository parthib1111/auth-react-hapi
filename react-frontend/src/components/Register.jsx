import { Button, Container, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import useAxios from "../services/axiosInstance";

import { Bounce, toast, ToastContainer } from "react-toastify";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const axiosInstance = useAxios();

    const handleRegister = async () => {
        try {
            await axiosInstance.post("/register", { name, email, password });
            toast.success('Registration successful!!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1000);
        } catch (error) {
            console.log("Registration failed!!!", error);
            toast.error('Registration not successful!!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }


    }
    return (
        <>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom>Register</Typography>
                <TextField label="Name" fullWidth margin="normal" onChange={(e) => setName(e.target.value)} />
                <TextField label="Email" fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>Register</Button>
                <Typography variant="body2" sx={{ mt: 2, fontSize: '1.2rem' }}>
                    Existing user? Please{" "}
                    <Link to="/login" style={{ color: "blue", textDecoration: "none" }}>login</Link>
                    {" "}first.
                </Typography>
            </Container>
            <ToastContainer />
        </>
    )
}

export default Register