import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import {
    getShoppingListItems,
    createShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem
} from "../services/shoppingListService";

import DataTable from "../components/common/DataTable";
import PhotoThumbnail from "../components/common/PhotoThumbnail";
import { getComponentPhotoUrl } from "../services/componentService";
import { getGenericItemPhotoUrl } from "../services/genericItemService";
import CrudToolbar from "../components/common/CrudToolbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ShoppingListItemDialog from "../components/dialogs/ShoppingListItemDialog";

function itemLabel(row) {

    if (row.component_id) {
        return row.part_name ? `${row.part_number} — ${row.part_name}` : row.part_number;
    }

    if (row.generic_item_id && row.generic_item_name) {
        return row.generic_item_name;
    }

    return row.description;

}

function ShoppingListPage() {

    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function loadItems() {

        try {

            const data = await getShoppingListItems();
            setItems(data);

        } catch (err) {

            console.error("Failed to load shopping list:", err);

        }

    }

    useEffect(() => {

        loadItems();

    }, []);

    function handleAdd() {

        setDialogMode("add");
        setSelectedItem(null);
        setDialogOpen(true);

    }

    function handleEdit(item) {

        if (!item)
            return;

        setSelectedItem(item);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    function handleClose() {

        setDialogOpen(false);

    }

    async function handleSave(item) {

        try {

            if (dialogMode === "edit" && selectedItem) {

                await updateShoppingListItem(selectedItem.id, item);

            } else {

                await createShoppingListItem(item);

            }

            setDialogOpen(false);
            setSelectedItem(null);

            await loadItems();

        } catch (err) {

            console.error("Failed to save shopping list item:", err);
            alert(`Failed to save: ${err.message}`);

        }

    }

    function handleDelete(item) {

        if (!item)
            return;

        setSelectedItem(item);
        setDeleteDialogOpen(true);

    }

    async function handleConfirmDelete() {

        if (!selectedItem)
            return;

        try {

            await deleteShoppingListItem(selectedItem.id);

            setDeleteDialogOpen(false);
            setSelectedItem(null);

            await loadItems();

        } catch (err) {

            console.error("Failed to delete shopping list item:", err);
            alert(`Failed to delete: ${err.message}`);

        }

    }

    function handleCancelDelete() {

        setDeleteDialogOpen(false);

    }

    const columns = [

        // Only items linked to a component have a photo; free-text items
        // show the placeholder.
        {
            field: "photo",
            headerName: "",
            width: 92,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <PhotoThumbnail
                    src={params.row.component_id
                        ? getComponentPhotoUrl(params.row.component_id, params.row.component_updated_at)
                        : params.row.generic_item_id
                            ? getGenericItemPhotoUrl(params.row.generic_item_id, params.row.generic_item_updated_at)
                            : null}
                    alt={itemLabel(params.row)}
                    size={60}
                    fit="contain"
                    frame={false}
                />
            )
        },

        {
            field: "item",
            headerName: "Item",
            flex: 2,
            valueGetter: (value, row) => itemLabel(row),
            renderCell: (params) => (
                <Box sx={{ fontWeight: 600 }}>{params.value}</Box>
            )
        },

        {
            field: "quantity_needed",
            headerName: "Qty Needed",
            type: "number",
            width: 120
        },

        {
            field: "notes",
            hideOnMobile: true,
            headerName: "Notes",
            flex: 2
        },

        {
            field: "created_at",
            hideOnMobile: true,
            headerName: "Added",
            width: 130,
            valueGetter: (value) => value ? new Date(value).toLocaleDateString() : ""
        }

    ];

    const filteredItems = items.filter(item => {

        const text = filter.toLowerCase();

        return (

            itemLabel(item).toLowerCase().includes(text) ||
            (item.notes ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

            <CrudToolbar

                title="Shopping List"

                search={filter}

                onSearchChange={setFilter}

                addLabel="Add Item"

                onAdd={handleAdd}

                onEdit={() => handleEdit(selectedItem)}

                editDisabled={!selectedItem}

                onDelete={() => handleDelete(selectedItem)}

                deleteDisabled={!selectedItem}

            />

            <DataTable

                rows={filteredItems}

                columns={columns}

                listStyle

                onSelectionChange={setSelectedItem}

                onRowDoubleClick={(params) => handleEdit(params.row)}

            />

            <ShoppingListItemDialog

                open={dialogOpen}

                mode={dialogMode}

                item={dialogMode === "edit" ? selectedItem : null}

                onClose={handleClose}

                onSave={handleSave}

            />

            <ConfirmDialog

                open={deleteDialogOpen}

                title="Remove from Shopping List"

                message={
                    selectedItem
                        ? `Remove "${itemLabel(selectedItem)}" from the shopping list?`
                        : "Remove this item from the shopping list?"
                }

                confirmLabel="Remove"
                confirmColor="error"

                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}

            />

        </>

    );

}

export default ShoppingListPage;
