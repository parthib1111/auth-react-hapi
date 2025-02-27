import { Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axiosInstance from "../services/axiosInstance";
import { useDispatch } from "react-redux"
import { Bounce, toast, ToastContainer } from "react-toastify";
import { logout } from "../redux/features/authSlice";
import useAxios from "../services/axiosInstance";


const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosInstance = useAxios();

    // const notify = () => toast.success("Logout successful!!!");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // const token = localStorage.getItem("token");
                // console.log(token);
                // const res = await axios.get("http://localhost:5000/api/auth/dashboard", { headers: { "Authorization": `Bearer ${token}` } });
                const res = await axiosInstance.get("/dashboard");
                // console.log(token);
                // console.log(res.data.user);
                setUser(res.data.user);

                // console.log(user);
            } catch (error) {
                console.error("(React)Unauthorized!!!!", error);
            }
        }
        fetchUser();
    }, []);

    const handleLogout = async (e) => {
        try {
            e.preventDefault();
            // localStorage.removeItem("accessToken");
            // localStorage.removeItem("refreshToken");
            dispatch(logout());
            toast.success('Logout successful!', {
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
            console.error("Logout failed!!", error);
            toast.error('Logout not successful!', {
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
            <Container>
                <Typography variant="h4">Dashboard</Typography>
                {user ? (
                    <>
                        <Typography variant="body1">Welcome, {user.name}!</Typography>
                        <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
                            Logout
                        </Button>
                    </>
                ) : (<Typography variant="h6">Please login first!!!</Typography>)
                }
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

export default Dashboard