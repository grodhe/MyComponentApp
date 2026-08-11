import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack
} from "@mui/material";

// Shared dialog for both "Use Stock" and "Add Stock" -- either way, we
// need an amount and a reason before the change happens, so it gets
// recorded as a proper transaction instead of quantity just silently
// changing. `mode` only affects the title/labels/sign of the change;
// `onConfirm(amount, reason)` always receives a positive amount, and the
// caller decides whether that's added or subtracted.
function StockAdjustDialog({ open, mode = "use", onClose, onConfirm }) {

    const [amount, setAmount] = useState(1);
    const [reason, setReason] = useState("");

    useEffect(() => {

        if (open) {
            setAmount(1);
            setReason("");
        }

    }, [open]);

    const parsedAmount = Number(amount);
    const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0 && Number.isInteger(parsedAmount);
    const isReasonValid = reason.trim().length > 0;
    const canConfirm = isAmountValid && isReasonValid;

    function handleConfirm() {

        if (!canConfirm)
            return;

        onConfirm(parsedAmount, reason.trim());

    }

    const isUse = mode === "use";

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>
                {isUse ? "Use Stock" : "Add Stock"}
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2} sx={{ mt: 1 }}>

                    <TextField
                        autoFocus
                        fullWidth
                        type="number"
                        label={isUse ? "Quantity to use" : "Quantity to add"}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        inputProps={{ min: 1, step: 1 }}
                    />

                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Reason"
                        placeholder={isUse ? "e.g. Matter Gateway" : "e.g. Restocked from supplier"}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        error={reason.length > 0 && !isReasonValid}
                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                >
                    {isUse ? "Use" : "Add"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default StockAdjustDialog;
