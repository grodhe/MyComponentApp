import { useEffect, useState } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    getProjectDocuments,
    createProjectDocument,
    updateProjectDocument,
    deleteProjectDocument
} from "../../services/projectDocumentService";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";
import ProjectDocumentDialog from "../dialogs/ProjectDocumentDialog";

function ProjectDocumentsTab({ projectId }) {

    const [documents, setDocuments] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [selectedDocument, setSelectedDocument] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    async function load() {

        try {

            const data = await getProjectDocuments(projectId);
            setDocuments(data);

        } catch (err) {

            console.error("Failed to load project documents:", err);

        }

    }

    useEffect(() => {

        load();

    }, [projectId]);

    function handleAdd() {

        setDialogMode("add");
        setSelectedDocument(null);
        setDialogOpen(true);

    }

    function handleEdit(document) {

        setSelectedDocument(document);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    async function handleSave(document) {

        try {

            if (dialogMode === "edit" && selectedDocument) {

                await updateProjectDocument(projectId, selectedDocument.id, document);

            } else {

                await createProjectDocument(projectId, document);

            }

            setDialogOpen(false);
            setSelectedDocument(null);

            await load();

        } catch (err) {

            console.error("Failed to save document:", err);
            alert(`Failed to save: ${err.message}`);

        }

    }

    async function handleConfirmDelete() {

        if (!deleteTarget)
            return;

        try {

            await deleteProjectDocument(projectId, deleteTarget.id);

            setDeleteTarget(null);

            await load();

        } catch (err) {

            console.error("Failed to delete document:", err);
            alert(`Failed to delete: ${err.message}`);

        }

    }

    const columns = [

        {
            field: "document_name",
            headerName: "Document Name",
            flex: 1
        },

        {
            field: "document_type",
            headerName: "Type",
            width: 140
        },

        {
            field: "file_name",
            headerName: "File",
            width: 180
        },

        {
            field: "notes",
            headerName: "Notes",
            flex: 1
        },

        {
            field: "actions",
            type: "actions",
            width: 90,
            getActions: (params) => [

                <GridActionsCellItem
                    key="edit"
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEdit(params.row)}
                />,

                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => setDeleteTarget(params.row)}
                />

            ]
        }

    ];

    return (

        <Box>

            <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 2 }}
            >

                <Typography variant="h6">
                    Documents
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add Document
                </Button>

            </Stack>

            <DataTable
                rows={documents}
                columns={columns}
                onRowDoubleClick={(params) => handleEdit(params.row)}
            />

            <ProjectDocumentDialog
                open={dialogOpen}
                mode={dialogMode}
                document={dialogMode === "edit" ? selectedDocument : null}
                onClose={() => setDialogOpen(false)}
                onSave={handleSave}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Document"
                message={
                    deleteTarget
                        ? `Delete "${deleteTarget.document_name}"?`
                        : ""
                }
                confirmLabel="Delete"
                confirmColor="error"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

        </Box>

    );

}

export default ProjectDocumentsTab;
