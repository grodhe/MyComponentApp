import { useEffect, useRef, useState } from "react";

import { getCategories } from "../../services/categoryService";
import { getLocations } from "../../services/locationService";
import { getSuppliers } from "../../services/supplierService";
import { getLocationPath } from "../../utils/locationTree";
import {
    getGenericItemPhotoUrl,
    uploadGenericItemPhoto,
    deleteGenericItemPhoto
} from "../../services/genericItemService";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Stack,

    Grid,

    TextField,

    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,

    Button

} from "@mui/material";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

// Shows the item's photo if one's been uploaded, a placeholder icon if
// not, and Upload/Change/Remove controls beside it. Only rendered in edit
// mode, since an item needs to already exist (have an id) before a photo
// can be attached to it.
//
// Unlike ComponentDetailPage, this dialog doesn't reload the item from
// the server after a photo change, so a local "version" counter is used
// to bust the browser's image cache instead of the item's real
// updated_at timestamp -- it just needs to change, not be meaningful.
function GenericItemPhoto({ itemId }) {

    const [photoOk, setPhotoOk] = useState(true);
    const [version, setVersion] = useState(() => Date.now());
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Re-arm optimism whenever the dialog opens for this item, so a
    // photo deleted elsewhere (another tab, another session) doesn't
    // keep showing here as if it still existed.
    useEffect(() => {

        setPhotoOk(true);
        setVersion(Date.now());

    }, [itemId]);

    async function handleFileChange(event) {

        const file = event.target.files?.[0];

        // Allows re-selecting the exact same filename later (e.g. after
        // removing a photo and wanting to re-upload it) -- browsers don't
        // fire onChange again for an unchanged file list otherwise.
        event.target.value = "";

        if (!file)
            return;

        setUploading(true);

        try {

            await uploadGenericItemPhoto(itemId, file);
            setPhotoOk(true);
            setVersion(Date.now());

        } catch (err) {

            console.error("Failed to upload photo:", err);
            alert(`Failed to upload photo: ${err.message}`);

        } finally {

            setUploading(false);

        }

    }

    async function handleRemove() {

        try {

            await deleteGenericItemPhoto(itemId);
            setPhotoOk(false);

        } catch (err) {

            console.error("Failed to remove photo:", err);
            alert(`Failed to remove photo: ${err.message}`);

        }

    }

    const photoUrl = getGenericItemPhotoUrl(itemId, version);

    return (

        <Stack direction="row" spacing={2} alignItems="center">

            <Box
                sx={{
                    width: 100,
                    height: 90,
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0
                }}
            >

                {photoOk ? (

                    <Box
                        component="img"
                        src={photoUrl}
                        alt=""
                        onError={() => setPhotoOk(false)}
                        sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />

                ) : (

                    <ImageNotSupportedIcon color="disabled" />

                )}

            </Box>

            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <Stack direction="row" spacing={1}>

                <Button
                    size="small"
                    startIcon={<AddAPhotoIcon fontSize="small" />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {photoOk ? "Change Photo" : "Upload Photo"}
                </Button>

                {photoOk && (

                    <Button
                        size="small"
                        color="error"
                        onClick={handleRemove}
                        disabled={uploading}
                    >
                        Remove
                    </Button>

                )}

            </Stack>

        </Stack>

    );

}

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
    barcode: "",
    notes: ""

};

function GenericItemDialog({

    open,

    mode = "add",

    item,

    // Prefills Location when adding an item from inside a location's row
    // in the Locations tree (e.g. its "+" menu).
    defaultLocationId = null,

    // Prefills Barcode when adding an item from the barcode-scan dialog
    // after a scan didn't match anything existing.
    defaultBarcode = null,

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

            setData({
                ...emptyItem,
                location_id: defaultLocationId ?? "",
                barcode: defaultBarcode ?? ""
            });

        }

        loadLookups();

    }, [open, mode, item, defaultLocationId, defaultBarcode]);

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

                    {mode === "edit" && data.id && (

                        <Grid size={12}>
                            <GenericItemPhoto itemId={data.id} />
                        </Grid>

                    )}

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
                                        {getLocationPath(locations, location.id)}
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
