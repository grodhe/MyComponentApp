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

const emptyManufacturer = {
    name: "",
    website: "",
    notes: ""
};

function ManufacturerDialog({

    open,

    mode = "add",

    manufacturer,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyManufacturer);

    useEffect(() => {

        if (!open)
            return;

        if (mode === "edit" && manufacturer) {
            setData(manufacturer);
        } else {
            setData(emptyManufacturer);
        }

    }, [open, mode, manufacturer]);

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
                    ? "Edit Manufacturer"
                    : "Add Manufacturer"}

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

export default ManufacturerDialog;
