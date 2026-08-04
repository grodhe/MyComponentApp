import { useEffect, useState } from "react";

import { getComponents } from "../services/componentService";

import DataTable from "../components/common/DataTable";

import CrudToolbar from "../components/common/CrudToolbar";

import ComponentDialog from "../components/dialogs/ComponentDialog";

function ComponentsPage() {

    const [components, setComponents] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedComponent, setSelectedComponent] = useState(null);
    
    const [dialogOpen, setDialogOpen] = useState(false);

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

         setDialogOpen(true);

    }

    function handleClose() {

       setDialogOpen(false);

    }
    function handleSave(component) {

       console.log(component);

       setDialogOpen(false);

    }
    
    function handleEdit(component) {

      if (!component)
        return;

      console.log(component);

       alert(`Edit ${component.part_number}`);

    }
   function handleDelete(component) {

	if (!component)
        return;
       alert(`Delete ${component.part_number}`);

   }


    const columns = [

        {
            field: "part_number",
            headerName: "Part Number",
            width: 170
        },

        {
            field: "part_name",
            headerName: "Part Name",
            flex: 2
        },

        {
            field: "description",
            headerName: "Description",
            flex: 2
        },

        {
            field: "manufacturer",
            headerName: "Manufacturer",
            width: 180
        },

        {
            field: "package",
            headerName: "Package",
            width: 120
        },

        {
            field: "component_value",
            headerName: "Value",
            width: 120
        },

        {
            field: "category",
            headerName: "Category",
            width: 140
        },

        {
            field: "location",
            headerName: "Location",
            width: 140
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

            (component.part_number ?? "").toLowerCase().includes(text) ||
            (component.part_name ?? "").toLowerCase().includes(text) ||
            (component.description ?? "").toLowerCase().includes(text) ||
            (component.manufacturer ?? "").toLowerCase().includes(text) ||
            (component.package ?? "").toLowerCase().includes(text) ||
            (component.component_value ?? "").toLowerCase().includes(text) ||
            (component.category ?? "").toLowerCase().includes(text) ||
            (component.location ?? "").toLowerCase().includes(text)

        );

    });

    return (

        <>

	<CrudToolbar

		title="Components"

		search={filter}

		onSearchChange={setFilter}

		addLabel="Add Component"

		onAdd={handleAdd}

		onEdit={() => handleEdit(selectedComponent)}

		editDisabled={!selectedComponent}

		onDelete={() => handleDelete(selectedComponent)}

		deleteDisabled={!selectedComponent}

	  />


          <DataTable

  	     rows={filteredComponents}

             columns={columns}

             onSelectionChange={setSelectedComponent}

             onRowDoubleClick={(params) => handleEdit(params.row)}

          />
	 <ComponentDialog

	    open={dialogOpen}

    	    mode="add"

	    component={null}

	    onClose={handleClose}

	    onSave={handleSave}

	/>

        </>

    );

}

   

export default ComponentsPage;