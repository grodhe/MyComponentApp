import { useEffect, useState } from "react";

import { getComponents } from "../../services/componentService";
import { getGenericItems } from "../../services/genericItemService";

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
    ToggleButton,
    ToggleButtonGroup,
    Button
} from "@mui/material";

const emptyPart = {
    part_type: "component",
    component_id: "",
    generic_item_id: "",
    quantity: 1,
    reference_designators: "",
    notes: ""
};

// `entry` (when editing) is one of the merged rows built by ProjectPartsTab,
// tagged with `_partType` ("component" | "generic") so we know which picker
// and which fields to show.
function PartDialog({

    open,

    mode = "add",

    entry,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyPart);
    const [components, setComponents] = useState([]);
    const [genericItems, setGenericItems] = useState([]);

    useEffect(() => {

        if (!open)
            return;

        async function loadOptions() {

            try {

                const [componentsResult, genericItemsResult] = await Promise.all([
                    getComponents(),
                    getGenericItems()
                ]);

                setComponents(componentsResult);
                setGenericItems(genericItemsResult);

            } catch (err) {

                console.error("Failed to load part options:", err);

            }

        }

        if (mode === "edit" && entry) {

            setData({
                part_type: entry._partType,
                component_id: entry._partType === "component" ? entry.component_id : "",
                generic_item_id: entry._partType === "generic" ? entry.generic_item_id : "",
                quantity: entry.quantity,
                reference_designators: entry.reference_designators ?? "",
                notes: entry.notes ?? ""
            });

        } else {

            setData(emptyPart);

        }

        loadOptions();

    }, [open, mode, entry]);

    function handleChange(event) {

        const { name, value } = event.target;

        setData({
            ...data,
            [name]: value
        });

    }

    function handleTypeChange(event, newType) {

        if (!newType)
            return;

        setData({
            ...data,
            part_type: newType,
            component_id: "",
            generic_item_id: ""
        });

    }

    function handleSave() {

        onSave(data);

    }

    const isComponent = data.part_type === "component";

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                {mode === "edit"
                    ? "Edit Part"
                    : "Add Part"}

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={12}>

                        <ToggleButtonGroup
                            exclusive
                            fullWidth
                            value={data.part_type}
                            onChange={handleTypeChange}
                            disabled={mode === "edit"}
                        >

                            <ToggleButton value="component">
                                Component
                            </ToggleButton>

                            <ToggleButton value="generic">
                                Generic Item
                            </ToggleButton>

                        </ToggleButtonGroup>

                    </Grid>

                    {isComponent ? (

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

                    ) : (

                        <Grid size={12}>

                            <FormControl fullWidth required>

                                <InputLabel>Generic Item</InputLabel>

                                <Select
                                    label="Generic Item"
                                    name="generic_item_id"
                                    value={data.generic_item_id}
                                    onChange={handleChange}
                                >

                                    {genericItems.map((item) => (

                                        <MenuItem
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>

                        </Grid>

                    )}

                    <Grid size={{ xs: 12, md: isComponent ? 6 : 12 }}>

                        <TextField
                            fullWidth
                            type="number"
                            label="Quantity"
                            name="quantity"
                            value={data.quantity}
                            onChange={handleChange}
                        />

                    </Grid>

                    {isComponent && (

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

                    )}

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

export default PartDialog;
