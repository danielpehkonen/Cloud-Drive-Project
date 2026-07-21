import {useState} from "react"
import {Box, Button, Tab, Tabs, Typography} from "@mui/material"
import { DocumentList } from "./DocumentList"
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [tab, setTab] = useState<number>(0);
  const username = localStorage.getItem("username")

  const navigate = useNavigate();

  const createDocument = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/document/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error ("Document creation failed");
      }

      const data = await response.json();
      navigate(`/document/${data.documentId}`);
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  return (
    <Box 
    sx={{
      width: "100%",
      maxWidth: 1200,
      boxSizing: "border-box",
      mx: "auto",
      px: {
        xs: 2,
        sm: 3
      },
      py: 4
    }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{mb: 3}}>
          {username ? `Welcome, ${username}` : "Welcome, login to start"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row"
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center"
          },
          gap: 2,
          borderBottom: 1,
          borderColor: "divider"
        }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
          >
            <Tab label="My Documents" />
            <Tab label="Trash" />
          </Tabs>

          <Button
            variant="contained"
            sx={{
              ml: {
                xs: 0,
                sm: "auto"
              },
              mb: {
                xs: 2,
                sm: 1
              }
            }}
            onClick={createDocument}
            >
            Create document
          </Button>

      </Box>

      <Box sx={{mt: 2}}>
        {tab === 0 && <DocumentList />}

        {tab === 1 && (
          <Typography>
            Trashed documents appear here
          </Typography>
        )}
      </Box>
      
    </Box>
  )
}

