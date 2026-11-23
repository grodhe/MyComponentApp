import { useState } from "react";

import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    IconButton,
    Stack,
    Menu,
    MenuItem,
    Typography,
    Tooltip,
    useMediaQuery
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import MemoryIcon from "@mui/icons-material/Memory";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";

import PhotoThumbnail from "../common/PhotoThumbnail";
import { getComponentPhotoUrl } from "../../services/componentService";
import { getGenericItemPhotoUrl } from "../../services/genericItemService";

const NODE_ICONS = {
    location: FolderIcon,
    component: MemoryIcon,
    genericItem: Inventory2Icon
};

// A location's "+" button offers three things you might want to file
// inside it: another location (e.g. a drawer inside a cabinet), a
// component, or a generic item.
function AddMenu({ onAddSubLocation, onAddComponent, onAddGenericItem }) {

    const [anchorEl, setAnchorEl] = useState(null);

    function close() {
        setAnchorEl(null);
    }

    return (

        <>

            <Tooltip title="Add">
                <IconButton
                    onClick={(event) => {
                        event.stopPropagation();
                        setAnchorEl(event.currentTarget);
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={close}
                onClick={(event) => event.stopPropagation()}
            >

                <MenuItem onClick={() => { close(); onAddSubLocation(); }}>
                    Sub-Location
                </MenuItem>

                <MenuItem onClick={() => { close(); onAddComponent(); }}>
                    Component
                </MenuItem>

                <MenuItem onClick={() => { close(); onAddGenericItem(); }}>
                    Generic Item
                </MenuItem>

            </Menu>

        </>

    );

}

// Phone version of a row's action buttons: one "..." button opening a menu,
// so the name keeps the row's width instead of four icon buttons.
function MobileActions({ node, actions }) {

    const [anchorEl, setAnchorEl] = useState(null);

    let items = [];

    if (node.nodeType === "location") {

        items = [
            ["Print Label", () => actions.onPrintLocation(node.raw)],
            ["Add Sub-Location", () => actions.onAddSubLocation(node.raw)],
            ["Add Component", () => actions.onAddComponent(node.raw)],
            ["Add Generic Item", () => actions.onAddGenericItem(node.raw)],
            ["Edit", () => actions.onEditLocation(node.raw)],
            ["Delete", () => actions.onDeleteLocation(node.raw)]
        ];

    } else if (node.nodeType === "component") {

        items = [
            ["Edit", () => actions.onEditComponent(node.raw)],
            ["Delete", () => actions.onDeleteComponent(node.raw)]
        ];

    } else if (node.nodeType === "genericItem") {

        items = [
            ["Edit", () => actions.onEditGenericItem(node.raw)],
            ["Delete", () => actions.onDeleteGenericItem(node.raw)]
        ];

    }

    return (

        <>

            <IconButton
                onClick={(event) => {
                    event.stopPropagation();
                    setAnchorEl(event.currentTarget);
                }}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                onClick={(event) => event.stopPropagation()}
            >

                {items.map(([label, run]) => (

                    <MenuItem
                        key={label}
                        onClick={() => {
                            setAnchorEl(null);
                            run();
                        }}
                    >
                        {label}
                    </MenuItem>

                ))}

            </Menu>

        </>

    );

}

function LocationTreeNode({ node, depth, actions }) {

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    // Start collapsed -- with several cabinets/drawers this keeps the
    // page from opening as one long wall of every component in the
    // inventory. Click a row (or its chevron) to expand it.
    const [open, setOpen] = useState(false);

    const hasChildren = node.children.length > 0;
    const Icon = NODE_ICONS[node.nodeType] ?? FolderIcon;

    function handleRowClick() {

        if (node.nodeType === "location") {

            if (hasChildren) {
                setOpen(!open);
            }

        } else if (node.nodeType === "component") {

            actions.onOpenComponent(node.raw);

        } else if (node.nodeType === "genericItem") {

            actions.onEditGenericItem(node.raw);

        }

    }

    return (

        <>

            <ListItem
                disablePadding
                secondaryAction={

                    isMobile ? <MobileActions node={node} actions={actions} /> :

                    // Default (medium) size icon buttons -- these were
                    // "small" before and hard to make out/tap, especially
                    // the print icon. Row action bar's `pr` below is sized
                    // to fit up to 4 of these across.
                    <Stack
                        direction="row"
                        spacing={0.5}
                        onClick={(event) => event.stopPropagation()}
                    >

                        {node.nodeType === "location" && (

                            <>

                                <Tooltip title="Print Label">
                                    <IconButton
                                        onClick={() => actions.onPrintLocation(node.raw)}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                </Tooltip>

                                <AddMenu
                                    onAddSubLocation={() => actions.onAddSubLocation(node.raw)}
                                    onAddComponent={() => actions.onAddComponent(node.raw)}
                                    onAddGenericItem={() => actions.onAddGenericItem(node.raw)}
                                />

                                <Tooltip title="Edit">
                                    <IconButton
                                        onClick={() => actions.onEditLocation(node.raw)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <IconButton
                                        onClick={() => actions.onDeleteLocation(node.raw)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>

                            </>

                        )}

                        {node.nodeType === "component" && (

                            <>

                                <Tooltip title="Edit">
                                    <IconButton
                                        onClick={() => actions.onEditComponent(node.raw)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <IconButton
                                        onClick={() => actions.onDeleteComponent(node.raw)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>

                            </>

                        )}

                        {node.nodeType === "genericItem" && (

                            <>

                                <Tooltip title="Edit">
                                    <IconButton
                                        onClick={() => actions.onEditGenericItem(node.raw)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <IconButton
                                        onClick={() => actions.onDeleteGenericItem(node.raw)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>

                            </>

                        )}

                    </Stack>

                }
            >

                <ListItemButton
                    onClick={handleRowClick}
                    sx={{ pl: { xs: 0.5 + depth * 1.5, md: 1 + depth * 2.5 }, pr: { xs: 7, md: 22 } }}
                >

                    {node.nodeType === "location" && hasChildren ? (

                        <IconButton
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                setOpen(!open);
                            }}
                            sx={{ mr: 0.5 }}
                        >
                            {open
                                ? <ExpandMoreIcon fontSize="small" />
                                : <ChevronRightIcon fontSize="small" />}
                        </IconButton>

                    ) : (

                        <Box sx={{ width: 34, flexShrink: 0 }} />

                    )}

                    <ListItemIcon sx={{ minWidth: 32 }}>

                        {node.nodeType === "component" ? (

                            <PhotoThumbnail
                                src={getComponentPhotoUrl(node.raw.id, node.raw.updated_at)}
                                alt={node.name}
                                size={24}
                            />

                        ) : node.nodeType === "genericItem" ? (

                            <PhotoThumbnail
                                src={getGenericItemPhotoUrl(node.raw.id, node.raw.updated_at)}
                                alt={node.name}
                                size={24}
                            />

                        ) : (

                            <Icon
                                fontSize="small"
                                sx={{ color: node.nodeType === "location" ? "#FFCA28" : undefined }}
                            />

                        )}

                    </ListItemIcon>

                    <ListItemText
                        primary={node.name}
                        secondary={node.secondary}
                    />

                </ListItemButton>

            </ListItem>

            {hasChildren && (

                <Collapse in={open} timeout="auto" unmountOnExit>

                    <List component="div" disablePadding>

                        {node.children.map((child) => (

                            <LocationTreeNode
                                key={child.key}
                                node={child}
                                depth={depth + 1}
                                actions={actions}
                            />

                        ))}

                    </List>

                </Collapse>

            )}

        </>

    );

}

function LocationTree({ nodes, actions }) {

    if (!nodes || nodes.length === 0) {

        return (

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ p: 2 }}
            >
                No locations yet -- add one to get started.
            </Typography>

        );

    }

    return (

        <List
            component="nav"
            dense
            disablePadding
        >

            {nodes.map((node) => (

                <LocationTreeNode
                    key={node.key}
                    node={node}
                    depth={0}
                    actions={actions}
                />

            ))}

        </List>

    );

}

export default LocationTree;
