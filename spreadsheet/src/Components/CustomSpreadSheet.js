/* eslint-disable */
import React from 'react';
import { useCallback, useRef, useState } from 'react';
import { TextField } from "@material-ui/core";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
const Grid = () => {
    const [columnNum, setColumnNum] = useState(-1);
    const [column, setColumn] = useState([]);
    const [rows, setRows] = useState(-1);
    const gridRef = useRef();
    const [rowData, setRowData] = useState([
    ])
    const defaultColDef = {
        resizable: true,

    };
    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    const onAddBtnClick = event => {
        let columTotal = columnNum + 1;
        let columnSize = 300
        if (columTotal === 0) {
            columnSize = 50
        }
        setColumn(column.concat(<AgGridColumn field={columTotal.toString()} sortable={true} filter={true} width={columnSize} editable={true}></AgGridColumn>));
        setColumnNum(columTotal);
    };
    const onDeleteBtnClick = event => {
        if (columnNum > 0) {
            let columTotal = columnNum - 1;
            column.pop()
            setColumnNum(columTotal);
        }
    };
    const onAddRow = () => {
        let rowTotal = rows + 1;
        let initialRow;
        setRows(rowTotal);
        let index = String.fromCharCode(rowTotal + 65);
        // for (var i = 1; i < columnNum; i++) {
        //     initialRow.concat({ i: '0'},)
        // }
        //setRowData(initialRow)
        setRowData(rowData.concat({ 0: index }));
    }
    const onDeleteColumn = () => {
        rowData.pop()
        setRowData(rowData)
    }
    const onRemoveSelected = useCallback(() => {
        const selectedData = gridRef.current.api.getSelectedRows();
        const res = gridRef.current.api.applyTransaction({ remove: selectedData });
    }, []);

    const onCellValueChanged = ({ data }) => {
        var focusedCell = gridRef.current.api.getFocusedCell();
        let rowIndex = focusedCell.rowIndex
        var colNum = focusedCell.column.colId;
        console.log(data)
        let input = data[colNum];
        let op1 = input;
        let op2 = input;
        console.log(input);
        if (input != null && input.length == 10) {
            let operation = input.slice(0, 4) + input.slice(6, 7) + input.slice(9);
            if (operation === 'SUM(;)') {
                op1 = op1.slice(4, 6);
                op2 = op2.slice(-3, -1);
                let res = convertAndAddValue(op1, op2)
                console.log(res)
                let items = [...rowData];
                let item = {
                    ...items[rowIndex]
                }
                item[colNum] = res.toString()
                items[rowIndex] = item
                //found[colNum] = res
                setRowData(items)
                console.log(rowData)
            } else if (operation === 'SUB(;)') {
                op1 = op1.slice(4, 6);
                op2 = op2.slice(-3, -1);
                console.log("resta")
                let res = convertAndAddDec(op1, op2)
                console.log(res)
                let items = [...rowData];
                let item = {
                    ...items[rowIndex]
                }
                item[colNum] = res.toString()
                items[rowIndex] = item
                //found[colNum] = res
                setRowData(items)
                console.log(rowData)
            }
        }

    };
    const convertAndAddValue = (op1, op2) => {
        let found = rowData.find(element => element[0] == op1[0]);
        let found2 = rowData.find(element => element[0] == op2[0]);
        let res = parseInt(found[op1[1]]) + parseInt(found2[op2[1]])
        if (Object.is(NaN, res)) {
            res = 'Invalid Operation'
        }
        return res;
    }
    const onRowEditingStarted = ({ data }) => {
        console.log("Row editing")
        console.log(data)
    }
    const convertAndAddDec = (op1, op2) => {
        let found = rowData.find(element => element[0] == op1[0]);
        let found2 = rowData.find(element => element[0] == op2[0]);
        let res = parseInt(found[op1[1]]) + parseInt(found2[op2[1]])
        if (Object.is(NaN, res)) {
            res = 'Invalid Operation'
        }
        return res;
    }

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
                        Add Column
                    </button>
                    <button onClick={onDeleteBtnClick}>
                        Delete Column
                    </button>
                    <button onClick={onAddRow}>
                        Add Row
                    </button>
                    <button onClick={onRemoveSelected}>
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
                            rowSelection={'single'}
                            onCellValueChanged={onCellValueChanged}
                            onRowEditingStarted={onRowEditingStarted}
                        >

                            {column}

                        </AgGridReact>
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
        </div >
    );
}

export default Grid;