
import { Box }from '@mui/material';
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useId, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useParams } from 'react-router-dom';

interface Notification {
    open: boolean,
    message: string,
    severity: "success" | "error" | "info"
}

interface IDocument {
    _id: string,
    title: string,
    content: string
}


export const DocumentEditor = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const  {documentId} = useParams();

    const [notification, setNotification] = useState<Notification>({
        open: false,
        message: "",
        severity: "success"
    })

    // Dialog useStates
    const [editorEmail, setEditorEmail] = useState<string>("");
    const [editorDialogOpen, setEditorDialogOpen] = useState<boolean>(false)
    const [editorError, setEditorError] = useState<string>("");
    const [addingEditor, setAddingEditor] = useState<boolean>(false)

    


    const fileId = useId();


    const fileButtonId = `${fileId}-button`;
    const fileMenuId = `${fileId}-menu`;


    const [fileAnchor, setFileAnchor] = useState<null | HTMLElement>(null);


    const fileOpen = Boolean(fileAnchor);
 

    const openFileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setFileAnchor(event.currentTarget)
    };

    const closeFileMenu = () => {
        setFileAnchor(null)
    }

    useEffect(() => {
        const getDocument = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`/api/document/${documentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Fetching document failed");
                }

                const document: IDocument = await response.json();
                setTitle(document.title);
                setContent(document.content);
            } catch (error: any) {
                if (error instanceof Error) {
                    console.log(error)
                }
            }
        }

        if (documentId) {
            getDocument();
        }
    }, [documentId])

    const saveDocument = async () => {
        try {
            setAddingEditor(true);
            setEditorError("");

            const token = localStorage.getItem("token");

            const response = await fetch(`/api/document/${documentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        content
                    })
                }
            )

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message
                );
            }

            console.log("Document saved successfully")

            setNotification({
                open: true,
                message: "Document saved successfully",
                severity: "success"
            })
            } catch (error: any) {
                if (error instanceof Error) {
                    console.log(error)
                }
            }
    }

    const addEditor = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`/api/document/${documentId}/editors`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({email: editorEmail})
                }
            )

            const data = await response.json();

            if (!response.ok) {
                setEditorError(data.message)
                return
            }

            setEditorEmail("");
            setEditorDialogOpen(false);
        } catch (error: any) {
            setEditorError("Editor failed to be added")
        } finally {
            setAddingEditor(false)
        }
    }

    const createPublicLink = async () =>  {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/document/${documentId}/public-share`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            const publicLink = `${window.location.origin}/shared/${data.shareToken}`

            await navigator.clipboard.writeText(publicLink)

            setNotification({
                open: true,
                message: "Public link copied to clipboard",
                severity: "success"
            })
        } catch (error: any) {
            if (error instanceof Error) {
                    console.log(error)
                }
        }
    }

  return (
    <Box>
        {/*Button row*/}
        <Paper
            elevation={1}
            sx={{
                width: "100%",
                px: 2,
                py: 1

            }}
        >
            <Box
                sx={{
                    width: "100%",
                    mx: "auto",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1
                }}
            >
                <Button
                    id={fileButtonId}
                    aria-controls={fileOpen ? fileMenuId : undefined}
                    aria-haspopup="true"
                    aria-expanded={fileOpen}
                    onClick={openFileMenu}
                    variant='outlined'
                    color='inherit'
                >
                    File
                </Button>

                <Menu
                    id={fileMenuId}
                    anchorEl={fileAnchor}
                    open={fileOpen}
                    onClose={closeFileMenu}
                    slotProps={{
                        list: {
                            'aria-labelledby': fileButtonId
                        }
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            saveDocument()
                            closeFileMenu()
                        }}
                    >
                        Save
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            closeFileMenu()
                        }}
                    >
                        Export PDF
                    </MenuItem>

                </Menu>

                <Button
                    variant='outlined'
                    color='inherit'
                    onClick={() => {
                        setEditorError("");
                        setEditorDialogOpen(true)
                    }}
                >
                    Add editor
                </Button>

                <Button
                    variant='outlined'
                    color='inherit'
                    sx={{
                        ml: "auto"
                    }}
                    onClick={() => {
                        createPublicLink()
                    }}
                >
                    SHARE
                </Button>


            </Box>
        </Paper>
        {/* Text editor zone*/}
        <Box
            sx={{
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                px: 2,
                py: 4,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
        >
            <TextField
                label="Document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <Box
                sx={{
                    backgroundColor: "background.paper"
                }}
            >
                <ReactQuill theme="snow" value={content} onChange={setContent} />
            </Box>
    
        </Box>

        {/* Add editor dialog */}
        <Dialog
            open={editorDialogOpen}
            onClose={() => {
                setEditorDialogOpen(false);
                setEditorError("");
            }}
            fullWidth
            maxWidth="sm"
            >
                <DialogTitle>
                    Add editor
                </DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        type='email'
                        label='User email'
                        value={editorEmail}
                        onChange={(e) => {
                            setEditorEmail(e.target.value)
                            setEditorError("")
                        }}
                        error={Boolean(editorError)}
                        helperText={
                            editorError || "Enter an existing user's email"
                        }
                        sx={{ mt: 1}}
                    >

                    </TextField>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setEditorDialogOpen(false);
                            setEditorError("");
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant='contained'
                        onClick={addEditor}
                    >
                        Add editor
                    </Button>
                </DialogActions>

        </Dialog>

        <Snackbar
            open={notification.open}
            autoHideDuration={3000}
            onClose={() => setNotification((current) => ({...current, open: false}))}
            anchorOrigin={{vertical: "bottom", horizontal: "left"}}
        >
            <Alert
                severity={notification.severity}
                variant='filled'
                onClose={() => setNotification((current) => ({...current, open: false}))}
            >
                {notification.message}
            </Alert>

        </Snackbar>
            
    </Box>
  )
}
