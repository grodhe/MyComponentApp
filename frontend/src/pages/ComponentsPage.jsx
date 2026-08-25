import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import {
    getComponents,
    createComponent,
    updateComponent,
    deleteComponent,
    getComponentPhotoUrl
} from "../services/componentService";

import DataTable from "../components/common/DataTable";
import PhotoThumbnail from "../components/common/PhotoThumbnail";

import CrudToolbar from "../components/common/CrudToolbar";

import ComponentDialog from "../components/dialogs/ComponentDialog";
import DeleteComponentDialog from "../components/dialogs/DeleteComponentDialog";

function ComponentsPage() {

    const navigate = useNavigate();

    const [components, setComponents] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedComponent, setSelectedComponent] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    async function loadComponents() {

        try {

            const data = await getComponents();
            setComponents(data);

        } catch (err) {

            console.error("Failed to load components:", err);

        }

    }

    useEffect(() => {

        loadComponents();

    }, []);

    function handleAdd() {

        setDialogMode("add");
        setSelectedComponent(null);
        setDialogOpen(true);

    }

    function handleClose() {

        setDialogOpen(false);

    }

    function handleOpenDetail(component) {

        if (!component)
            return;

        navigate(`/components/${component.id}`);

    }

    async function handleSave(component) {

        try {

            if (dialogMode === "edit" && selectedComponent) {

                await updateComponent(selectedComponent.id, component);

            } else {

                await createComponent(component);

            }

            setDialogOpen(false);
            setSelectedComponent(null);

            await loadComponents();

        } catch (err) {

            console.error("Failed to save component:", err);
            alert(`Failed to save component: ${err.message}`);

        }

    }

    function handleDelete(component) {

        if (!component)
            return;

        setSelectedComponent(component);
        setDeleteDialogOpen(true);

    }

    async function handleConfirmDelete() {

        if (!selectedComponent)
            return;

        try {

            await deleteComponent(selectedComponent.id);

            setDeleteDialogOpen(false);
            setSelectedComponent(null);

            await loadComponents();

        } catch (err) {

            console.error("Failed to delete component:", err);
            alert(`Failed to delete component: ${err.message}`);

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
                    src={getComponentPhotoUrl(params.row.id, params.row.updated_at)}
                    alt={params.row.part_number}
                    size={36}
                />
            )
        },

        {
            field: "part_number",
            headerName: "Part Number",
            width: 170
        },

        {
            field: "part_name",
            headerName: "Part Name",
            flex: 2
        },

        {
            field: "description",
            headerName: "Description",
            flex: 2
        },

        {
            field: "manufacturer",
            headerName: "Manufacturer",
            width: 180
        },

        {
            field: "package",
            headerName: "Package",
            width: 120
        },

        {
            field: "component_value",
            headerName: "Value",
            width: 120
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
            field: "quantity",
            headerName: "Qty",
            type: "number",
            width: 90
        }

    ];

    // Search is one of the primary ways of finding a component here, so
    // this covers every field someone might actually remember/search by --
    // not just part number/name. Plain substring matching (not "starts
    // with") so a partial fragment like "BME" finds both BME280 and BME680.
    const filteredComponents = components.filter(component => {

        const text = filter.toLowerCase();

        return (

            (component.part_number ?? "").toLowerCase().includes(text) ||
            (component.part_name ?? "").toLowerCase().includes(text) ||
            (component.manufacturer ?? "").toLowerCase().includes(text) ||
            (component.manufacturer_part_number ?? "").toLowerCase().includes(text) ||
            (component.description ?? "").toLowerCase().includes(text) ||
            (component.package ?? "").toLowerCase().includes(text) ||
            (component.footprint ?? "").toLowerCase().includes(text) ||
            (component.notes ?? "").toLowerCase().includes(text) ||
            (component.component_value ?? "").toLowerCase().includes(text) ||
            (component.category ?? "").toLowerCase().includes(text) ||
            (component.location ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

            <CrudToolbar

                title="Components"

                search={filter}

                onSearchChange={setFilter}

                addLabel="Add Component"

                onAdd={handleAdd}

                showEdit={false}

                onDelete={() => handleDelete(selectedComponent)}

                deleteDisabled={!selectedComponent}

                extraActions={

                    <Button
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => handleOpenDetail(selectedComponent)}
                        disabled={!selectedComponent}
                    >
                        Open Component
                    </Button>

                }

            />

            <DataTable

                rows={filteredComponents}

                columns={columns}

                onSelectionChange={setSelectedComponent}

                onRowDoubleClick={(params) => handleOpenDetail(params.row)}

            />

            <ComponentDialog

                open={dialogOpen}

                mode={dialogMode}

                component={dialogMode === "edit" ? selectedComponent : null}

                onClose={handleClose}

                onSave={handleSave}

            />

            <DeleteComponentDialog

                open={deleteDialogOpen}

                component={selectedComponent}

                onConfirm={handleConfirmDelete}

                onCancel={handleCancelDelete}

            />

        </>

    );

}

export default ComponentsPage;
