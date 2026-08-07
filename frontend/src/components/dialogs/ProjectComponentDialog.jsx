import { useEffect, useState } from "react";

import { getComponents } from "../../services/componentService";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from "@mui/material";

const emptyEntry = {
    component_id: "",
    quantity: 1,
    reference_designators: "",
    notes: ""
};

function ProjectComponentDialog({

    open,

    mode = "add",

    entry,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyEntry);
    const [components, setComponents] = useState([]);

    useEffect(() => {

        if (!open)
            return;

        async function loadComponents() {

            try {

                const result = await getComponents();
                setComponents(result);

            } catch (err) {

                console.error("Failed to load components:", err);

            }

        }

        if (mode === "edit" && entry) {
            setData(entry);
        } else {
            setData(emptyEntry);
        }

        loadComponents();

    }, [open, mode, entry]);

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
                    ? "Edit Component"
                    : "Add Component"}

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={12}>

                        <FormControl fullWidth required>

                            <InputLabel>Component</InputLabel>

                            <Select
                                label="Component"
                                name="component_id"
                                value={data.component_id}
                                onChange={handleChange}
                            >

                                {components.map((component) => (

                                    <MenuItem
                                        key={component.id}
                                        value={component.id}
                                    >
                                        {component.part_number} - {component.part_name}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            type="number"
                            label="Quantity"
                            name="quantity"
                            value={data.quantity}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Reference Designators"
                            name="reference_designators"
                            placeholder="e.g. R1, R2, R5-R8"
                            value={data.reference_designators}
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

export default ProjectComponentDialog;
