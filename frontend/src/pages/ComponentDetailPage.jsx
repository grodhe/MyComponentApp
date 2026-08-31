import { useEffect, useRef, useState } from "react";
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
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import {
    getComponent,
    updateComponent,
    getComponentPhotoUrl,
    uploadComponentPhoto,
    deleteComponentPhoto
} from "../services/componentService";
import { getComponentTransactions, createTransaction } from "../services/inventoryTransactionService";
import {
    getComponentPurchases,
    createPurchase,
    deletePurchase
} from "../services/componentPurchaseService";
import { getSuppliers } from "../services/supplierService";
import { PUBLIC_APP_BASE_URL } from "../config";

import ComponentDialog from "../components/dialogs/ComponentDialog";
import StockAdjustDialog from "../components/dialogs/StockAdjustDialog";
import PurchaseDialog from "../components/dialogs/PurchaseDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
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

// Shows the component's photo if one's been uploaded, a placeholder icon
// if not, and Upload/Change/Remove controls underneath. Whether a photo
// exists isn't tracked in the database at all -- this just tries to load
// the image and falls back to the placeholder on a 404, so there's
// nothing to keep in sync.
function ComponentPhoto({ component, onChanged }) {

    const [photoOk, setPhotoOk] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Re-arm optimism whenever the component (or its updated_at, which
    // changes on every upload/delete) changes, so a fresh upload is
    // reflected instead of sticking with a stale "no photo" result.
    useEffect(() => {

        setPhotoOk(true);

    }, [component.id, component.updated_at]);

    async function handleFileChange(event) {

        const file = event.target.files?.[0];

        // Allows re-selecting the exact same filename later (e.g. after
        // removing a photo and wanting to re-upload it) -- browsers don't
        // fire onChange again for an unchanged file list otherwise.
        event.target.value = "";

        if (!file)
            return;

        setUploading(true);

        try {

            await uploadComponentPhoto(component.id, file);
            setPhotoOk(true);
            onChanged();

        } catch (err) {

            console.error("Failed to upload photo:", err);
            alert(`Failed to upload photo: ${err.message}`);

        } finally {

            setUploading(false);

        }

    }

    async function handleRemove() {

        try {

            await deleteComponentPhoto(component.id);
            setPhotoOk(false);
            onChanged();

        } catch (err) {

            console.error("Failed to remove photo:", err);
            alert(`Failed to remove photo: ${err.message}`);

        }

    }

    const photoUrl = getComponentPhotoUrl(component.id, component.updated_at);

    return (

        <Stack alignItems="center" spacing={1}>

            <Box
                sx={{
                    width: 160,
                    height: 140,
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0
                }}
            >

                {photoOk ? (

                    // "contain" (not "cover") so the whole photo is always
                    // visible -- "cover" was cropping/zooming into
                    // non-square photos (e.g. a battery shot wider than
                    // it is tall) instead of showing the full picture.
                    <Box
                        component="img"
                        src={photoUrl}
                        alt={component.part_number}
                        onError={() => setPhotoOk(false)}
                        sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />

                ) : (

                    <ImageNotSupportedIcon color="disabled" fontSize="large" />

                )}

            </Box>

            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <Stack direction="row" spacing={1}>

                <Button
                    size="small"
                    startIcon={<AddAPhotoIcon fontSize="small" />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {photoOk ? "Change" : "Upload"}
                </Button>

                {photoOk && (

                    <Button
                        size="small"
                        color="error"
                        onClick={handleRemove}
                        disabled={uploading}
                    >
                        Remove
                    </Button>

                )}

            </Stack>

        </Stack>

    );

}

// purchase_date is a plain SQL DATE (no time component), unlike the
// transaction timestamps above -- formatTimestamp would tack on a
// meaningless "00:00", so this just takes the date part.
function formatDate(value) {

    if (!value)
        return "";

    return String(value).slice(0, 10);

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
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [editOpen, setEditOpen] = useState(false);

    // "use" or "add" -- StockAdjustDialog reuses the same dialog for both,
    // this just picks the title/labels and the sign of the change.
    const [stockDialogMode, setStockDialogMode] = useState("use");
    const [stockDialogOpen, setStockDialogOpen] = useState(false);

    const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
    const [purchaseDeleteTarget, setPurchaseDeleteTarget] = useState(null);

    async function load() {

        try {

            const [componentData, transactionsData, purchasesData, suppliersData] = await Promise.all([
                getComponent(id),
                getComponentTransactions(id),
                getComponentPurchases(id),
                getSuppliers()
            ]);

            setComponent(componentData);
            setTransactions(transactionsData);
            setPurchases(purchasesData);
            setSuppliers(suppliersData);

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

    // Quick +1/-1 -- bypasses the "reason required" dialog on purpose, but
    // still goes through the same transactions endpoint as Use/Add Stock so
    // it's logged (as "Quick adjustment") and shows up in Stock History.
    // -1 is disabled at 0 quantity from the button itself, same guard as
    // the full Use Stock button already has.
    async function handleQuickAdjust(delta) {

        if (!component)
            return;

        if (delta < 0 && (component.quantity ?? 0) <= 0)
            return;

        try {

            const result = await createTransaction(component.id, {
                quantity_delta: delta,
                reason: "Quick adjustment"
            });

            setComponent(result.component);
            setTransactions((current) => [result.transaction, ...current]);

        } catch (err) {

            console.error("Failed to record quick stock change:", err);
            alert(`Failed to record stock change: ${err.message}`);

        }

    }

    function handleOpenLogPurchase() {

        setPurchaseDialogOpen(true);

    }

    // Pure record-keeping -- see componentPurchaseService.js. This never
    // touches component.quantity, unlike handleConfirmStockAdjust above.
    async function handleSavePurchase(data) {

        if (!component)
            return;

        try {

            const created = await createPurchase(component.id, data);

            setPurchases((current) => [created, ...current]);
            setPurchaseDialogOpen(false);

        } catch (err) {

            console.error("Failed to log purchase:", err);
            alert(`Failed to log purchase: ${err.message}`);

        }

    }

    async function handleConfirmDeletePurchase() {

        if (!component || !purchaseDeleteTarget)
            return;

        try {

            await deletePurchase(component.id, purchaseDeleteTarget.id);

            setPurchases((current) => current.filter((p) => p.id !== purchaseDeleteTarget.id));
            setPurchaseDeleteTarget(null);

        } catch (err) {

            console.error("Failed to delete purchase:", err);
            alert(`Failed to delete purchase: ${err.message}`);

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

                    <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ mb: 1 }}>

                        <ComponentPhoto component={component} onChanged={load} />

                        <Box sx={{ flex: 1, minWidth: 0 }}>

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

                        <Tooltip title="Quick -1 (no reason needed, still logged)">
                            <span>
                                <IconButton
                                    onClick={() => handleQuickAdjust(-1)}
                                    disabled={(component.quantity ?? 0) <= 0}
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleOpenAdd}
                        >
                            Add Stock
                        </Button>

                        <Tooltip title="Quick +1 (no reason needed, still logged)">
                            <IconButton
                                onClick={() => handleQuickAdjust(1)}
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>

                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                        >
                            Print Label
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleOpenLogPurchase}
                        >
                            Log Purchase
                        </Button>

                    </Stack>

                        </Box>

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
                            label="Supplier"
                            value={component.supplier}
                        />

                        <DetailField
                            label="Supplier Part Number"
                            value={component.supplier_part_number}
                        />

                        <DetailField
                            label="Purchase Price"
                            value={
                                component.purchase_price === null || component.purchase_price === undefined
                                    ? null
                                    : Number(component.purchase_price).toFixed(2)
                            }
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

                        <DetailField
                            label="Barcode"
                            value={component.barcode}
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

                    <Divider sx={{ mt: 4, mb: 2 }} />

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Purchase History
                    </Typography>

                    {purchases.length === 0 ? (

                        <Typography color="text.secondary">
                            No purchases logged yet -- use "Log Purchase" above.
                        </Typography>

                    ) : (

                        <Table size="small">

                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Qty</TableCell>
                                    <TableCell align="right">Unit Price</TableCell>
                                    <TableCell>Supplier</TableCell>
                                    <TableCell>Supplier Part #</TableCell>
                                    <TableCell>Order Ref</TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {purchases.map((p) => (

                                    <TableRow key={p.id}>

                                        <TableCell>
                                            {formatDate(p.purchase_date) || formatTimestamp(p.created_at)}
                                        </TableCell>

                                        <TableCell align="right">
                                            {p.quantity}
                                        </TableCell>

                                        <TableCell align="right">
                                            {p.unit_price === null || p.unit_price === undefined
                                                ? "—"
                                                : Number(p.unit_price).toFixed(2)}
                                        </TableCell>

                                        <TableCell>
                                            {p.supplier || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {p.supplier_part_number || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {p.order_reference || "—"}
                                        </TableCell>

                                        <TableCell>
                                            {p.notes || "—"}
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => setPurchaseDeleteTarget(p)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
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

            <PurchaseDialog
                open={purchaseDialogOpen}
                defaultSupplierId={component?.supplier_id ?? ""}
                defaultSupplierPartNumber={component?.supplier_part_number ?? ""}
                suppliers={suppliers}
                onClose={() => setPurchaseDialogOpen(false)}
                onSave={handleSavePurchase}
            />

            <ConfirmDialog
                open={Boolean(purchaseDeleteTarget)}
                title="Delete Purchase"
                message="Are you sure you want to delete this purchase record? This cannot be undone."
                confirmLabel="Delete"
                confirmColor="error"
                onConfirm={handleConfirmDeletePurchase}
                onCancel={() => setPurchaseDeleteTarget(null)}
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
