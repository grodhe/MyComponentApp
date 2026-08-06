import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button
} from "@mui/material";

const emptySupplier = {
    name: "",
    website: "",
    country: "",
    currency: "",
    notes: ""
};

function SupplierDialog({

    open,

    mode = "add",

    supplier,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptySupplier);

    useEffect(() => {

        if (!open)
            return;

        if (mode === "edit" && supplier) {
            setData(supplier);
        } else {
            setData(emptySupplier);
        }

    }, [open, mode, supplier]);

    function handleChange(event) {

        const { name, value } = event.target;

        setData({
            ...data,
            [name]: value
        });

    }

    function handleSave() {

        onSave(data);

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                {mode === "edit"
                    ? "Edit Supplier"
                    : "Add Supplier"}

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Website"
                            name="website"
                            value={data.website}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            value={data.country}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Currency"
                            name="currency"
                            value={data.currency}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Notes"
                            name="notes"
                            value={data.notes}
                            onChange={handleChange}
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
                >
                    {mode === "edit"
                        ? "Save"
                        : "Add"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default SupplierDialog;
