import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    getGenericItems,
    createGenericItem,
    updateGenericItem,
    deleteGenericItem,
    getGenericItemPhotoUrl
} from "../services/genericItemService";

import DataTable from "../components/common/DataTable";
import PhotoThumbnail from "../components/common/PhotoThumbnail";
import CrudToolbar from "../components/common/CrudToolbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import GenericItemDialog from "../components/dialogs/GenericItemDialog";

function GenericItemsPage() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [prefillBarcode, setPrefillBarcode] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function loadItems() {

        try {

            const data = await getGenericItems();
            setItems(data);

        } catch (err) {

            console.error("Failed to load generic items:", err);

        }

    }

    useEffect(() => {

        loadItems();

    }, []);

    // Arriving here from the barcode-scan dialog. Two cases:
    //  - ?open=<id> -- a scan matched an existing item, open it for
    //    editing (there's no separate detail page for generic items, so
    //    "open" means the edit dialog). Waits for items to be loaded so
    //    there's a real row object to hand the dialog.
    //  - ?addBarcode=X -- a scan didn't match anything, open the Add
    //    dialog with that code already filled in.
    useEffect(() => {

        const openId = searchParams.get("open");
        const addBarcode = searchParams.get("addBarcode");

        if (openId && items.length > 0) {

            const match = items.find((item) => String(item.id) === openId);

            if (match) {

                setDialogMode("edit");
                setSelectedItem(match);
                setDialogOpen(true);

            }

            setSearchParams((params) => {
                params.delete("open");
                return params;
            }, { replace: true });

        } else if (addBarcode) {

            setDialogMode("add");
            setSelectedItem(null);
            setPrefillBarcode(addBarcode);
            setDialogOpen(true);

            setSearchParams((params) => {
                params.delete("addBarcode");
                return params;
            }, { replace: true });

        }

    }, [items, searchParams, setSearchParams]);

    function handleAdd() {

        setDialogMode("add");
        setSelectedItem(null);
        setPrefillBarcode(null);
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

                await updateGenericItem(selectedItem.id, item);

            } else {

                await createGenericItem(item);

            }

            setDialogOpen(false);
            setSelectedItem(null);

            await loadItems();

        } catch (err) {

            console.error("Failed to save generic item:", err);
            alert(`Failed to save generic item: ${err.message}`);

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

            await deleteGenericItem(selectedItem.id);

            setDeleteDialogOpen(false);
            setSelectedItem(null);

            await loadItems();

        } catch (err) {

            console.error("Failed to delete generic item:", err);
            alert(`Failed to delete generic item: ${err.message}`);

        }

    }

    function handleCancelDelete() {

        setDeleteDialogOpen(false);

    }

    const columns = [

        {
            field: "photo",
            headerName: "",
            width: 52,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <PhotoThumbnail
                    src={getGenericItemPhotoUrl(params.row.id, params.row.updated_at)}
                    alt={params.row.name}
                    size={36}
                />
            )
        },

        {
            field: "name",
            headerName: "Name",
            flex: 2
        },

        {
            field: "description",
            headerName: "Description",
            flex: 2
        },

        {
            field: "category",
            headerName: "Category",
            width: 140
        },

        {
            field: "location",
            headerName: "Location",
            width: 140
        },

        {
            field: "supplier",
            headerName: "Supplier",
            width: 140
        },

        {
            field: "quantity",
            headerName: "Qty",
            type: "number",
            width: 90
        },

        {
            field: "unit",
            headerName: "Unit",
            width: 90
        }

    ];

    const filteredItems = items.filter(item => {

        const text = filter.toLowerCase();

        return (

            (item.name ?? "").toLowerCase().includes(text) ||
            (item.description ?? "").toLowerCase().includes(text) ||
            (item.category ?? "").toLowerCase().includes(text) ||
            (item.location ?? "").toLowerCase().includes(text) ||
            (item.supplier ?? "").toLowerCase().includes(text) ||
            (item.part_number ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

            <CrudToolbar

                title="Generic Items"

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

            <GenericItemDialog

                open={dialogOpen}

                mode={dialogMode}

                item={dialogMode === "edit" ? selectedItem : null}

                defaultBarcode={prefillBarcode}

                onClose={handleClose}

                onSave={handleSave}

            />

            <ConfirmDialog

                open={deleteDialogOpen}

                title="Delete Generic Item"

                message={
                    selectedItem
                        ? `Are you sure you want to delete "${selectedItem.name}"? This cannot be undone.`
                        : "Are you sure you want to delete this item? This cannot be undone."
                }

                confirmLabel="Delete"
                confirmColor="error"

                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}

            />

        </>

    );

}

export default GenericItemsPage;
