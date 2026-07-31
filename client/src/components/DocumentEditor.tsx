
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
import { pdf } from '@react-pdf/renderer';
import { Pdf } from './Pdf';

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
    const [canEdit, setCanEdit] = useState<boolean>(false);

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

    // Get document contents
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

    // Lock the document or if already locked by another user stay in view mode
    useEffect(() => {
        if (!documentId) {
            return;
        }

        const token = localStorage.getItem("token");

        const getLock = async () => {
            try {

                const response = await fetch(`/api/document/${documentId}/lock`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if(response.ok) {
                    setCanEdit(true);
                } else if (response.status === 423) {
                    setCanEdit(false);
                }
            } catch (error: any) {
                if (error instanceof Error) {
                    console.log(error)
                }
            }
        }

        const releaseLock = async () => {
            fetch(`/api/document/${documentId}/lock`,
                {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        // Let the request finish after closing page
                        keepalive: true
                }
            ).catch((error) => {
                console.log(error)
            });
        }

        getLock();

        // Renew lock every 30 seconds
        const lockInterval = setInterval(getLock, 30_000);

        // Release lock after closing page
        window.addEventListener("pagehide", releaseLock)

        
        return () => {
            // Stop renewing lock when document is closed (backup for unexpected errors)
            clearInterval(lockInterval);

            // Remove page event listener
            window.removeEventListener("pagehide", releaseLock);

            releaseLock();
        }
}, [documentId])

    const saveDocument = async () => {
        // No saving when document is locked by another user
        if(!canEdit) {
            return;
        }

        try {
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

            // Create share link
            const publicLink = `${window.location.origin}/shared/${data.shareToken}`

            // Copy automatically to clipboard
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

    // Export document to pdf
    const exportPdf = async () => {
        try {
            const blob = await pdf(<Pdf content={content} />).toBlob();

            const url = URL.createObjectURL(blob);

            const link = window.document.createElement("a");
            
            link.href = url;
            link.download = `${title.trim() || "Document"}.pdf`;

            link.click();

            URL.revokeObjectURL(url)
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
                    data-cy="file-menu"
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
                        data-cy="save-document"
                        onClick={() => {
                            saveDocument()
                            closeFileMenu()
                        }}
                    >
                        Save
                    </MenuItem>

                    <MenuItem
                        data-cy="export-pdf"
                        onClick={() => {
                            exportPdf()
                            closeFileMenu()
                        }}
                    >
                        Export PDF
                    </MenuItem>

                </Menu>

                <Button
                    data-cy="add-editor"
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
                    data-cy="create-public-link"
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
                data-cy="document-title"
                label="Document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                slotProps={{
                    input: {
                        readOnly: !canEdit
                    }
                }}
            />

            <Box
                data-cy="document-content"
                sx={{
                    backgroundColor: "background.paper"
                }}
            >
                <ReactQuill theme="snow" value={content} onChange={setContent} readOnly={!canEdit}/>
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
                        data-cy="editor-email"
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
                        data-cy="cancel-add-editor"
                        onClick={() => {
                            setEditorDialogOpen(false);
                            setEditorError("");
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        data-cy="confirm-add-editor"
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
                data-cy="notification"
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
