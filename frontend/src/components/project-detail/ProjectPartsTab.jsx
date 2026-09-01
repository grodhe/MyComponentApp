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

import {
    getProjectGenericItems,
    createProjectGenericItem,
    updateProjectGenericItem,
    deleteProjectGenericItem
} from "../../services/projectGenericItemService";

import { createShoppingListItem } from "../../services/shoppingListService";
import { getComponentPhotoUrl } from "../../services/componentService";
import { getGenericItemPhotoUrl } from "../../services/genericItemService";
import { useSettings } from "../../context/SettingsContext";

import DataTable from "../common/DataTable";
import PhotoThumbnail from "../common/PhotoThumbnail";
import ConfirmDialog from "../common/ConfirmDialog";
import PartDialog from "../dialogs/PartDialog";
import ShoppingListItemDialog from "../dialogs/ShoppingListItemDialog";

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
        detail: c.component_value ?? "",
        available_quantity: c.available_quantity
    }));

    const genericRows = genericItems.map((g) => ({
        ...g,
        _partType: "generic",
        id: `generic-${g.id}`,
        _rawId: g.id,
        displayName: g.item_name,
        reference_designators: "",
        detail: g.unit ?? "",
        available_quantity: g.available_quantity
    }));

    return [...componentRows, ...genericRows].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
    );

}

function ProjectPartsTab({ projectId }) {

    const { settings } = useSettings();

    const [components, setComponents] = useState([]);
    const [genericItems, setGenericItems] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [selectedEntry, setSelectedEntry] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const [shoppingDialogOpen, setShoppingDialogOpen] = useState(false);
    const [shoppingInitialValues, setShoppingInitialValues] = useState(null);

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

    // Prefills the shopping list dialog for a short row -- linked to the
    // component when this is a component row (so it stays a live link),
    // or a free-text description when it's a generic item (the shopping
    // list doesn't have a generic-item link, just component_id or text).
    function handleAddShortfall(row) {

        const shortfall = row.quantity - (row.available_quantity ?? 0);

        setShoppingInitialValues(
            row._partType === "component"
                ? {
                    // row._rawId is the project_components *junction* row id;
                    // row.component_id is the actual inventory component's
                    // id, which is what the shopping list needs to link to.
                    component_id: row.component_id,
                    quantity_needed: Math.max(1, shortfall)
                }
                : {
                    description: row.displayName,
                    quantity_needed: Math.max(1, shortfall)
                }
        );

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

    const rows = toRows(components, genericItems);

    // A row "has enough" when the linked component/generic item's current
    // stock covers the quantity this project needs. Rows with no
    // available_quantity at all (shouldn't normally happen -- both joins
    // are LEFT JOINs) are treated as unavailable rather than silently
    // passing.
    function hasEnough(row) {

        return row.available_quantity !== null
            && row.available_quantity !== undefined
            && row.available_quantity >= row.quantity;

    }

    const shortageCount = rows.filter((row) => !hasEnough(row)).length;

    // Rows with no price set (purchase_price null/undefined) are just
    // skipped here rather than treated as $0 -- an unpriced part
    // shouldn't silently make the total look lower/more complete than it
    // actually is.
    const totalCost = rows.reduce((sum, row) => {

        const price = row.purchase_price;

        if (price === null || price === undefined || price === "")
            return sum;

        return sum + row.quantity * Number(price);

    }, 0);

    const hasAnyPricedRow = rows.some((row) =>
        row.purchase_price !== null && row.purchase_price !== undefined && row.purchase_price !== ""
    );

    const columns = [

        {
            field: "photo",
            headerName: "",
            width: 52,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <PhotoThumbnail
                    src={params.row._partType === "component"
                        ? getComponentPhotoUrl(params.row.component_id, params.row.updated_at)
                        : getGenericItemPhotoUrl(params.row.generic_item_id, params.row.updated_at)}
                    alt={params.row.displayName}
                    size={36}
                />
            )
        },

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
            field: "cost",
            headerName: `Cost (${settings.currency_symbol})`,
            width: 110,
            sortable: false,
            filterable: false,
            renderCell: (params) => {

                const price = params.row.purchase_price;

                if (price === null || price === undefined || price === "")
                    return "—";

                return `${(params.row.quantity * Number(price)).toFixed(2)} ${settings.currency_symbol}`;

            }
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

                if (!hasEnough(params.row)) {

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
                    Parts
                </Typography>

                {rows.length > 0 && (

                    <Chip
                        size="small"
                        sx={{ ml: 2 }}
                        color={shortageCount === 0 ? "success" : "error"}
                        label={shortageCount === 0 ? "Ready to build" : `${shortageCount} item${shortageCount === 1 ? "" : "s"} short`}
                    />

                )}

                {hasAnyPricedRow && (

                    <Tooltip
                        title={
                            rows.some((row) => row.purchase_price === null || row.purchase_price === undefined || row.purchase_price === "")
                                ? "Some parts have no price set -- they're excluded from this total"
                                : ""
                        }
                    >
                        <Chip
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                            label={`Total Cost: ${totalCost.toFixed(2)} ${settings.currency_symbol}`}
                        />
                    </Tooltip>

                )}

                <Box sx={{ flexGrow: 1 }} />

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
                onRowDoubleClick={(params) => handleEdit(params.row)}
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

export default ProjectPartsTab;
