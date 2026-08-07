import { useEffect, useState } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button, Stack, Typography, Link } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    getProjectRepositories,
    createProjectRepository,
    updateProjectRepository,
    deleteProjectRepository
} from "../../services/projectRepositoryService";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";
import ProjectRepositoryDialog from "../dialogs/ProjectRepositoryDialog";

function ProjectRepositoriesTab({ projectId }) {

    const [repositories, setRepositories] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [selectedRepository, setSelectedRepository] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    async function load() {

        try {

            const data = await getProjectRepositories(projectId);
            setRepositories(data);

        } catch (err) {

            console.error("Failed to load project repositories:", err);

        }

    }

    useEffect(() => {

        load();

    }, [projectId]);

    function handleAdd() {

        setDialogMode("add");
        setSelectedRepository(null);
        setDialogOpen(true);

    }

    function handleEdit(repository) {

        setSelectedRepository(repository);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    async function handleSave(repository) {

        try {

            if (dialogMode === "edit" && selectedRepository) {

                await updateProjectRepository(projectId, selectedRepository.id, repository);

            } else {

                await createProjectRepository(projectId, repository);

            }

            setDialogOpen(false);
            setSelectedRepository(null);

            await load();

        } catch (err) {

            console.error("Failed to save repository:", err);
            alert(`Failed to save: ${err.message}`);

        }

    }

    async function handleConfirmDelete() {

        if (!deleteTarget)
            return;

        try {

            await deleteProjectRepository(projectId, deleteTarget.id);

            setDeleteTarget(null);

            await load();

        } catch (err) {

            console.error("Failed to delete repository:", err);
            alert(`Failed to delete: ${err.message}`);

        }

    }

    const columns = [

        {
            field: "repository_name",
            headerName: "Name",
            flex: 1
        },

        {
            field: "repository_type",
            headerName: "Type",
            width: 140
        },

        {
            field: "repository_url",
            headerName: "URL",
            flex: 1,
            renderCell: (params) => (
                <Link
                    href={params.value}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {params.value}
                </Link>
            )
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
                spacing={3}
                sx={{ mb: 2 }}
            >

                <Typography variant="h6">
                    Repositories
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add Repository
                </Button>

            </Stack>

            <DataTable
                rows={repositories}
                columns={columns}
            />

            <ProjectRepositoryDialog
                open={dialogOpen}
                mode={dialogMode}
                repository={dialogMode === "edit" ? selectedRepository : null}
                onClose={() => setDialogOpen(false)}
                onSave={handleSave}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Repository"
                message={
                    deleteTarget
                        ? `Delete "${deleteTarget.repository_name}"?`
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

export default ProjectRepositoriesTab;
