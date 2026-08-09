import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

import {
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation
} from "../services/locationService";

import DataTable from "../components/common/DataTable";
import CrudToolbar from "../components/common/CrudToolbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import LocationDialog from "../components/dialogs/LocationDialog";
import LabelPrintArea from "../components/common/LabelPrintArea";

function LocationsPage() {

    const [locations, setLocations] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function loadLocations() {

        try {

            const data = await getLocations();
            setLocations(data);

        } catch (err) {

            console.error("Failed to load locations:", err);

        }

    }

    useEffect(() => {

        loadLocations();

    }, []);

    function handleAdd() {

        setDialogMode("add");
        setSelectedLocation(null);
        setDialogOpen(true);

    }

    function handleEdit(location) {

        if (!location)
            return;

        setSelectedLocation(location);
        setDialogMode("edit");
        setDialogOpen(true);

    }

    function handleClose() {

        setDialogOpen(false);

    }

    async function handleSave(location) {

        try {

            if (dialogMode === "edit" && selectedLocation) {

                await updateLocation(selectedLocation.id, location);

            } else {

                await createLocation(location);

            }

            setDialogOpen(false);
            setSelectedLocation(null);

            await loadLocations();

        } catch (err) {

            console.error("Failed to save location:", err);
            alert(`Failed to save location: ${err.message}`);

        }

    }

    function handleDelete(location) {

        if (!location)
            return;

        setSelectedLocation(location);
        setDeleteDialogOpen(true);

    }

    async function handleConfirmDelete() {

        if (!selectedLocation)
            return;

        try {

            await deleteLocation(selectedLocation.id);

            setDeleteDialogOpen(false);
            setSelectedLocation(null);

            await loadLocations();

        } catch (err) {

            console.error("Failed to delete location:", err);
            alert(`Failed to delete location: ${err.message}`);

        }

    }

    function handleCancelDelete() {

        setDeleteDialogOpen(false);

    }

    function handlePrint() {

        if (!selectedLocation)
            return;

        window.print();

    }

    const columns = [

        {
            field: "name",
            headerName: "Name",
            flex: 1
        },

        {
            field: "description",
            headerName: "Description",
            flex: 2
        }

    ];

    const filteredLocations = locations.filter(location => {

        const text = filter.toLowerCase();

        return (

            (location.name ?? "").toLowerCase().includes(text) ||
            (location.description ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

            <CrudToolbar

                title="Locations"

                search={filter}

                onSearchChange={setFilter}

                addLabel="Add Location"

                onAdd={handleAdd}

                onEdit={() => handleEdit(selectedLocation)}

                editDisabled={!selectedLocation}

                onDelete={() => handleDelete(selectedLocation)}

                deleteDisabled={!selectedLocation}

                trailingActions={

                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        disabled={!selectedLocation}
                    >
                        Print Label
                    </Button>

                }

            />

            <DataTable

                rows={filteredLocations}

                columns={columns}

                onSelectionChange={setSelectedLocation}

                onRowDoubleClick={(params) => handleEdit(params.row)}

            />

            <LocationDialog

                open={dialogOpen}

                mode={dialogMode}

                location={dialogMode === "edit" ? selectedLocation : null}

                onClose={handleClose}

                onSave={handleSave}

            />

            <ConfirmDialog

                open={deleteDialogOpen}

                title="Delete Location"

                message={
                    selectedLocation
                        ? `Are you sure you want to delete "${selectedLocation.name}"? This cannot be undone.`
                        : "Are you sure you want to delete this location? This cannot be undone."
                }

                confirmLabel="Delete"
                confirmColor="error"

                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}

            />

            <LabelPrintArea
                lines={[selectedLocation?.name, selectedLocation?.description]}
            />

        </>

    );

}

export default LocationsPage;
