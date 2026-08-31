import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ClearIcon from "@mui/icons-material/Clear";

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
    const [searchParams, setSearchParams] = useSearchParams();

    const [components, setComponents] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedComponent, setSelectedComponent] = useState(null);

    // Dedicated filters, on top of the free-text search above. These are
    // AND'd together with each other and with the text search -- e.g.
    // picking a category and typing a search term narrows to components
    // matching both. "" always means "no filter applied" for that field.
    const [categoryFilter, setCategoryFilter] = useState("");
    const [manufacturerFilter, setManufacturerFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [prefillBarcode, setPrefillBarcode] = useState(null);

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

    // Arriving here from the barcode-scan dialog after a scan didn't
    // match anything existing -- ?addBarcode=X opens the Add dialog with
    // that code already filled in, so scanning something new can go
    // straight into "create a record for this" instead of needing it
    // typed in twice.
    useEffect(() => {

        const addBarcode = searchParams.get("addBarcode");

        if (!addBarcode)
            return;

        setDialogMode("add");
        setSelectedComponent(null);
        setPrefillBarcode(addBarcode);
        setDialogOpen(true);

        setSearchParams((params) => {
            params.delete("addBarcode");
            return params;
        }, { replace: true });

    }, [searchParams, setSearchParams]);

    function handleAdd() {

        setDialogMode("add");
        setSelectedComponent(null);
        setPrefillBarcode(null);
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
            field: "supplier",
            headerName: "Supplier",
            width: 140
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
    //
    // The dedicated filters below narrow further by exact category/
    // manufacturer, by location (and everything under it), and by stock
    // status -- all AND'd together with this text search and each other.
    const filteredComponents = components.filter(component => {

        const text = filter.toLowerCase();

        const matchesText = (

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

        if (!matchesText)
            return false;

        if (categoryFilter && component.category !== categoryFilter)
            return false;

        if (manufacturerFilter && component.manufacturer !== manufacturerFilter)
            return false;

        // Prefix match on path segments, not exact -- picking "Cabinet 1"
        // also matches "Cabinet 1 / Drawer A1", so filtering by a parent
        // location shows everything nested under it, not just components
        // stored directly on that one node. Matched on " / " boundaries
        // (not a raw substring startsWith) so "Cabinet 1" doesn't also
        // match "Cabinet 10 / ...".
        if (locationFilter) {

            const componentLocation = component.location ?? "";

            const matchesLocation = (
                componentLocation === locationFilter
                || componentLocation.startsWith(`${locationFilter} / `)
            );

            if (!matchesLocation)
                return false;

        }

        const quantity = component.quantity ?? 0;
        const minimumQuantity = component.minimum_quantity ?? 0;

        // Same mutually-exclusive definition as the Dashboard's Low Stock /
        // Out of Stock lists: a 0-quantity item is "out of stock" only, not
        // also counted as "low stock".
        if (stockFilter === "out" && quantity !== 0)
            return false;

        if (stockFilter === "low" && !(quantity > 0 && minimumQuantity > 0 && quantity <= minimumQuantity))
            return false;

        return true;

    });

    const categoryOptions = useMemo(
        () => [...new Set(components.map(c => c.category).filter(Boolean))].sort(),
        [components]
    );

    const manufacturerOptions = useMemo(
        () => [...new Set(components.map(c => c.manufacturer).filter(Boolean))].sort(),
        [components]
    );

    const locationOptions = useMemo(
        () => [...new Set(components.map(c => c.location).filter(Boolean))].sort(),
        [components]
    );

    const hasActiveFilters = Boolean(
        categoryFilter || manufacturerFilter || locationFilter || stockFilter
    );

    function handleClearFilters() {

        setCategoryFilter("");
        setManufacturerFilter("");
        setLocationFilter("");
        setStockFilter("");

    }

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

            <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                alignItems="center"
                sx={{ mb: 2 }}
            >

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="category-filter-label">Category</InputLabel>
                    <Select
                        labelId="category-filter-label"
                        label="Category"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        {categoryOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="manufacturer-filter-label">Manufacturer</InputLabel>
                    <Select
                        labelId="manufacturer-filter-label"
                        label="Manufacturer"
                        value={manufacturerFilter}
                        onChange={(e) => setManufacturerFilter(e.target.value)}
                    >
                        <MenuItem value="">All Manufacturers</MenuItem>
                        {manufacturerOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="location-filter-label">Location</InputLabel>
                    <Select
                        labelId="location-filter-label"
                        label="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        <MenuItem value="">All Locations</MenuItem>
                        {locationOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="stock-filter-label">Stock</InputLabel>
                    <Select
                        labelId="stock-filter-label"
                        label="Stock"
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                    >
                        <MenuItem value="">All Stock Levels</MenuItem>
                        <MenuItem value="low">Low Stock</MenuItem>
                        <MenuItem value="out">Out of Stock</MenuItem>
                    </Select>
                </FormControl>

                {hasActiveFilters && (

                    <Chip
                        label="Clear filters"
                        icon={<ClearIcon />}
                        onClick={handleClearFilters}
                        variant="outlined"
                    />

                )}

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ color: "text.secondary", fontSize: 14 }}>
                    {filteredComponents.length} of {components.length} components
                </Box>

            </Stack>

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

                defaultBarcode={prefillBarcode}

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
