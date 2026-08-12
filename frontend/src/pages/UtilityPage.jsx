import { useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Button,
    Stack
} from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { getComponentsExportCsvUrl, importComponentsCsv } from "../services/componentService";
import { getProjectsExportCsvUrl, importProjectsCsv } from "../services/projectService";
import { getGenericItemsExportCsvUrl, importGenericItemsCsv } from "../services/genericItemService";

import ImportCsvDialog from "../components/dialogs/ImportCsvDialog";

// One card per entity that supports CSV import/export. Each card is just
// an Export button (a plain link to a backend endpoint that streams the
// file) and an Import button (opens ImportCsvDialog, pointed at that
// entity's own import function).
function CsvSection({ title, helperText, exportUrl, onImport }) {

    const [importOpen, setImportOpen] = useState(false);

    return (

        <Paper elevation={2} sx={{ p: 3, maxWidth: 640 }}>

            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {helperText}
            </Typography>

            <Stack direction="row" spacing={1.5}>

                <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => { window.location.href = exportUrl; }}
                >
                    Export CSV
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={() => setImportOpen(true)}
                >
                    Import CSV
                </Button>

            </Stack>

            <ImportCsvDialog

                open={importOpen}

                onClose={() => setImportOpen(false)}

                title={`Import ${title}`}

                helperText={helperText}

                onImport={onImport}

            />

        </Paper>

    );

}

function UtilityPage() {

    return (

        <Box>

            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Utility
            </Typography>

            <Stack spacing={3}>

                <CsvSection
                    title="Component Import / Export"
                    helperText={
                        'Export every component to a spreadsheet, edit it, and import it back to ' +
                        'bulk-update your inventory. Rows are matched by id (if present) or part ' +
                        'number, so importing an edited export updates existing components instead ' +
                        'of duplicating them. Manufacturer and Category names that don’t exist yet ' +
                        'are created automatically; Location is only matched, never created, so an ' +
                        'unmatched or ambiguous location is left blank and flagged in the result.'
                    }
                    exportUrl={getComponentsExportCsvUrl()}
                    onImport={importComponentsCsv}
                />

                <CsvSection
                    title="Project Import / Export"
                    helperText={
                        'Export every project to a spreadsheet, edit it, and import it back. Rows are ' +
                        'matched by id (if present) or project number. Status names that don’t ' +
                        'exist yet are created automatically; a row with no status is skipped, since ' +
                        'every project needs one.'
                    }
                    exportUrl={getProjectsExportCsvUrl()}
                    onImport={importProjectsCsv}
                />

                <CsvSection
                    title="Generic Item Import / Export"
                    helperText={
                        'Export every generic item to a spreadsheet, edit it, and import it back. Rows ' +
                        'are matched by id (if present) or name. Category and Supplier names that ' +
                        'don’t exist yet are created automatically; Location is only matched, ' +
                        'never created, so an unmatched or ambiguous location is left blank and ' +
                        'flagged in the result.'
                    }
                    exportUrl={getGenericItemsExportCsvUrl()}
                    onImport={importGenericItemsCsv}
                />

            </Stack>

        </Box>

    );

}

export default UtilityPage;
