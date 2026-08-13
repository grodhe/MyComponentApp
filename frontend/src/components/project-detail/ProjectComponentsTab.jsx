import { useEffect, useState } from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button, Chip, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import {
    getProjectComponents,
    createProjectComponent,
    updateProjectComponent,
    deleteProjectComponent
} from "../../services/projectComponentService";
import { createShoppingListItem } from "../../services/shoppingListService";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";
import ProjectComponentDialog from "../dialogs/ProjectComponentDialog";
import ShoppingListItemDialog from "../dialogs/ShoppingListItemDialog";

function ProjectComponentsTab({ projectId }) {

    const [entries, setEntries] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [selectedEntry, setSelectedEntry] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const [shoppingDialogOpen, setShoppingDialogOpen] = useState(false);
    const [shoppingInitialValues, setShoppingInitialValues] = useState(null);

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

    // Prefills the shopping list dialog with the exact shortfall for this
    // BOM row -- required minus what's currently in stock, never less
    // than 1.
    function handleAddShortfall(row) {

        const shortfall = row.quantity - (row.available_quantity ?? 0);

        setShoppingInitialValues({
            component_id: row.component_id,
            quantity_needed: Math.max(1, shortfall)
        });

        setShoppingDialogOpen(true);

    }

    async function handleSaveShoppingItem(item) {

        try {

            await createShoppingListItem(item);
            setShoppingDialogOpen(false);

        } catch (err) {

            console.error("Failed to add to shopping list:", err);
            alert(`Failed to add to shopping list: ${err.message}`);

        }

    }

    // A row "has enough" when its component's current stock covers the
    // quantity this BOM entry needs. Entries with no linked component
    // (shouldn't normally happen, but the join is LEFT JOIN) are treated
    // as unavailable rather than silently passing.
    function hasEnough(row) {

        return row.available_quantity !== null
            && row.available_quantity !== undefined
            && row.available_quantity >= row.quantity;

    }

    const shortageCount = entries.filter((row) => !hasEnough(row)).length;

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
            headerName: "Required",
            type: "number",
            width: 90
        },

        {
            field: "available_quantity",
            headerName: "Available",
            type: "number",
            width: 100
        },

        {
            field: "status",
            headerName: "Status",
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params) => (

                hasEnough(params.row) ? (

                    <Tooltip title="Enough in stock">
                        <CheckCircleIcon color="success" fontSize="small" />
                    </Tooltip>

                ) : (

                    <Tooltip title={`Short by ${params.row.quantity - (params.row.available_quantity ?? 0)}`}>
                        <CancelIcon color="error" fontSize="small" />
                    </Tooltip>

                )

            )
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
            width: 130,
            getActions: (params) => {

                const actions = [

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

                ];

                if (!hasEnough(params.row) && params.row.component_id) {

                    actions.push(
                        <GridActionsCellItem
                            key="shop"
                            icon={<AddShoppingCartIcon />}
                            label="Add shortfall to shopping list"
                            onClick={() => handleAddShortfall(params.row)}
                        />
                    );

                }

                return actions;

            }
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
                    Bill of Materials
                </Typography>

                {entries.length > 0 && (

                    <Chip
                        size="small"
                        sx={{ ml: 2 }}
                        color={shortageCount === 0 ? "success" : "error"}
                        label={shortageCount === 0 ? "Ready to build" : `${shortageCount} item${shortageCount === 1 ? "" : "s"} short`}
                    />

                )}

                <Box sx={{ flexGrow: 1 }} />

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
                onRowDoubleClick={(params) => handleEdit(params.row)}
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

            <ShoppingListItemDialog

                open={shoppingDialogOpen}

                mode="add"

                initialValues={shoppingInitialValues}

                onClose={() => setShoppingDialogOpen(false)}

                onSave={handleSaveShoppingItem}

            />

        </Box>

    );

}

export default ProjectComponentsTab;
