const API_URL = import.meta.env.VITE_API_URL;

// Same pattern as getComponentsExportCsvUrl() -- opened directly by the
// browser rather than fetched, so the Content-Disposition header on the
// response triggers a normal file download.
export function getBackupUrl() {

    return `${API_URL}/backup`;

}
