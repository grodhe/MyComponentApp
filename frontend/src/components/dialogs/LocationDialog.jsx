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

const emptyLocation = {
    name: "",
    description: ""
};

function LocationDialog({

    open,

    mode = "add",

    location,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyLocation);

    useEffect(() => {

        if (!open)
            return;

        if (mode === "edit" && location) {
            setData(location);
        } else {
            setData(emptyLocation);
        }

    }, [open, mode, location]);

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
                    ? "Edit Location"
                    : "Add Location"}

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
                            multiline
                            minRows={2}
                            label="Description"
                            name="description"
                            value={data.description}
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

export default LocationDialog;
