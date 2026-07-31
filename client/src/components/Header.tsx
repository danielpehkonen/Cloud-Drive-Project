import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

interface HeaderProps {
    lightMode: boolean,
    toggleTheme: () => void;
}

export const Header = ({lightMode, toggleTheme}: HeaderProps) => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {return Boolean(localStorage.getItem("token"))})

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username")
        setIsLoggedIn(false);
        navigate("/login")
        
    }
  return (
    <Box sx={{ flexGrow: 1}}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' component={Link} to="/" sx={{flexGrow: 1, color: "inherit", textDecoration: "none"}}>
                        Cloud Drive
                    </Typography>
                    <IconButton color='inherit' onClick={toggleTheme}>
                        {lightMode ? (<DarkModeOutlinedIcon />) : (< LightModeOutlinedIcon />)}
                    </IconButton>
                    {isLoggedIn ? (
                        <Button data-cy="logout" color='inherit' onClick={logout}>
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button component={Link} to="/login" color='inherit'>LOGIN</Button>
                            <Button component={Link} to="/register" color='inherit'>REGISTER</Button>
                        </>
                    )}

                </Toolbar>
            </AppBar>
        </Box>
  )
}
