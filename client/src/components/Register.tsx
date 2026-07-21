import { useState } from 'react'
import {Box, Button, TextField} from '@mui/material'


interface ValidationError {
    path: string,
    msg: string
}

export const Register = () => {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchData = async (email: string, username: string, password: string) =>  {
        try {
            const response = await fetch("/api/user/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        username,
                        password
                    })
                }
            )

            //If registeration fails, error message is saved for the user
            if (!response.ok) {
                const data = await response.json();

                const newErrors: Record<string, string> = {}
                //Go through errors in each field
                data.errors.forEach(
                    (error: ValidationError) => {
                        newErrors[error.path] = error.msg
                    }
                );

                setErrors(newErrors);
                return;
                
            }

            const data = await response.json();
            console.log(data);

            window.location.href = "/login"

        } catch (error: any) {
            if (error instanceof Error) {
                console.log(`Error when trying to register: ${error.message}`)
            }
        }
    }
  
  return (
    <div>
        <h2>Register</h2>
        <Box
            component="form"
            sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete='off'
        >
            <TextField 
                required
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
            />
            <TextField 
                required
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={Boolean(errors.username)}
                helperText={errors.username}
            />
            
            <TextField 
                required
                id="password"
                label="Password"
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
            />
            <Button variant="contained" sx={{ width: '25ch', m: 1 }} color="primary" onClick={() => fetchData(email, username, password)}>Register</Button>
            
        </Box>
        
    </div>
  )
}


