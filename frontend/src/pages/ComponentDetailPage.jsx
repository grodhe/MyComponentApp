import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Stack,
    Typography,
    Divider,
    Grid,
    Chip,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { getComponent, updateComponent } from "../services/componentService";
import { getComponentTransactions, createTransaction } from "../services/inventoryTransactionService";
import { PUBLIC_APP_BASE_URL } from "../config";

import ComponentDialog from "../components/dialogs/ComponentDialog";
import StockAdjustDialog from "../components/dialogs/StockAdjustDialog";
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

function formatTimestamp(value) {

    if (!value)
        return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime()))
        return String(value);

    return date.toLocaleString();

}

function ComponentDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [component, setComponent] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [editOpen, setEditOpen] = useState(false);

    // "use" or "add" -- StockAdjustDialog reuses the same dialog for both,
    // this just picks the title/labels and the sign of the change.
    const [stockDialogMode, setStockDialogMode] = useState("use");
    const [stockDialogOpen, setStockDialogOpen] = useState(false);

    async function load() {

        try {

            const [componentData, transactionsData] = await Promise.all([
                getComponent(id),
                getComponentTransactions(id)
            ]);

            setComponent(componentData);
            setTransactions(transactionsData);

        } catch (err) {

            console.error("Failed to load component:", err);

        }

    }

    useEffect(() => {

        load();

    }, [id]);

    function handleOpenUse() {

        setStockDialogMode("use");
        setStockDialogOpen(true);

    }

    function handleOpenAdd() {

        setStockDialogMode("add");
        setStockDialogOpen(true);

    }

    // Every stock change -- using parts or adding them back -- goes through
    // the transactions endpoint instead of a plain quantity update, so it
    // always leaves a reason + timestamp behind (see
    // inventoryTransactionsServices.js on the backend, which applies the
    // quantity change and records the transaction together).
    async function handleConfirmStockAdjust(amount, reason) {

        if (!component)
            return;

        const quantityDelta = stockDialogMode === "use" ? -amount : amount;

        try {

            const result = await createTransaction(component.id, {
                quantity_delta: quantityDelta,
                reason
            });

            setComponent(result.component);
            setTransactions((current) => [result.transaction, ...current]);
            setStockDialogOpen(false);

        } catch (err) {

            console.error("Failed to record stock change:", err);
            alert(`Failed to record stock change: ${err.message}`);

        }

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
                onClick={() => navigate("/components")}
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
                        sx={{ mb: component.datasheet_url || component.manufacturer_website ? 1 : 3 }}
                    >
                        {component.part_number}
                    </Typography>

                    {(component.datasheet_url || component.manufacturer_website) && (

                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mb: 2 }}
                        >

                            {component.datasheet_url && (

                                <Button
                                    component="a"
                                    href={component.datasheet_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    startIcon={<PictureAsPdfIcon />}
                                >
                                    Datasheet
                                </Button>

                            )}

                            {component.manufacturer_website && (

                                <Button
                                    component="a"
                                    href={component.manufacturer_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    startIcon={<OpenInNewIcon />}
                                >
                                    Manufacturer
                                </Button>

                            )}

                        </Stack>

                    )}

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
                            onClick={handleOpenUse}
                            disabled={(component.quantity ?? 0) <= 0}
                        >
                            Use Stock
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleOpenAdd}
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

                    <Divider sx={{ mt: 4, mb: 2 }} />

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Stock History
                    </Typography>

                    {transactions.length === 0 ? (

                        <Typography color="text.secondary">
                            No stock movements recorded yet -- use "Use Stock" or "Add Stock" above.
                        </Typography>

                    ) : (

                        <Table size="small">

                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Change</TableCell>
                                    <TableCell>Reason</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {transactions.map((t) => (

                                    <TableRow key={t.id}>

                                        <TableCell>
                                            {formatTimestamp(t.created_at)}
                                        </TableCell>

                                        <TableCell
                                            align="right"
                                            sx={{
                                                color: t.quantity_delta < 0 ? "error.main" : "success.main",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {t.quantity_delta > 0 ? `+${t.quantity_delta}` : t.quantity_delta}
                                        </TableCell>

                                        <TableCell>
                                            {t.reason}
                                        </TableCell>

                                    </TableRow>

                                ))}

                            </TableBody>

                        </Table>

                    )}

                </>

            )}

            <ComponentDialog
                open={editOpen}
                mode="edit"
                component={component}
                onClose={() => setEditOpen(false)}
                onSave={handleSaveEdit}
            />

            <StockAdjustDialog
                open={stockDialogOpen}
                mode={stockDialogMode}
                onClose={() => setStockDialogOpen(false)}
                onConfirm={handleConfirmStockAdjust}
            />

            <LabelPrintArea
                lines={[
                    component?.part_number,
                    component?.part_name,
                    component?.description
                ]}
                qrValue={component ? `${PUBLIC_APP_BASE_URL}/components/${component.id}` : null}
            />

        </Box>

    );

}

export default ComponentDetailPage;
