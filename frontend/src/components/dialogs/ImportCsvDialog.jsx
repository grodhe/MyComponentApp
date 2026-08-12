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

// Generic CSV import dialog, reused for Components, Projects and Generic
// Items -- the upload flow (pick a .csv, read it as text in the browser,
// no multipart/form-data needed) and the result reporting (per-row
// errors/warnings) are the same regardless of which entity is being
// imported; only the title/helper text and the actual import call differ,
// so those are passed in as props.
function ImportCsvDialog({ open, onClose, onImported, title, helperText, onImport }) {

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
            const summary = await onImport(text);

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
                {title || "Import from CSV"}
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2} sx={{ mt: 1 }}>

                    {helperText && (

                        <Typography variant="body2" color="text.secondary">
                            {helperText}
                        </Typography>

                    )}

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
