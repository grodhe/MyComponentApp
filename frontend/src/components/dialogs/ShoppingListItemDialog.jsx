import { useEffect, useState } from "react";

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

import { getComponents } from "../../services/componentService";

const emptyItem = {
    component_id: "",
    description: "",
    quantity_needed: 1,
    notes: ""
};

// `initialValues` lets other pages (Dashboard's low-stock rows, the BOM
// shortage action) open this pre-filled with a specific component and
// quantity already picked, so "add to shopping list" from those pages is
// a single click instead of a full form fill-out.
function ShoppingListItemDialog({ open, mode = "add", item, initialValues, onClose, onSave }) {

    const [data, setData] = useState(emptyItem);
    const [components, setComponents] = useState([]);

    useEffect(() => {

        if (!open)
            return;

        getComponents()
            .then(setComponents)
            .catch((err) => console.error("Failed to load components:", err));

        if (mode === "edit" && item) {

            setData({
                component_id: item.component_id ?? "",
                description: item.description ?? "",
                quantity_needed: item.quantity_needed ?? 1,
                notes: item.notes ?? ""
            });

        } else {

            setData({
                ...emptyItem,
                ...initialValues
            });

        }

    }, [open, mode, item, initialValues]);

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

    const hasComponent = !!data.component_id;
    const canSave = hasComponent || data.description.trim().length > 0;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                {mode === "edit" ? "Edit Shopping List Item" : "Add to Shopping List"}
            </DialogTitle>

            <DialogContent>

                <Grid container spacing={2} sx={{ mt: 1 }}>

                    <Grid size={12}>

                        <FormControl fullWidth>

                            <InputLabel>Component (optional)</InputLabel>

                            <Select
                                label="Component (optional)"
                                name="component_id"
                                value={data.component_id}
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    <em>None -- not in inventory yet</em>
                                </MenuItem>

                                {components.map((c) => (

                                    <MenuItem key={c.id} value={c.id}>
                                        {c.part_name ? `${c.part_number} — ${c.part_name}` : c.part_number}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    {!hasComponent && (

                        <Grid size={12}>

                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                placeholder="e.g. M3x10 screws"
                                value={data.description}
                                onChange={handleChange}
                                error={!canSave}
                                helperText={!canSave ? "Pick a component or type a description." : ""}
                            />

                        </Grid>

                    )}

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <TextField
                            fullWidth
                            type="number"
                            label="Quantity Needed"
                            name="quantity_needed"
                            value={data.quantity_needed}
                            onChange={handleChange}
                            inputProps={{ min: 1, step: 1 }}
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
                    disabled={!canSave}
                >
                    {mode === "edit" ? "Save" : "Add"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ShoppingListItemDialog;
