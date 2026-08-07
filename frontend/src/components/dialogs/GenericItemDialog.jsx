import { useEffect, useState } from "react";

import { getCategories } from "../../services/categoryService";
import { getLocations } from "../../services/locationService";
import { getSuppliers } from "../../services/supplierService";

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
    Divider,

    Button

} from "@mui/material";

const emptyItem = {

    name: "",
    description: "",

    category_id: "",
    location_id: "",
    supplier_id: "",

    part_number: "",
    unit: "pcs",

    quantity: 0,
    minimum_quantity: 0,

    reference_url: "",
    notes: ""

};

function GenericItemDialog({

    open,

    mode = "add",

    item,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyItem);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {

        if (!open)
            return;

        async function loadLookups() {

            try {

                const [

                    categoriesResult,
                    locationsResult,
                    suppliersResult

                ] = await Promise.all([

                    getCategories(),
                    getLocations(),
                    getSuppliers()

                ]);

                setCategories(categoriesResult);
                setLocations(locationsResult);
                setSuppliers(suppliersResult);

            } catch (err) {

                console.error("Failed to load lookups:", err);

            }

        }

        if (mode === "edit" && item) {

            setData(item);

        } else {

            setData(emptyItem);

        }

        loadLookups();

    }, [open, mode, item]);

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
                    ? "Edit Generic Item"
                    : "Add Generic Item"}

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
                            label="Description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>
                        <Divider sx={{ mt: 2, mb: 1 }}>
                            Classification
                        </Divider>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <FormControl fullWidth>

                            <InputLabel>Category</InputLabel>

                            <Select
                                label="Category"
                                name="category_id"
                                value={data.category_id}
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {categories.map((category) => (

                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <FormControl fullWidth>

                            <InputLabel>Location</InputLabel>

                            <Select
                                label="Location"
                                name="location_id"
                                value={data.location_id}
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {locations.map((location) => (

                                    <MenuItem
                                        key={location.id}
                                        value={location.id}
                                    >
                                        {location.name}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <FormControl fullWidth>

                            <InputLabel>Supplier</InputLabel>

                            <Select
                                label="Supplier"
                                name="supplier_id"
                                value={data.supplier_id}
                                onChange={handleChange}
                            >

                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {suppliers.map((supplier) => (

                                    <MenuItem
                                        key={supplier.id}
                                        value={supplier.id}
                                    >
                                        {supplier.name}
                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={12}>
                        <Divider sx={{ mt: 2, mb: 1 }}>
                            Inventory
                        </Divider>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <TextField
                            fullWidth
                            label="Part / SKU Number"
                            name="part_number"
                            value={data.part_number}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>

                        <TextField
                            fullWidth
                            label="Unit"
                            name="unit"
                            placeholder="pcs, m, g..."
                            value={data.unit}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField
                            fullWidth
                            type="number"
                            label="Quantity"
                            name="quantity"
                            value={data.quantity}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField
                            fullWidth
                            type="number"
                            label="Minimum Quantity"
                            name="minimum_quantity"
                            value={data.minimum_quantity}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={12}>
                        <Divider sx={{ mt: 2, mb: 1 }}>
                            Additional Info
                        </Divider>
                    </Grid>

                    <Grid size={12}>

                        <TextField
                            fullWidth
                            label="Reference URL"
                            name="reference_url"
                            placeholder="Product page, datasheet, etc."
                            value={data.reference_url}
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

export default GenericItemDialog;
