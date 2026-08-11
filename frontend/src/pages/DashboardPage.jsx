import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Stack
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { getComponents } from "../services/componentService";
import { getAllTransactions } from "../services/inventoryTransactionService";
import { getProjects } from "../services/projectService";

const RECENT_LIMIT = 8;

function StatCard({ label, value, color, icon }) {

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2
            }}
        >

            <Box
                sx={{
                    color: color ?? "primary.main",
                    display: "flex"
                }}
            >
                {icon}
            </Box>

            <Box>

                <Typography variant="h4" fontWeight="bold">
                    {value}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {label}
                </Typography>

            </Box>

        </Paper>

    );

}

// A section that's just a title + a scrollable list of clickable rows --
// used for every list on this page (low stock, out of stock, recently
// added/used, active projects) so they all look and behave the same way.
function ListSection({ title, items, emptyText, renderItem, maxHeight = 280 }) {

    return (

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>

            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>

            {items.length === 0 ? (

                <Typography color="text.secondary" variant="body2">
                    {emptyText}
                </Typography>

            ) : (

                <List
                    dense
                    disablePadding
                    sx={{
                        maxHeight,
                        overflowY: "auto"
                    }}
                >
                    {items.map(renderItem)}
                </List>

            )}

        </Paper>

    );

}

function DashboardPage() {

    const [components, setComponents] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [projects, setProjects] = useState([]);

    async function load() {

        try {

            const [componentsData, transactionsData, projectsData] = await Promise.all([
                getComponents(),
                getAllTransactions(),
                getProjects()
            ]);

            setComponents(componentsData);
            setTransactions(transactionsData);
            setProjects(projectsData);

        } catch (err) {

            console.error("Failed to load dashboard data:", err);

        }

    }

    useEffect(() => {

        load();

    }, []);

    // Out of stock and low stock are kept mutually exclusive -- an item at
    // 0 shows up as "out of stock" only, not double-counted as "low stock"
    // too.
    const outOfStockItems = components.filter((c) => (c.quantity ?? 0) === 0);

    const lowStockItems = components.filter((c) =>
        (c.quantity ?? 0) > 0
        && c.minimum_quantity > 0
        && c.quantity <= c.minimum_quantity
    );

    // Projects don't have a fixed status vocabulary (project_status is a
    // free-text lookup table you manage yourself), so "active" is defined
    // as "not marked completed" via completed_date, rather than matching a
    // specific status name that might not exist in your data.
    const activeProjects = projects.filter((p) => !p.completed_date);

    const recentlyAdded = components
        .slice()
        .filter((c) => c.created_at)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, RECENT_LIMIT);

    const recentlyUsed = transactions
        .filter((t) => t.quantity_delta < 0)
        .slice(0, RECENT_LIMIT);

    return (

        <Box>

            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Dashboard
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total Components"
                        value={components.length}
                        icon={<Inventory2Icon fontSize="large" />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Low Stock"
                        value={lowStockItems.length}
                        color="warning.main"
                        icon={<WarningAmberIcon fontSize="large" />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Out of Stock"
                        value={outOfStockItems.length}
                        color="error.main"
                        icon={<ErrorOutlineIcon fontSize="large" />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Active Projects"
                        value={activeProjects.length}
                        color="success.main"
                        icon={<FolderOpenIcon fontSize="large" />}
                    />
                </Grid>

            </Grid>

            <Grid container spacing={3}>

                <Grid size={{ xs: 12, md: 6 }}>

                    <ListSection
                        title={`Low Stock (${lowStockItems.length})`}
                        items={lowStockItems}
                        emptyText="Nothing is running low."
                        renderItem={(c) => (

                            <ListItemButton
                                key={c.id}
                                component={RouterLink}
                                to={`/components/${c.id}`}
                            >
                                <ListItemText
                                    primary={c.part_name ? `${c.part_number} — ${c.part_name}` : c.part_number}
                                    secondary={`Qty: ${c.quantity} (min ${c.minimum_quantity})`}
                                />
                            </ListItemButton>

                        )}
                    />

                    <ListSection
                        title={`Out of Stock (${outOfStockItems.length})`}
                        items={outOfStockItems}
                        emptyText="Nothing is out of stock."
                        renderItem={(c) => (

                            <ListItemButton
                                key={c.id}
                                component={RouterLink}
                                to={`/components/${c.id}`}
                            >
                                <ListItemText
                                    primary={c.part_name ? `${c.part_number} — ${c.part_name}` : c.part_number}
                                    secondary="Qty: 0"
                                />
                            </ListItemButton>

                        )}
                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <ListSection
                        title="Recently Added"
                        items={recentlyAdded}
                        emptyText="No components yet."
                        renderItem={(c) => (

                            <ListItemButton
                                key={c.id}
                                component={RouterLink}
                                to={`/components/${c.id}`}
                            >
                                <ListItemText
                                    primary={c.part_name ? `${c.part_number} — ${c.part_name}` : c.part_number}
                                    secondary={new Date(c.created_at).toLocaleDateString()}
                                />
                            </ListItemButton>

                        )}
                    />

                    <ListSection
                        title="Recently Used"
                        items={recentlyUsed}
                        emptyText="No stock has been used yet."
                        renderItem={(t) => (

                            <ListItemButton
                                key={t.id}
                                component={RouterLink}
                                to={`/components/${t.component_id}`}
                            >
                                <ListItemText
                                    primary={t.part_name ? `${t.part_number} — ${t.part_name}` : t.part_number}
                                    secondary={
                                        <Stack direction="row" spacing={1} component="span">
                                            <Box component="span" sx={{ color: "error.main", fontWeight: "bold" }}>
                                                {t.quantity_delta}
                                            </Box>
                                            <Box component="span">
                                                {t.reason} · {new Date(t.created_at).toLocaleDateString()}
                                            </Box>
                                        </Stack>
                                    }
                                />
                            </ListItemButton>

                        )}
                    />

                    <ListSection
                        title="Active Projects"
                        items={activeProjects}
                        emptyText="No active projects."
                        renderItem={(p) => (

                            <ListItemButton
                                key={p.id}
                                component={RouterLink}
                                to={`/projects/${p.id}`}
                            >
                                <ListItemText
                                    primary={p.project_name}
                                    secondary={p.status ? `${p.project_number} · ${p.status}` : p.project_number}
                                />
                            </ListItemButton>

                        )}
                    />

                </Grid>

            </Grid>

        </Box>

    );

}

export default DashboardPage;
