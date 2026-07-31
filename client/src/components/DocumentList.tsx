import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from "@mui/x-data-grid"
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from "@mui/material/IconButton";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { TextField } from '@mui/material';

interface IDocument {
  _id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  ownerId: {
    _id: string,
    username: string
  }
}

interface IDocumnetRow {
  id: string,
  documentName: string,
  lastEdited: Date,
  createdAt: Date,
  owner: string
}



export const DocumentList = () => {
  const [rows, setRows] = useState<IDocumnetRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("");

  const navigate = useNavigate()

  const deleteDocument = async(documentId: string) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`/api/document/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Document deletion failed");
      }

      setRows((currentRows) => currentRows.filter((row) => row.id !== documentId))

    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  // Define table columns and add delete button
  const columns: GridColDef[] = [
  { field: 'documentName', headerName: 'Document name', flex: 2, minWidth: 180 },
  { field: 'createdAt', headerName: 'Created', flex: 1, minWidth: 150, type: "dateTime" },
  { field: 'lastEdited', headerName: 'Last edited', flex: 1, width: 150, type: "dateTime" },
  {
    field: 'owner',
    headerName: 'Owner',
    type: 'number',
    flex: 1,
    minWidth: 130,
  },
  {
    field: 'delete',
    headerName: '',
    sortable: false,
    width: 100,
    renderCell: (params) => (
      <IconButton
        data-cy="delete-document"
        color='error'
        onClick={(event) => {
          event.stopPropagation();
          deleteDocument(params.row.id)
        }}>
          <DeleteOutlinedIcon />
      </IconButton>
    )
  }
];

const getDocuments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/document/get",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Document fetching failed");
      }

      const documents: IDocument[] = await response.json();

      const documentRows: IDocumnetRow[] = 
        documents.map((document) => ({
          id: document._id,
          documentName: document.title,
          createdAt: new Date(document.createdAt),
          lastEdited: new Date(document.updatedAt),
          owner: document.ownerId.username
        }));
      
      setRows(documentRows)

    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setLoading(false)
    }
  };

useEffect(() => {
  getDocuments();
}, [])

// Search functionality for document list
const filteredRows = rows.filter((row) => 
    row.documentName
      .toLowerCase()
      .includes(search.trim().toLowerCase())
    );

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <TextField
        data-cy="search-document"
        label="Search documents"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        size='small'
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        disableColumnMenu
        disableColumnSelector
        disableColumnResize
        onRowClick={(params) => {
          navigate(`/document/${params.row.id}`);
        }}
        initialState={{ pagination: { paginationModel: {page: 0, pageSize: 10,} } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
