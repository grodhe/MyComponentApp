import { useEffect, useState } from "react";

import {
    getManufacturers,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer
} from "../services/manufacturerService";

import DataTable from "../components/common/DataTable";
import CrudToolbar from "../components/common/CrudToolbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ManufacturerDialog from "../components/dialogs/ManufacturerDialog";

function ManufacturersPage() {

    const [manufacturers, setManufacturers] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function loadManufacturers() {

        try {

            const data = await getManufacturers();
            setManufacturers(data);

        } catch (err) {

            console.error("Failed to load manufacturers:", err);

        }

    }

    useEffect(() => {

        loadManufacturers();

    }, []);

    function handleAdd() {

        setDialogMode("add");
        setSelectedManufacturer(null);
        setDialogOpen(true);

    }

    function handleEdit(manufacturer) {

        if (!manufacturer)
            return;

        setSelectedManufacturer(manufacturer);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    function handleClose() {

        setDialogOpen(false);

    }

    async function handleSave(manufacturer) {

        try {

            if (dialogMode === "edit" && selectedManufacturer) {

                await updateManufacturer(selectedManufacturer.id, manufacturer);

            } else {

                await createManufacturer(manufacturer);

            }

            setDialogOpen(false);
            setSelectedManufacturer(null);

            await loadManufacturers();

        } catch (err) {

            console.error("Failed to save manufacturer:", err);
            alert(`Failed to save manufacturer: ${err.message}`);

        }

    }

    function handleDelete(manufacturer) {

        if (!manufacturer)
            return;

        setSelectedManufacturer(manufacturer);
        setDeleteDialogOpen(true);

    }

    async function handleConfirmDelete() {

        if (!selectedManufacturer)
            return;

        try {

            await deleteManufacturer(selectedManufacturer.id);

            setDeleteDialogOpen(false);
            setSelectedManufacturer(null);

            await loadManufacturers();

        } catch (err) {

            console.error("Failed to delete manufacturer:", err);
            alert(`Failed to delete manufacturer: ${err.message}`);

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
            field: "notes",
            headerName: "Notes",
            flex: 2
        }

    ];

    const filteredManufacturers = manufacturers.filter(manufacturer => {

        const text = filter.toLowerCase();

        return (

            (manufacturer.name ?? "").toLowerCase().includes(text) ||
            (manufacturer.website ?? "").toLowerCase().includes(text) ||
            (manufacturer.notes ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

            <CrudToolbar

                title="Manufacturers"

                search={filter}

                onSearchChange={setFilter}

                addLabel="Add Manufacturer"

                onAdd={handleAdd}

                onEdit={() => handleEdit(selectedManufacturer)}

                editDisabled={!selectedManufacturer}

                onDelete={() => handleDelete(selectedManufacturer)}

                deleteDisabled={!selectedManufacturer}

            />

            <DataTable

                rows={filteredManufacturers}

                columns={columns}

                onSelectionChange={setSelectedManufacturer}

                onRowDoubleClick={(params) => handleEdit(params.row)}

            />

            <ManufacturerDialog

                open={dialogOpen}

                mode={dialogMode}

                manufacturer={dialogMode === "edit" ? selectedManufacturer : null}

                onClose={handleClose}

                onSave={handleSave}

            />

            <ConfirmDialog

                open={deleteDialogOpen}

                title="Delete Manufacturer"

                message={
                    selectedManufacturer
                        ? `Are you sure you want to delete "${selectedManufacturer.name}"? This cannot be undone.`
                        : "Are you sure you want to delete this manufacturer? This cannot be undone."
                }

                confirmLabel="Delete"
                confirmColor="error"

                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}

            />

        </>

    );

}

export default ManufacturersPage;
