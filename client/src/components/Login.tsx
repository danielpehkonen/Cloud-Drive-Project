import {useState} from 'react'
import {Box, TextField, Button} from "@mui/material"

interface ValidationError {
    path: string,
    msg: string
}

export const Login = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchData = async (email: string, password: string) =>  {
        try {
            const response = await fetch("/api/user/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )

            //If login fails, error message is saved for the user
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


            if(data.token) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("username", data.username)
                console.log("Login successful");
                window.location.href = "/"
            }

        } catch (error: any) {
            if (error instanceof Error) {
                console.log(`Error when trying to login: ${error.message}`)
            }
        }
    }

  return (
    <div>
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
            <h2>Login</h2>
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
                id="password"
                label="Password"
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
            />
            <Button variant="contained" sx={{ width: '25ch', m: 1 }} color="primary" onClick={() => fetchData(email, password)}>Login</Button>
            
        </Box>
    </div>
  )
}

