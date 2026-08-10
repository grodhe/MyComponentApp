import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Stack, Paper, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation
} from "../services/locationService";

import {
    getComponents,
    createComponent,
    updateComponent,
    deleteComponent
} from "../services/componentService";

import {
    getGenericItems,
    createGenericItem,
    updateGenericItem,
    deleteGenericItem
} from "../services/genericItemService";

import { buildFullLocationTree, getLocationPath } from "../utils/locationTree";
import { PUBLIC_APP_BASE_URL } from "../config";

import LocationTree from "../components/locations/LocationTree";
import ConfirmDialog from "../components/common/ConfirmDialog";
import LocationDialog from "../components/dialogs/LocationDialog";
import ComponentDialog from "../components/dialogs/ComponentDialog";
import GenericItemDialog from "../components/dialogs/GenericItemDialog";
import LabelPrintArea from "../components/common/LabelPrintArea";

function LocationsPage() {

    const navigate = useNavigate();

    const [locations, setLocations] = useState([]);
    const [components, setComponents] = useState([]);
    const [genericItems, setGenericItems] = useState([]);

    // Location dialog (add/edit a cabinet, drawer, ...)
    const [locationDialogOpen, setLocationDialogOpen] = useState(false);
    const [locationDialogMode, setLocationDialogMode] = useState("add");
    const [locationDialogTarget, setLocationDialogTarget] = useState(null);
    const [locationDialogDefaultParentId, setLocationDialogDefaultParentId] = useState(null);

    // Component dialog, reused here for "add a component to this location"
    // and for editing a component reached via the tree.
    const [componentDialogOpen, setComponentDialogOpen] = useState(false);
    const [componentDialogMode, setComponentDialogMode] = useState("add");
    const [componentDialogTarget, setComponentDialogTarget] = useState(null);
    const [componentDialogDefaultLocationId, setComponentDialogDefaultLocationId] = useState(null);

    // Generic item dialog, same idea.
    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [itemDialogMode, setItemDialogMode] = useState("add");
    const [itemDialogTarget, setItemDialogTarget] = useState(null);
    const [itemDialogDefaultLocationId, setItemDialogDefaultLocationId] = useState(null);

    // One shared delete-confirmation dialog for all three node types.
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Set right before calling window.print() -- see the effect below.
    const [printTarget, setPrintTarget] = useState(null);

    async function loadAll() {

        try {

            const [locationsResult, componentsResult, itemsResult] = await Promise.all([
                getLocations(),
                getComponents(),
                getGenericItems()
            ]);

            setLocations(locationsResult);
            setComponents(componentsResult);
            setGenericItems(itemsResult);

        } catch (err) {

            console.error("Failed to load locations:", err);

        }

    }

    useEffect(() => {

        loadAll();

    }, []);

    // window.print() needs LabelPrintArea to have already re-rendered with
    // the new target's lines before it's called -- doing that inside a
    // plain click handler would race the state update. Effects run after
    // React commits the DOM, so this is the safe place for it.
    useEffect(() => {

        if (printTarget) {
            window.print();
            setPrintTarget(null);
        }

    }, [printTarget]);

    const tree = useMemo(
        () => buildFullLocationTree(locations, components, genericItems),
        [locations, components, genericItems]
    );

    // --- Location actions ---

    function handleAddRootLocation() {

        setLocationDialogMode("add");
        setLocationDialogTarget(null);
        setLocationDialogDefaultParentId(null);
        setLocationDialogOpen(true);

    }

    function handleAddSubLocation(location) {

        setLocationDialogMode("add");
        setLocationDialogTarget(null);
        setLocationDialogDefaultParentId(location.id);
        setLocationDialogOpen(true);

    }

    function handleEditLocation(location) {

        setLocationDialogMode("edit");
        setLocationDialogTarget(location);
        setLocationDialogOpen(true);

    }

    async function handleSaveLocation(data) {

        try {

            if (locationDialogMode === "edit" && locationDialogTarget) {
                await updateLocation(locationDialogTarget.id, data);
            } else {
                await createLocation(data);
            }

            setLocationDialogOpen(false);

            await loadAll();

        } catch (err) {

            console.error("Failed to save location:", err);
            alert(`Failed to save location: ${err.message}`);

        }

    }

    function handlePrintLocation(location) {

        setPrintTarget(location);

    }

    // --- Component actions ---

    function handleAddComponent(location) {

        setComponentDialogMode("add");
        setComponentDialogTarget(null);
        setComponentDialogDefaultLocationId(location.id);
        setComponentDialogOpen(true);

    }

    function handleEditComponent(component) {

        setComponentDialogMode("edit");
        setComponentDialogTarget(component);
        setComponentDialogOpen(true);

    }

    async function handleSaveComponent(data) {

        try {

            if (componentDialogMode === "edit" && componentDialogTarget) {
                await updateComponent(componentDialogTarget.id, data);
            } else {
                await createComponent(data);
            }

            setComponentDialogOpen(false);

            await loadAll();

        } catch (err) {

            console.error("Failed to save component:", err);
            alert(`Failed to save component: ${err.message}`);

        }

    }

    function handleOpenComponent(component) {

        navigate(`/components/${component.id}`);

    }

    // --- Generic item actions ---

    function handleAddGenericItem(location) {

        setItemDialogMode("add");
        setItemDialogTarget(null);
        setItemDialogDefaultLocationId(location.id);
        setItemDialogOpen(true);

    }

    function handleEditGenericItem(item) {

        setItemDialogMode("edit");
        setItemDialogTarget(item);
        setItemDialogOpen(true);

    }

    async function handleSaveGenericItem(data) {

        try {

            if (itemDialogMode === "edit" && itemDialogTarget) {
                await updateGenericItem(itemDialogTarget.id, data);
            } else {
                await createGenericItem(data);
            }

            setItemDialogOpen(false);

            await loadAll();

        } catch (err) {

            console.error("Failed to save generic item:", err);
            alert(`Failed to save item: ${err.message}`);

        }

    }

    // --- Shared delete confirmation ---

    function handleConfirmDelete() {

        if (!deleteTarget)
            return Promise.resolve();

        const { type, raw } = deleteTarget;

        const action = type === "location"
            ? () => deleteLocation(raw.id)
            : type === "component"
                ? () => deleteComponent(raw.id)
                : () => deleteGenericItem(raw.id);

        return action()
            .then(() => {
                setDeleteTarget(null);
                return loadAll();
            })
            .catch((err) => {
                console.error(`Failed to delete ${type}:`, err);
                alert(`Failed to delete: ${err.message}`);
            });

    }

    function deleteMessage() {

        if (!deleteTarget)
            return "";

        const { type, raw } = deleteTarget;

        if (type === "location") {
            return `Are you sure you want to delete "${raw.name}"? This cannot be undone.`;
        }

        if (type === "component") {
            return `Are you sure you want to delete "${raw.part_number}"? This cannot be undone.`;
        }

        return `Are you sure you want to delete "${raw.name}"? This cannot be undone.`;

    }

    const treeActions = {
        onEditLocation: handleEditLocation,
        onAddSubLocation: handleAddSubLocation,
        onAddComponent: handleAddComponent,
        onAddGenericItem: handleAddGenericItem,
        onDeleteLocation: (location) => setDeleteTarget({ type: "location", raw: location }),
        onPrintLocation: handlePrintLocation,
        onEditComponent: handleEditComponent,
        onDeleteComponent: (component) => setDeleteTarget({ type: "component", raw: component }),
        onOpenComponent: handleOpenComponent,
        onEditGenericItem: handleEditGenericItem,
        onDeleteGenericItem: (item) => setDeleteTarget({ type: "genericItem", raw: item })
    };

    return (

        <Box>

            <Stack
                direction="row"
                alignItems="center"
                sx={{ mb: 3 }}
            >

                <Typography variant="h4" fontWeight="bold">
                    Locations
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddRootLocation}
                >
                    Add Location
                </Button>

            </Stack>

            <Paper
                elevation={2}
                sx={{
                    maxHeight: 700,
                    overflowY: "auto"
                }}
            >

                <LocationTree
                    nodes={tree}
                    actions={treeActions}
                />

            </Paper>

            <LocationDialog

                open={locationDialogOpen}

                mode={locationDialogMode}

                location={locationDialogMode === "edit" ? locationDialogTarget : null}

                defaultParentId={locationDialogDefaultParentId}

                onClose={() => setLocationDialogOpen(false)}

                onSave={handleSaveLocation}

            />

            <ComponentDialog

                open={componentDialogOpen}

                mode={componentDialogMode}

                component={componentDialogMode === "edit" ? componentDialogTarget : null}

                defaultLocationId={componentDialogDefaultLocationId}

                onClose={() => setComponentDialogOpen(false)}

                onSave={handleSaveComponent}

            />

            <GenericItemDialog

                open={itemDialogOpen}

                mode={itemDialogMode}

                item={itemDialogMode === "edit" ? itemDialogTarget : null}

                defaultLocationId={itemDialogDefaultLocationId}

                onClose={() => setItemDialogOpen(false)}

                onSave={handleSaveGenericItem}

            />

            <ConfirmDialog

                open={Boolean(deleteTarget)}

                title="Delete"

                message={deleteMessage()}

                confirmLabel="Delete"
                confirmColor="error"

                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}

            />

            {/*
                First line is the full breadcrumb (e.g. "Cabinet 1 / Drawer
                A1"), not just the location's own name -- a label reading
                just "Drawer A1" doesn't tell you which cabinet it's from
                if it's ever off the shelf, and the QR only encodes an id,
                not the path, so the printed text is the only place that
                context shows up.
            */}
            <LabelPrintArea
                lines={[
                    printTarget ? getLocationPath(locations, printTarget.id) : null,
                    printTarget?.description
                ]}
                qrValue={printTarget ? `${PUBLIC_APP_BASE_URL}/location/${printTarget.id}` : null}
            />

        </Box>

    );

}

export default LocationsPage;
