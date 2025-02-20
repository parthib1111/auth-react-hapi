import { Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../services/axiosInstance';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // const notify = () => toast.success("Login successful!!!");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // const res = await axios.post("http://localhost:5000/login", { email, password });
            const res = await axiosInstance.post("/login", { email, password });
            console.log(res);
            console.log(res.data.tokens.accessToken);
            console.log(res.data.tokens.refreshToken);
            localStorage.setItem("accessToken", res.data.tokens.accessToken);
            localStorage.setItem("refreshToken", res.data.tokens.refreshToken);
            toast.success('Login successful!', {
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
                navigate("/dashboard", { replace: true });
            }, 1000);
        } catch (error) {
            toast.error('Login failed!', {
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
            console.log("Login failed client side!!!", error);
        }

    }
    return (
        <>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom>Login</Typography>
                <TextField label="Email" fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
                <Typography variant="body2" sx={{ mt: 2, fontSize: '1.2rem' }}>
                    New user? Please{" "}
                    <Link to="/register" style={{ color: "blue", textDecoration: "none" }}>register</Link>
                    {" "}first.
                </Typography>
            </Container>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    )
}

export default Login