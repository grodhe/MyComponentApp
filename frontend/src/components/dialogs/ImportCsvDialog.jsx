import { useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    Box,
    Alert,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";

import { importComponentsCsv } from "../../services/componentService";

// Upload flow: pick a .csv file, read it as text in the browser (no
// multipart/form-data needed -- it's just sent as a JSON string, same as
// every other request this app makes), then show a summary of what
// happened. Errors are per-row, so one bad row doesn't block the rest of
// the file, and warnings flag things like an auto-created manufacturer or
// a location that couldn't be matched.
function ImportCsvDialog({ open, onClose, onImported }) {

    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    function handleClose() {

        if (importing)
            return;

        setFile(null);
        setResult(null);
        setError("");
        onClose();

    }

    function handleFileChange(event) {

        setResult(null);
        setError("");
        setFile(event.target.files?.[0] ?? null);

    }

    async function handleImport() {

        if (!file)
            return;

        setImporting(true);
        setError("");
        setResult(null);

        try {

            const text = await file.text();
            const summary = await importComponentsCsv(text);

            setResult(summary);

            if (onImported)
                onImported();

        } catch (err) {

            console.error("CSV import failed:", err);
            setError(err.message || "Import failed.");

        } finally {

            setImporting(false);

        }

    }

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                Import Components from CSV
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2} sx={{ mt: 1 }}>

                    <Typography variant="body2" color="text.secondary">
                        Rows are matched to existing components by their <strong>id</strong> column
                        if present, otherwise by <strong>part_number</strong> -- a match updates that
                        component, anything else is added as new. Manufacturer and Category names
                        that don't exist yet are created automatically; Location names are only
                        matched, never created (since locations can be nested), so an unmatched or
                        ambiguous location is left blank and flagged below.
                    </Typography>

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        disabled={importing}
                    >
                        {file ? file.name : "Choose CSV File"}
                        <input
                            type="file"
                            accept=".csv,text/csv"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>

                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    {result && (

                        <Stack spacing={1.5}>

                            <Alert severity={result.errors.length > 0 ? "warning" : "success"}>
                                {result.created} created, {result.updated} updated
                                {result.errors.length > 0 && `, ${result.errors.length} row(s) skipped with errors`}.
                            </Alert>

                            {result.errors.length > 0 && (

                                <Box>

                                    <Typography variant="subtitle2" color="error">
                                        Errors
                                    </Typography>

                                    <List dense sx={{ maxHeight: 160, overflowY: "auto" }}>

                                        {result.errors.map((e, idx) => (

                                            <ListItem key={idx} disableGutters>
                                                <ListItemText
                                                    primary={`Row ${e.row}: ${e.message}`}
                                                />
                                            </ListItem>

                                        ))}

                                    </List>

                                </Box>

                            )}

                            {result.warnings.length > 0 && (

                                <Box>

                                    <Typography variant="subtitle2" color="text.secondary">
                                        Warnings
                                    </Typography>

                                    <List dense sx={{ maxHeight: 160, overflowY: "auto" }}>

                                        {result.warnings.map((w, idx) => (

                                            <ListItem key={idx} disableGutters>
                                                <ListItemText
                                                    primary={`Row ${w.row}: ${w.message}`}
                                                />
                                            </ListItem>

                                        ))}

                                    </List>

                                </Box>

                            )}

                        </Stack>

                    )}

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button onClick={handleClose} disabled={importing}>
                    {result ? "Close" : "Cancel"}
                </Button>

                <Button
                    variant="contained"
                    onClick={handleImport}
                    disabled={!file || importing}
                    startIcon={importing ? <CircularProgress size={16} /> : null}
                >
                    {importing ? "Importing..." : "Import"}
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ImportCsvDialog;
