import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { Box, TextField, Typography }from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface IPublicDocument {
    title: string,
    content: string
}

export const PublicDocument = () => {
    const { shareToken } = useParams()
    const [document, setDocument] = useState<IPublicDocument | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const getPublicDocument = async () => {
            try {
                const response = await  fetch(`/api/document/public/${shareToken}`);

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || "Document fetching failed");
                }

                setDocument(data);            
            } catch (error: any) {
                if (error instanceof Error) {
                    setError(error.message)
                }
            } finally {
                setLoading(false);
            }
        }

        if (shareToken) {
            getPublicDocument()
        }
    }, [shareToken])

    if (loading) {
        return (
            <Typography>
                Loading...
            </Typography>
        )
    }

    if (error || !document) {
        return (
            <Alert severity="error">
                {error || "Document not found"}
            </Alert>
        )
    }

  return (
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
        <Paper
            elevation={1}
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
        >
            <TextField 
                label="Document title"
                value={document.title}
                slotProps={{input: {readOnly: true}}}
            />

            <Box
                sx={{
                    backgroundColor: "background.paper",
                    "& .ql-editor": {minHeight: 400}
                }}
            >
                <ReactQuill
                    theme="snow"
                    value={document.content}
                    readOnly
                    modules={{toolbar: false}}
                />

            </Box>

        </Paper>

    </Box>
  )
}
