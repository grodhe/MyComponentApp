import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

import {
    getComponents,
    createComponent,
    updateComponent,
    deleteComponent
} from "../services/componentService";

import DataTable from "../components/common/DataTable";

import CrudToolbar from "../components/common/CrudToolbar";

import ComponentDialog from "../components/dialogs/ComponentDialog";
import DeleteComponentDialog from "../components/dialogs/DeleteComponentDialog";
import LabelPrintArea from "../components/common/LabelPrintArea";

function ComponentsPage() {

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

    function handleEdit(component) {

        if (!component)
            return;

        setSelectedComponent(component);
        setDialogMode("edit");
        setDialogOpen(true);

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

    function handlePrint() {

        if (!selectedComponent)
            return;

        window.print();

    }

    const columns = [

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

    const filteredComponents = components.filter(component => {

        const text = filter.toLowerCase();

        return (

            (component.part_number ?? "").toLowerCase().includes(text) ||
            (component.part_name ?? "").toLowerCase().includes(text) ||
            (component.description ?? "").toLowerCase().includes(text) ||
            (component.manufacturer ?? "").toLowerCase().includes(text) ||
            (component.package ?? "").toLowerCase().includes(text) ||
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

                onEdit={() => handleEdit(selectedComponent)}

                editDisabled={!selectedComponent}

                onDelete={() => handleDelete(selectedComponent)}

                deleteDisabled={!selectedComponent}

                trailingActions={

                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        disabled={!selectedComponent}
                    >
                        Print Label
                    </Button>

                }

            />

            <DataTable

                rows={filteredComponents}

                columns={columns}

                onSelectionChange={setSelectedComponent}

                onRowDoubleClick={(params) => handleEdit(params.row)}

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

            <LabelPrintArea
                lines={[
                    selectedComponent?.part_number,
                    selectedComponent?.part_name,
                    selectedComponent?.description
                ]}
            />

        </>

    );

}

export default ComponentsPage;
