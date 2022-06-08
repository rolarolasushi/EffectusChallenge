/* eslint-disable */
import React from 'react';
import { useCallback, useRef, useState } from 'react';
import { TextField } from "@material-ui/core";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
const Grid = () => {
    const [rowNum, setRowNum] = useState(0);
    const [rows, setRows] = useState([]);
    const [colDefsMedalsExcluded, setColDefsMedalsExcluded] = useState([
        { field: '1' },
        { field: '2' },
        { field: '3' },
    ]);
    const gridRef = useRef();
    // const [rowData, setRowData] = useState([
    //     { 1: 'Gonzalez, Juan J.', 2: '84612323', 3: "Arevalo 1889, CABA", },
    //     { 1: 'Ruperto, Jorge', 2: 'CONT0100HRC000232357234', 3: "Av. Cordoba 1325, Munro, Buenos Aires" },
    //     { 1: 'Mondino, Gabriela M.', 2: '61132523', 3: "Puerto Principe 583, Florida, Buenos Aires" },
    //     { 1: 'Gonzalez, Juan J.', 2: '84612323', 3: "Arevalo 1889, CABA" },
    //     { 1: 'Ruperto, Jorge', 2: 'CONT0100HRC000232357234', 3: "Av. Cordoba 1325, Munro, Buenos Aires" },
    // ])
    const rowData = [
        { 1: 'Gonzalez, Juan J.', 2: '84612323', 3: "Arevalo 1889, CABA", },
        { 1: 'Ruperto, Jorge', 2: 'CONT0100HRC000232357234', 3: "Av. Cordoba 1325, Munro, Buenos Aires" },
        { 1: 'Mondino, Gabriela M.', 2: '61132523', 3: "Puerto Principe 583, Florida, Buenos Aires" },
        { 1: 'Gonzalez, Juan J.', 2: '84612323', 3: "Arevalo 1889, CABA" },
        { 1: 'Ruperto, Jorge', 2: 'CONT0100HRC000232357234', 3: "Av. Cordoba 1325, Munro, Buenos Aires" },
    ]
    const defaultColDef = {
        resizable: true,
    };
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    const addRow2 = () => {
        gridRef.current.api.setColumnDefs(colDefsMedalsExcluded);
    };

    const addRow = () => {
        let rowTotal = rowNum + 1;
        setRowNum(rowTotal);
        for (var i = rowNum; i < rowTotal; i++) {
            i++;
            colDefsMedalsExcluded.push({ field: i.toString() })
        }
        addRow2()
    }

    const onAddBtnClick = event => {
        let rowTotal = rowNum + 1;
        setRows(rows.concat(<AgGridColumn field={rowTotal.toString()} sortable={true} filter={true} width={300} editable={true}></AgGridColumn>));
        setRowNum(rowTotal);
    };
    const onDeleteBtnClick = event => {
        let rowTotal = rowNum - 1;
        rows.pop()
        setRowNum(rowTotal);
    };


    return (
        <div className="ag-theme-balham">

            <div className="example-wrapper gridFilterContent">
                <div className="example-header gridFilter">
                    <TextField
                        id="filter-text-box"
                        label="Buscar en la tabla"
                        margin="normal"
                        autoComplete="off"
                        onInput={onFilterTextBoxChanged}
                    ></TextField>
                    <button onClick={onAddBtnClick}>
                        Add Row
                    </button>
                    <button onClick={onDeleteBtnClick}>
                        Delete Row
                    </button>
                    <div className="ag-theme-alpine" style={{ height: 600, width: 1200 }}>
                        <AgGridReact
                            paginationPageSize={10}
                            rowData={rowData}
                            pagination={true}
                            defaultColDef={defaultColDef}
                            ref={gridRef}
                            className={'table-expedition'}
                        >
                            {rows}
                        </AgGridReact>
                    </div>
                </div >
            </div >
            {/* <div className="ag-theme-alpine" style={{ height: 600, width: 1200 }}>
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
                </AgGridReact>
            </div> */}
        </div >
    );
}

export default Grid;