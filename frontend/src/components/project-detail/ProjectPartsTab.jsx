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

import {
    getProjectGenericItems,
    createProjectGenericItem,
    updateProjectGenericItem,
    deleteProjectGenericItem
} from "../../services/projectGenericItemService";

import DataTable from "../common/DataTable";
import ConfirmDialog from "../common/ConfirmDialog";
import PartDialog from "../dialogs/PartDialog";

// Merges project_components + project_generic_items into one list of rows
// the table can render. Each row is tagged with `_partType` so we know
// which API to call on edit/delete, and gets a prefixed `id` since the two
// source tables both use their own auto-increment ids (a component row #3
// and a generic item row #3 would otherwise collide in the DataGrid).
function toRows(components, genericItems) {

    const componentRows = components.map((c) => ({
        ...c,
        _partType: "component",
        id: `component-${c.id}`,
        _rawId: c.id,
        displayName: `${c.part_number} - ${c.part_name}`,
        detail: c.component_value ?? ""
    }));

    const genericRows = genericItems.map((g) => ({
        ...g,
        _partType: "generic",
        id: `generic-${g.id}`,
        _rawId: g.id,
        displayName: g.item_name,
        reference_designators: "",
        detail: g.unit ?? ""
    }));

    return [...componentRows, ...genericRows].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
    );

}

function ProjectPartsTab({ projectId }) {

    const [components, setComponents] = useState([]);
    const [genericItems, setGenericItems] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [selectedEntry, setSelectedEntry] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    async function load() {

        try {

            const [componentsResult, genericItemsResult] = await Promise.all([
                getProjectComponents(projectId),
                getProjectGenericItems(projectId)
            ]);

            setComponents(componentsResult);
            setGenericItems(genericItemsResult);

        } catch (err) {

            console.error("Failed to load project parts:", err);

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

    function handleEdit(row) {

        setSelectedEntry(row);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    async function handleSave(formData) {

        try {

            if (formData.part_type === "component") {

                const payload = {
                    component_id: formData.component_id,
                    quantity: formData.quantity,
                    reference_designators: formData.reference_designators,
                    notes: formData.notes
                };

                if (dialogMode === "edit" && selectedEntry) {
                    await updateProjectComponent(projectId, selectedEntry._rawId, payload);
                } else {
                    await createProjectComponent(projectId, payload);
                }

            } else {

                const payload = {
                    generic_item_id: formData.generic_item_id,
                    quantity: formData.quantity,
                    notes: formData.notes
                };

                if (dialogMode === "edit" && selectedEntry) {
                    await updateProjectGenericItem(projectId, selectedEntry._rawId, payload);
                } else {
                    await createProjectGenericItem(projectId, payload);
                }

            }

            setDialogOpen(false);
            setSelectedEntry(null);

            await load();

        } catch (err) {

            console.error("Failed to save part:", err);
            alert(`Failed to save: ${err.message}`);

        }

    }

    async function handleConfirmDelete() {

        if (!deleteTarget)
            return;

        try {

            if (deleteTarget._partType === "component") {
                await deleteProjectComponent(projectId, deleteTarget._rawId);
            } else {
                await deleteProjectGenericItem(projectId, deleteTarget._rawId);
            }

            setDeleteTarget(null);

            await load();

        } catch (err) {

            console.error("Failed to delete part:", err);
            alert(`Failed to delete: ${err.message}`);

        }

    }

    const columns = [

        {
            field: "displayName",
            headerName: "Part",
            flex: 1.5
        },

        {
            field: "detail",
            headerName: "Value / Unit",
            width: 110
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

    const rows = toRows(components, genericItems);

    return (

        <Box>

            <Stack
                direction="row"
                alignItems="center"
                spacing={3}
                sx={{ mb: 2 }}
            >

                <Typography variant="h6">
                    Parts
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add Part
                </Button>

            </Stack>

            <DataTable
                rows={rows}
                columns={columns}
            />

            <PartDialog
                open={dialogOpen}
                mode={dialogMode}
                entry={dialogMode === "edit" ? selectedEntry : null}
                onClose={() => setDialogOpen(false)}
                onSave={handleSave}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Remove Part"
                message={
                    deleteTarget
                        ? `Remove "${deleteTarget.displayName}" from this project?`
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

export default ProjectPartsTab;
