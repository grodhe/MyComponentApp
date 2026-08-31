import { useEffect, useState } from "react";

import { getManufacturers } from "../../services/manufacturerService";
import { getCategories } from "../../services/categoryService";
import { getLocations } from "../../services/locationService";
import { getSuppliers } from "../../services/supplierService";
import { getLocationPath } from "../../utils/locationTree";

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

	const emptyComponent = {

		part_number: "",
		part_name: "",
		description: "",

		manufacturer_id: "",
		category_id: "",
		location_id: "",
		supplier_id: "",

		manufacturer_part_number: "",

		package: "",
		footprint: "",
		component_value: "",

		supplier_part_number: "",
		purchase_price: "",

		quantity: 0,
		minimum_quantity: 0,

		datasheet_url: "",
		barcode: "",
		notes: ""

	};

	function ComponentDialog({

		open,

		mode = "add",

		component,

		// Prefills Location when adding a component from inside a
		// location's row in the Locations tree (e.g. its "+" menu).
		defaultLocationId = null,

		// Prefills Barcode when adding a component from the barcode-scan
		// dialog after a scan didn't match anything existing.
		defaultBarcode = null,

		onClose,

		onSave

	}) {

    const [data, setData] = useState(emptyComponent);
    const [manufacturers, setManufacturers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [suppliers, setSuppliers] = useState([]);


	useEffect(() => {

		if (!open)
			return;
		async function loadLookups() {

			try {

				const [

					manufacturers,

					categories,

					locations,

					suppliers

				] = await Promise.all([

					getManufacturers(),

					getCategories(),

					getLocations(),

					getSuppliers()

				]);

				setManufacturers(manufacturers);
				setCategories(categories);
				setLocations(locations);
				setSuppliers(suppliers);

			} catch (err) {

				console.error("Failed to load lookups:", err);

			}

		}

		if (mode === "edit" && component) {

			setData(component);

		} else {

			setData({
				...emptyComponent,
				location_id: defaultLocationId ?? "",
				barcode: defaultBarcode ?? ""
			});

		}

		loadLookups();

	}, [open, mode, component, defaultLocationId, defaultBarcode]);


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

            <Grid size={12}>

                <Divider sx={{ mt: 2, mb: 1 }}>

                    Classification

                </Divider>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

            <FormControl fullWidth>

                <InputLabel>Manufacturer</InputLabel>

                <Select
                    label="Manufacturer"
                    name="manufacturer_id"
                    value={data.manufacturer_id}
                    onChange={handleChange}
                >

                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>

                    {manufacturers.map((manufacturer) => (

                        <MenuItem
                            key={manufacturer.id}
                            value={manufacturer.id}
                        >
                            {manufacturer.name}
                        </MenuItem>

                    ))}

                </Select>

            </FormControl>

            </Grid>

        <Grid size={{ xs: 12, md: 6 }}>

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

        <Grid size={{ xs: 12, md: 6 }}>

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
                            {getLocationPath(locations, location.id)}
                        </MenuItem>

                    ))}

                </Select>

              </FormControl>
            </Grid>

        <Grid size={{ xs: 12, md: 6 }}>

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

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    label="Package"
                    name="package"
                    value={data.package}
                    onChange={handleChange}
                />

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    label="Footprint"
                    name="footprint"
                    value={data.footprint}
                    onChange={handleChange}
                />

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    label="Value"
                    name="component_value"
                    value={data.component_value}
                    onChange={handleChange}
                />

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    label="Manufacturer Part Number"
                    name="manufacturer_part_number"
                    value={data.manufacturer_part_number}
                    onChange={handleChange}
                />

            </Grid>

            <Grid size={12}>

                <Divider sx={{ mt: 2, mb: 1 }}>

                    Purchasing

                </Divider>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    label="Supplier Part Number"
                    name="supplier_part_number"
                    placeholder="The supplier's own SKU/part number"
                    value={data.supplier_part_number}
                    onChange={handleChange}
                />

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    type="number"
                    label="Purchase Price"
                    name="purchase_price"
                    placeholder="Unit price"
                    value={data.purchase_price}
                    onChange={handleChange}
                />

            </Grid>

            <Grid size={12}>

                <Divider sx={{ mt: 2, mb: 1 }}>

                    Inventory

                </Divider>

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
                    label="Datasheet URL"
                    name="datasheet_url"
                    value={data.datasheet_url}
                    onChange={handleChange}
                />

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                    fullWidth
                    label="Barcode"
                    name="barcode"
                    placeholder="Scan or type a barcode"
                    value={data.barcode}
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