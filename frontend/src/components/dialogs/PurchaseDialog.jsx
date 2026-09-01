import { useEffect, useState } from "react";

import { useSettings } from "../../context/SettingsContext";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,

    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment
} from "@mui/material";

function today() {

    // yyyy-mm-dd, what a <TextField type="date"> expects/returns.
    return new Date().toISOString().slice(0, 10);

}

// Logging a purchase is pure record-keeping (see componentPurchaseService.js)
// -- it never touches the component's own quantity, so this dialog doesn't
// ask for or apply any stock change. Use "Add Stock" separately for that
// when the parts actually arrive.
function PurchaseDialog({

    open,

    // Current values on the component itself, used to prefill a new
    // purchase -- the supplier and their part number are usually the same
    // purchase to purchase, but both stay editable here since either can
    // change for a specific order without you wanting to update the
    // component's own "current" values.
    defaultSupplierId = "",
    defaultSupplierPartNumber = "",

    suppliers = [],

    onClose,
    onSave

}) {

    const { settings } = useSettings();

    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState("");
    const [purchaseDate, setPurchaseDate] = useState(today());
    const [supplierId, setSupplierId] = useState("");
    const [supplierPartNumber, setSupplierPartNumber] = useState("");
    const [orderReference, setOrderReference] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {

        if (!open)
            return;

        setQuantity(1);
        setUnitPrice("");
        setPurchaseDate(today());
        setSupplierId(defaultSupplierId ?? "");
        setSupplierPartNumber(defaultSupplierPartNumber ?? "");
        setOrderReference("");
        setNotes("");

    }, [open, defaultSupplierId, defaultSupplierPartNumber]);

    const parsedQuantity = Number(quantity);
    const isQuantityValid = Number.isFinite(parsedQuantity) && parsedQuantity > 0 && Number.isInteger(parsedQuantity);
    const canSave = isQuantityValid;

    function handleSave() {

        if (!canSave)
            return;

        onSave({
            quantity: parsedQuantity,
            unit_price: unitPrice === "" ? "" : unitPrice,
            purchase_date: purchaseDate || "",
            supplier_id: supplierId,
            supplier_part_number: supplierPartNumber,
            order_reference: orderReference,
            notes
        });

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                Log Purchase
            </DialogTitle>

            <DialogContent>

                <Grid container spacing={2} sx={{ mt: 1 }}>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <TextField
                            autoFocus
                            fullWidth
                            type="number"
                            label="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            inputProps={{ min: 1, step: 1 }}
                            error={quantity !== "" && !isQuantityValid}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <TextField
                            fullWidth
                            type="number"
                            label="Unit Price"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                            inputProps={{ step: "0.01" }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">{settings.currency_symbol}</InputAdornment>
                            }}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <TextField
                            fullWidth
                            type="date"
                            label="Purchase Date"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <FormControl fullWidth>

                            <InputLabel>Supplier</InputLabel>

                            <Select
                                label="Supplier"
                                value={supplierId}
                                onChange={(e) => setSupplierId(e.target.value)}
                            >

                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {suppliers.map((supplier) => (

                                    <MenuItem
                                        key={supplier.id}
                                        value={supplier.id}
                                    >
                                        {supplier.name}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <TextField
                            fullWidth
                            label="Supplier Part Number"
                            value={supplierPartNumber}
                            onChange={(e) => setSupplierPartNumber(e.target.value)}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <TextField
                            fullWidth
                            label="Order Reference"
                            placeholder="Order/invoice number"
                            value={orderReference}
                            onChange={(e) => setOrderReference(e.target.value)}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!canSave}
                >
                    Log Purchase
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default PurchaseDialog;
