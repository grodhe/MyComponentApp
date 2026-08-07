import { useEffect, useState } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    getProjectComponents,
    createProjectComponent,
    updateProjectComponent,
    deleteProjectComponent
} from "../../services/projectComponentService";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";
import ProjectComponentDialog from "../dialogs/ProjectComponentDialog";

function ProjectComponentsTab({ projectId }) {

    const [entries, setEntries] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [selectedEntry, setSelectedEntry] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    async function load() {

        try {

            const data = await getProjectComponents(projectId);
            setEntries(data);

        } catch (err) {

            console.error("Failed to load project components:", err);

        }

    }

    useEffect(() => {

        load();

    }, [projectId]);

    function handleAdd() {

        setDialogMode("add");
        setSelectedEntry(null);
        setDialogOpen(true);

    }

    function handleEdit(entry) {

        setSelectedEntry(entry);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    async function handleSave(entry) {

        try {

            if (dialogMode === "edit" && selectedEntry) {

                await updateProjectComponent(projectId, selectedEntry.id, entry);

            } else {

                await createProjectComponent(projectId, entry);

            }

            setDialogOpen(false);
            setSelectedEntry(null);

            await load();

        } catch (err) {

            console.error("Failed to save BOM entry:", err);
            alert(`Failed to save: ${err.message}`);

        }

    }

    async function handleConfirmDelete() {

        if (!deleteTarget)
            return;

        try {

            await deleteProjectComponent(projectId, deleteTarget.id);

            setDeleteTarget(null);

            await load();

        } catch (err) {

            console.error("Failed to delete BOM entry:", err);
            alert(`Failed to delete: ${err.message}`);

        }

    }

    const columns = [

        {
            field: "part_number",
            headerName: "Part Number",
            width: 160
        },

        {
            field: "part_name",
            headerName: "Part Name",
            flex: 1
        },

        {
            field: "component_value",
            headerName: "Value",
            width: 100
        },

        {
            field: "quantity",
            headerName: "Qty",
            type: "number",
            width: 90
        },

        {
            field: "reference_designators",
            headerName: "Ref Designators",
            width: 160
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
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >

                <Typography variant="h6">
                    Bill of Materials
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add Component
                </Button>

            </Stack>

            <DataTable
                rows={entries}
                columns={columns}
            />

            <ProjectComponentDialog
                open={dialogOpen}
                mode={dialogMode}
                entry={dialogMode === "edit" ? selectedEntry : null}
                onClose={() => setDialogOpen(false)}
                onSave={handleSave}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Remove Component"
                message={
                    deleteTarget
                        ? `Remove "${deleteTarget.part_number}" from this project's BOM?`
                        : ""
                }
                confirmLabel="Remove"
                confirmColor="error"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

        </Box>

    );

}

export default ProjectComponentsTab;
