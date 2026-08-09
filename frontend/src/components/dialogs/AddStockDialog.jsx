import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@mui/material";

// Small dialog asking how many units to add to a component's stock. The
// caller owns the actual update -- this just collects the amount.
function AddStockDialog({ open, onClose, onConfirm }) {

    const [amount, setAmount] = useState(1);

    useEffect(() => {

        if (open) {
            setAmount(1);
        }

    }, [open]);

    function handleConfirm() {

        const parsed = Number(amount);

        if (!Number.isFinite(parsed) || parsed <= 0)
            return;

        onConfirm(parsed);

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>
                Add Stock
            </DialogTitle>

            <DialogContent>

                <TextField
                    autoFocus
                    fullWidth
                    type="number"
                    label="Quantity to add"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputProps={{ min: 1, step: 1 }}
                    sx={{ mt: 1 }}
                />

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleConfirm}
                >
                    Add
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default AddStockDialog;
