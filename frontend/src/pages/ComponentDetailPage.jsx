import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Stack,
    Typography,
    Divider,
    Grid,
    Chip,
    Button
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import PrintIcon from "@mui/icons-material/Print";

import { getComponent, updateComponent } from "../services/componentService";

import ComponentDialog from "../components/dialogs/ComponentDialog";
import AddStockDialog from "../components/dialogs/AddStockDialog";
import LabelPrintArea from "../components/common/LabelPrintArea";

// A single labeled field in the detail grid. Renders nothing if there's no
// value, so the page doesn't fill up with empty "Location: --" style rows.
function DetailField({ label, value }) {

    if (value === null || value === undefined || value === "")
        return null;

    return (

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
            >
                {label}
            </Typography>

            <Typography>
                {value}
            </Typography>

        </Grid>

    );

}

function ComponentDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [component, setComponent] = useState(null);

    const [editOpen, setEditOpen] = useState(false);
    const [addStockOpen, setAddStockOpen] = useState(false);

    async function load() {

        try {

            const data = await getComponent(id);
            setComponent(data);

        } catch (err) {

            console.error("Failed to load component:", err);

        }

    }

    useEffect(() => {

        load();

    }, [id]);

    // "Use 1" / "Add Stock" both go through the normal update endpoint with
    // the full component object (just the quantity changed) -- the backend
    // update route doesn't have separate increment/decrement actions, and
    // for a single-user app there's no real risk in doing it this way.
    async function applyQuantityChange(newQuantity) {

        try {

            const updated = await updateComponent(component.id, {
                ...component,
                quantity: newQuantity
            });

            setComponent(updated);

        } catch (err) {

            console.error("Failed to update quantity:", err);
            alert(`Failed to update quantity: ${err.message}`);

        }

    }

    function handleUseOne() {

        if (!component)
            return;

        const newQuantity = Math.max(0, (component.quantity ?? 0) - 1);

        applyQuantityChange(newQuantity);

    }

    function handleAddStock(amount) {

        if (!component)
            return;

        const newQuantity = (component.quantity ?? 0) + amount;

        applyQuantityChange(newQuantity);
        setAddStockOpen(false);

    }

    function handlePrint() {

        if (!component)
            return;

        window.print();

    }

    async function handleSaveEdit(data) {

        try {

            const updated = await updateComponent(component.id, data);

            setComponent(updated);
            setEditOpen(false);

        } catch (err) {

            console.error("Failed to save component:", err);
            alert(`Failed to save component: ${err.message}`);

        }

    }

    const lowStock = component
        && component.minimum_quantity
        && (component.quantity ?? 0) <= component.minimum_quantity;

    return (

        <Box>

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                sx={{ mb: 2 }}
            >
                Back to Components
            </Button>

            {component && (

                <>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ mb: 1 }}
                    >

                        <Typography variant="h4" fontWeight="bold">
                            {component.part_name || component.part_number}
                        </Typography>

                        {lowStock && (
                            <Chip
                                size="small"
                                color="warning"
                                label="Low stock"
                            />
                        )}

                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        {component.part_number}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 3 }}
                    >

                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setEditOpen(true)}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<RemoveCircleOutlineIcon />}
                            onClick={handleUseOne}
                            disabled={(component.quantity ?? 0) <= 0}
                        >
                            Use 1
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => setAddStockOpen(true)}
                        >
                            Add Stock
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                        >
                            Print Label
                        </Button>

                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>

                        <DetailField
                            label="Part Number"
                            value={component.part_number}
                        />

                        <DetailField
                            label="Manufacturer"
                            value={component.manufacturer}
                        />

                        <DetailField
                            label="Manufacturer Part Number"
                            value={component.manufacturer_part_number}
                        />

                        <DetailField
                            label="Package"
                            value={component.package}
                        />

                        <DetailField
                            label="Footprint"
                            value={component.footprint}
                        />

                        <DetailField
                            label="Quantity"
                            value={component.quantity}
                        />

                        <DetailField
                            label="Minimum Quantity"
                            value={component.minimum_quantity}
                        />

                        <DetailField
                            label="Location"
                            value={component.location}
                        />

                        <Grid size={12}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block" }}
                            >
                                Notes
                            </Typography>

                            <Typography sx={{ whiteSpace: "pre-wrap" }}>
                                {component.notes || "—"}
                            </Typography>

                        </Grid>

                    </Grid>

                </>

            )}

            <ComponentDialog
                open={editOpen}
                mode="edit"
                component={component}
                onClose={() => setEditOpen(false)}
                onSave={handleSaveEdit}
            />

            <AddStockDialog
                open={addStockOpen}
                onClose={() => setAddStockOpen(false)}
                onConfirm={handleAddStock}
            />

            <LabelPrintArea
                lines={[
                    component?.part_number,
                    component?.part_name,
                    component?.description
                ]}
            />

        </Box>

    );

}

export default ComponentDetailPage;
