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

const emptyComponent = {

    part_number: "",
    part_name: "",
    description: "",

    manufacturer_id: "",
    category_id: "",
    location_id: "",

    manufacturer_part_number: "",
    supplier_part_number: "",

    package: "",
    footprint: "",
    component_value: "",

    quantity: 0,
    minimum_quantity: 0,

    datasheet_url: "",
    notes: ""

};

function ComponentDialog({

    open,

    mode = "add",

    component,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyComponent);

    useEffect(() => {

        if (!open)
            return;

        if (mode === "edit" && component) {

            setData(component);

        } else {

            setData(emptyComponent);

        }

    }, [open, mode, component]);

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
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>

                {mode === "edit"
                    ? "Edit Component"
                    : "Add Component"}

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Part Number"

                            name="part_number"

                            value={data.part_number}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Part Name"

                            name="part_name"

                            value={data.part_name}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField

                            fullWidth

                            label="Description"

                            name="description"

                            value={data.description}

                            onChange={handleChange}

                        />

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
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

export default ComponentDialog;