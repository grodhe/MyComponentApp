import { useEffect, useState } from "react";

import {
    getShoppingListItems,
    createShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem
} from "../services/shoppingListService";

import DataTable from "../components/common/DataTable";
import CrudToolbar from "../components/common/CrudToolbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ShoppingListItemDialog from "../components/dialogs/ShoppingListItemDialog";

function itemLabel(row) {

    if (row.component_id) {
        return row.part_name ? `${row.part_number} — ${row.part_name}` : row.part_number;
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

        {
            field: "item",
            headerName: "Item",
            flex: 2,
            valueGetter: (value, row) => itemLabel(row)
        },

        {
            field: "quantity_needed",
            headerName: "Qty Needed",
            type: "number",
            width: 120
        },

        {
            field: "notes",
            headerName: "Notes",
            flex: 2
        },

        {
            field: "created_at",
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
