import { useEffect, useState } from "react";

import { getComponents } from "../services/componentService";

import DataTable from "../components/common/DataTable";
import PageToolbar from "../components/common/PageToolbar";

function ComponentsPage() {

    const [components, setComponents] = useState([]);
    const [filter, setFilter] = useState("");

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

    function handleAdd() {

        alert("Add Component dialog will be implemented next.");

    }

    const columns = [

        {
            field: "part_number",
            headerName: "Part Number",
            flex: 1
        },
	{
            field: "part_name",
            headerName: "Part Name",
            flex: 1.5
        },

        {
            field: "description",
            headerName: "Description",
            flex: 2
        },

        {
            field: "manufacturer",
            headerName: "Manufacturer",
            flex: 1
        },

        {
            field: "category",
            headerName: "Category",
            flex: 1
        },

        {
            field: "location",
            headerName: "Location",
            flex: 1
        },

        {
            field: "quantity",
            headerName: "Qty",
            type: "number",
            width: 90
        }

    ];

    const filteredComponents = components.filter(component => {

        const text = filter.toLowerCase();

        return (

            component.part_number.toLowerCase().includes(text) ||
            component.part_name.toLowerCase().includes(text) ||
            component.description.toLowerCase().includes(text) ||
            component.manufacturer.toLowerCase().includes(text) ||
            component.category.toLowerCase().includes(text) ||
            component.location.toLowerCase().includes(text)

        );

    });

    return (

        <>

            <PageToolbar

                title="Components"

                search={filter}

                onSearchChange={setFilter}

                addLabel="Add Component"

                onAdd={handleAdd}

            />

            <DataTable

                rows={filteredComponents}

                columns={columns}

            />

        </>

    );

}

export default ComponentsPage;