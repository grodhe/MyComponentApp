import { useEffect, useState } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button, Stack, Typography, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    getProjectTasks,
    createProjectTask,
    updateProjectTask,
    deleteProjectTask
} from "../../services/projectTaskService";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";
import ProjectTaskDialog from "../dialogs/ProjectTaskDialog";

const STATUS_COLORS = {
    Open: "default",
    "In Progress": "info",
    Blocked: "error",
    Done: "success"
};

function ProjectTasksTab({ projectId }) {

    const [tasks, setTasks] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [selectedTask, setSelectedTask] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    async function load() {

        try {

            const data = await getProjectTasks(projectId);
            setTasks(data);

        } catch (err) {

            console.error("Failed to load project tasks:", err);

        }

    }

    useEffect(() => {

        load();

    }, [projectId]);

    function handleAdd() {

        setDialogMode("add");
        setSelectedTask(null);
        setDialogOpen(true);

    }

    function handleEdit(task) {

        setSelectedTask(task);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    async function handleSave(task) {

        try {

            if (dialogMode === "edit" && selectedTask) {

                await updateProjectTask(projectId, selectedTask.id, task);

            } else {

                await createProjectTask(projectId, task);

            }

            setDialogOpen(false);
            setSelectedTask(null);

            await load();

        } catch (err) {

            console.error("Failed to save task:", err);
            alert(`Failed to save: ${err.message}`);

        }

    }

    async function handleConfirmDelete() {

        if (!deleteTarget)
            return;

        try {

            await deleteProjectTask(projectId, deleteTarget.id);

            setDeleteTarget(null);

            await load();

        } catch (err) {

            console.error("Failed to delete task:", err);
            alert(`Failed to delete: ${err.message}`);

        }

    }

    const columns = [

        {
            field: "title",
            headerName: "Title",
            flex: 1
        },

        {
            field: "status",
            headerName: "Status",
            width: 130,
            renderCell: (params) => (
                <Chip
                    size="small"
                    label={params.value}
                    color={STATUS_COLORS[params.value] || "default"}
                />
            )
        },

        {
            field: "priority",
            headerName: "Priority",
            width: 110
        },

        {
            field: "due_date",
            headerName: "Due Date",
            width: 130,
            valueFormatter: (value) => value ? String(value).slice(0, 10) : ""
        },

        {
            field: "completed_date",
            headerName: "Completed",
            width: 130,
            valueFormatter: (value) => value ? String(value).slice(0, 10) : ""
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
                    Tasks
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add Task
                </Button>

            </Stack>

            <DataTable
                rows={tasks}
                columns={columns}
            />

            <ProjectTaskDialog
                open={dialogOpen}
                mode={dialogMode}
                task={dialogMode === "edit" ? selectedTask : null}
                onClose={() => setDialogOpen(false)}
                onSave={handleSave}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Task"
                message={
                    deleteTarget
                        ? `Delete "${deleteTarget.title}"?`
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

export default ProjectTasksTab;
