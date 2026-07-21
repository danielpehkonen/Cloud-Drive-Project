import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { Box, TextField }from '@mui/material';

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
                const response = await  fetch(`api/document/public/${shareToken}`);

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
  return (
    <div>PublicDocument</div>
  )
}
