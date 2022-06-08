import React from 'react';
import { useCallback, useRef, useState } from 'react';
import { TextField } from "@material-ui/core";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
const Cell = ({ rowData }) => {
    const [rowNum, setRowNum] = useState(3);

    const defaultColDef = {
        resizable: true,
    };
    const gridRef = useRef();
    const onAddBtnClick = event => {
        setRowNum(rowNum.concat(<AgGridColumn field="1" sortable={true} filter={true} width={300} editable={true}></AgGridColumn>));
    };

    return (


        <div className="ag-theme-alpine" style={{ height: 600, width: 1200 }}>
            <AgGridReact
                paginationPageSize={10}
                rowData={rowData}
                pagination={true}
                defaultColDef={defaultColDef}
                ref={gridRef}
                className={'table-expedition'}
            >

                <AgGridColumn field="1" sortable={true} filter={true} width={300} editable={true}></AgGridColumn>
                <AgGridColumn field="2" sortable={true} filter={true} width={400} editable={true}></AgGridColumn>
                <AgGridColumn field="3" sortable={true} filter={true} width={400} editable={true}></AgGridColumn>
                <AgGridColumn field="4" sortable={true} filter={true} width={400} editable={true}></AgGridColumn>
            </AgGridReact>
        </div>

    );
}

export default Cell;