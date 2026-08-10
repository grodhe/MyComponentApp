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

import { getLocations } from "../../services/locationService";
import { getDescendantIds, getLocationPath } from "../../utils/locationTree";

const emptyLocation = {
    name: "",
    description: "",
    parent_id: ""
};

function LocationDialog({

    open,

    mode = "add",

    location,

    // Preselects the parent when adding a new location from inside a
    // parent's detail view (e.g. "Add Sub-Location" on Cabinet A).
    defaultParentId = null,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyLocation);
    const [allLocations, setAllLocations] = useState([]);

    useEffect(() => {

        if (!open)
            return;

        async function loadLocations() {

            try {

                const locations = await getLocations();
                setAllLocations(locations);

            } catch (err) {

                console.error("Failed to load locations:", err);

            }

        }

        if (mode === "edit" && location) {
            setData({ ...emptyLocation, ...location });
        } else {
            setData({ ...emptyLocation, parent_id: defaultParentId ?? "" });
        }

        loadLocations();

    }, [open, mode, location, defaultParentId]);

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

    // A location can't become its own parent, and can't become the parent
    // of one of its own descendants either (that would create a cycle).
    const excludedIds = mode === "edit" && location
        ? new Set([location.id, ...getDescendantIds(allLocations, location.id)])
        : new Set();

    const parentOptions = allLocations.filter((loc) => !excludedIds.has(loc.id));

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

                        <FormControl fullWidth>

                            <InputLabel>Parent Location</InputLabel>

                            <Select
                                label="Parent Location"
                                name="parent_id"
                                value={data.parent_id ?? ""}
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    <em>None (top-level)</em>
                                </MenuItem>

                                {parentOptions.map((loc) => (

                                    <MenuItem
                                        key={loc.id}
                                        value={loc.id}
                                    >
                                        {getLocationPath(allLocations, loc.id)}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

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
