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

const emptyDocument = {
    document_name: "",
    document_type: "",
    file_name: "",
    notes: ""
};

function ProjectDocumentDialog({

    open,

    mode = "add",

    document,

    onClose,

    onSave

}) {

    const [data, setData] = useState(emptyDocument);

    useEffect(() => {

        if (!open)
            return;

        if (mode === "edit" && document) {
            setData(document);
        } else {
            setData(emptyDocument);
        }

    }, [open, mode, document]);

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
                    ? "Edit Document"
                    : "Add Document"}

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
                            label="Document Name"
                            name="document_name"
                            value={data.document_name}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Document Type"
                            name="document_type"
                            placeholder="e.g. Schematic, Datasheet, BOM"
                            value={data.document_type}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="File Name"
                            name="file_name"
                            placeholder="e.g. schematic_v2.pdf"
                            value={data.file_name}
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

export default ProjectDocumentDialog;
