import { useEffect, useState } from "react";
import { getComponents } from "../services/components";

import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";

function Components() {

    const [components, setComponents] = useState([]);

    useEffect(() => {

        async function load() {

            try {

                const data = await getComponents();
                setComponents(data);

            } catch (err) {

                console.error("Failed to load components:", err);

            }

        }

        load();

    }, []);

    return (

        <>

            <Typography
                variant="h4"
                gutterBottom
            >
                Components
            </Typography>

            <Paper>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>Part Number</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Manufacturer</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell align="right">Qty</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {components.map((component) => (

                            <TableRow
                                key={component.id}
                                hover
                            >

                                <TableCell>{component.part_number}</TableCell>
                                <TableCell>{component.description}</TableCell>
                                <TableCell>{component.manufacturer}</TableCell>
                                <TableCell>{component.category}</TableCell>
                                <TableCell>{component.location}</TableCell>
                                <TableCell align="right">{component.quantity}</TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </Paper>

        </>

    );

}

export default Components;