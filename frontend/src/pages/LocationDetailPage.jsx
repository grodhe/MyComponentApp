import { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";

import {
    Box,
    Stack,
    Typography,
    Divider,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Link
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import MemoryIcon from "@mui/icons-material/Memory";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { getLocations, getLocationContents, updateLocation } from "../services/locationService";
import LocationDialog from "../components/dialogs/LocationDialog";

// The page a scanned drawer/cabinet QR code lands on -- shows what's
// directly stored there and lets you drill into sub-locations, mirroring
// the Locations tree but as a standalone page reachable by URL (so it also
// works from a phone that just scanned a label, with no app state loaded).
function LocationDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [contents, setContents] = useState(null);
    const [childLocations, setChildLocations] = useState([]);
    const [editOpen, setEditOpen] = useState(false);

    async function load() {

        try {

            const [contentsResult, allLocations] = await Promise.all([
                getLocationContents(id),
                getLocations()
            ]);

            setContents(contentsResult);

            setChildLocations(
                allLocations.filter((loc) => String(loc.parent_id) === String(id))
            );

        } catch (err) {

            console.error("Failed to load location:", err);

        }

    }

    useEffect(() => {

        load();

    }, [id]);

    async function handleSaveEdit(data) {

        try {

            await updateLocation(id, data);
            setEditOpen(false);
            await load();

        } catch (err) {

            console.error("Failed to save location:", err);
            alert(`Failed to save location: ${err.message}`);

        }

    }

    if (!contents)
        return null;

    const { location, components, genericItems } = contents;

    const isEmpty = childLocations.length === 0
        && components.length === 0
        && genericItems.length === 0;

    return (

        <Box>

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/locations")}
                sx={{ mb: 2 }}
            >
                Back to Locations
            </Button>

            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {location.name}
            </Typography>

            {location.parent_name && (

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    Inside{" "}
                    <Link
                        component={RouterLink}
                        to={`/location/${location.parent_id}`}
                    >
                        {location.parent_name}
                    </Link>
                </Typography>

            )}

            {location.description && (

                <Typography sx={{ mb: 3 }}>
                    {location.description}
                </Typography>

            )}

            <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditOpen(true)}
                sx={{ mb: 3 }}
            >
                Edit
            </Button>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>
                Stored here
            </Typography>

            {isEmpty && (

                <Typography color="text.secondary">
                    Nothing filed here yet.
                </Typography>

            )}

            <List dense>

                {childLocations.map((loc) => (

                    <ListItemButton
                        key={`location-${loc.id}`}
                        component={RouterLink}
                        to={`/location/${loc.id}`}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <FolderIcon fontSize="small" sx={{ color: "#FFCA28" }} />
                        </ListItemIcon>
                        <ListItemText primary={loc.name} />
                    </ListItemButton>

                ))}

                {components.map((component) => (

                    <ListItemButton
                        key={`component-${component.id}`}
                        component={RouterLink}
                        to={`/components/${component.id}`}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <MemoryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={`${component.part_number}${component.part_name ? ` — ${component.part_name}` : ""}`}
                            secondary={`Qty: ${component.quantity}`}
                        />
                    </ListItemButton>

                ))}

                {genericItems.map((item) => (

                    <ListItem key={`item-${item.id}`}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <Inventory2Icon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={item.name}
                            secondary={`Qty: ${item.quantity} ${item.unit ?? ""}`.trim()}
                        />
                    </ListItem>

                ))}

            </List>

            <LocationDialog
                open={editOpen}
                mode="edit"
                location={location}
                onClose={() => setEditOpen(false)}
                onSave={handleSaveEdit}
            />

        </Box>

    );

}

export default LocationDetailPage;
