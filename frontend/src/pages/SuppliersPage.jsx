import { useEffect, useState } from "react";

import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from "../services/supplierService";

import DataTable from "../components/common/DataTable";
import CrudToolbar from "../components/common/CrudToolbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SupplierDialog from "../components/dialogs/SupplierDialog";

function SuppliersPage() {

    const [suppliers, setSuppliers] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function loadSuppliers() {

        try {

            const data = await getSuppliers();
            setSuppliers(data);

        } catch (err) {

            console.error("Failed to load suppliers:", err);

        }

    }

    useEffect(() => {

        loadSuppliers();

    }, []);

    function handleAdd() {

        setDialogMode("add");
        setSelectedSupplier(null);
        setDialogOpen(true);

    }

    function handleEdit(supplier) {

        if (!supplier)
            return;

        setSelectedSupplier(supplier);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    function handleClose() {

        setDialogOpen(false);

    }

    async function handleSave(supplier) {

        try {

            if (dialogMode === "edit" && selectedSupplier) {

                await updateSupplier(selectedSupplier.id, supplier);

            } else {

                await createSupplier(supplier);

            }

            setDialogOpen(false);
            setSelectedSupplier(null);

            await loadSuppliers();

        } catch (err) {

            console.error("Failed to save supplier:", err);
            alert(`Failed to save supplier: ${err.message}`);

        }

    }

    function handleDelete(supplier) {

        if (!supplier)
            return;

        setSelectedSupplier(supplier);
        setDeleteDialogOpen(true);

    }

    async function handleConfirmDelete() {

        if (!selectedSupplier)
            return;

        try {

            await deleteSupplier(selectedSupplier.id);

            setDeleteDialogOpen(false);
            setSelectedSupplier(null);

            await loadSuppliers();

        } catch (err) {

            console.error("Failed to delete supplier:", err);
            alert(`Failed to delete supplier: ${err.message}`);

        }

    }

    function handleCancelDelete() {

        setDeleteDialogOpen(false);

    }

    const columns = [

        {
            field: "name",
            headerName: "Name",
            flex: 1
        },

        {
            field: "website",
            headerName: "Website",
            flex: 1
        },

        {
            field: "country",
            headerName: "Country",
            width: 140
        },

        {
            field: "currency",
            headerName: "Currency",
            width: 120
        },

        {
            field: "notes",
            headerName: "Notes",
            flex: 2
        }

    ];

    const filteredSuppliers = suppliers.filter(supplier => {

        const text = filter.toLowerCase();

        return (

            (supplier.name ?? "").toLowerCase().includes(text) ||
            (supplier.website ?? "").toLowerCase().includes(text) ||
            (supplier.country ?? "").toLowerCase().includes(text) ||
            (supplier.currency ?? "").toLowerCase().includes(text) ||
            (supplier.notes ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

            <CrudToolbar

                title="Suppliers"

                search={filter}

                onSearchChange={setFilter}

                addLabel="Add Supplier"

                onAdd={handleAdd}

                onEdit={() => handleEdit(selectedSupplier)}

                editDisabled={!selectedSupplier}

                onDelete={() => handleDelete(selectedSupplier)}

                deleteDisabled={!selectedSupplier}

            />

            <DataTable

                rows={filteredSuppliers}

                columns={columns}

                onSelectionChange={setSelectedSupplier}

                onRowDoubleClick={(params) => handleEdit(params.row)}

            />

            <SupplierDialog

                open={dialogOpen}

                mode={dialogMode}

                supplier={dialogMode === "edit" ? selectedSupplier : null}

                onClose={handleClose}

                onSave={handleSave}

            />

            <ConfirmDialog

                open={deleteDialogOpen}

                title="Delete Supplier"

                message={
                    selectedSupplier
                        ? `Are you sure you want to delete "${selectedSupplier.name}"? This cannot be undone.`
                        : "Are you sure you want to delete this supplier? This cannot be undone."
                }

                confirmLabel="Delete"
                confirmColor="error"

                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}

            />

        </>

    );

}

export default SuppliersPage;
