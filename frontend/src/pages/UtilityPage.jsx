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

import { getComponentsExportCsvUrl } from "../services/componentService";

import ImportCsvDialog from "../components/dialogs/ImportCsvDialog";

// Home for "maintain/migrate the inventory" tools that don't belong on any
// one data page -- currently just bulk CSV editing of components.
function UtilityPage() {

    const [importDialogOpen, setImportDialogOpen] = useState(false);

    function handleExportCsv() {

        window.location.href = getComponentsExportCsvUrl();

    }

    return (

        <Box>

            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Utility
            </Typography>

            <Stack spacing={3}>

                <Paper elevation={2} sx={{ p: 3, maxWidth: 640 }}>

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        CSV Import / Export
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Export every component to a spreadsheet, edit it, and import it
                        back to bulk-update your inventory. Rows are matched by id (if
                        present) or part number, so importing an edited export updates
                        existing components instead of duplicating them.
                    </Typography>

                    <Stack direction="row" spacing={1.5}>

                        <Button
                            variant="outlined"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleExportCsv}
                        >
                            Export CSV
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                            onClick={() => setImportDialogOpen(true)}
                        >
                            Import CSV
                        </Button>

                    </Stack>

                </Paper>

            </Stack>

            <ImportCsvDialog

                open={importDialogOpen}

                onClose={() => setImportDialogOpen(false)}

                onImported={() => {}}

            />

        </Box>

    );

}

export default UtilityPage;
