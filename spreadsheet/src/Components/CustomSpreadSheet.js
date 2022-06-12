
import React from 'react';
import { useCallback, useRef, useState } from 'react';
import { TextField } from "@material-ui/core";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { runtimeEnv } from "../runtime-env"
const Grid = () => {

    const [columnNum, setColumnNum] = useState(0);
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
        setColumn(column.concat(<AgGridColumn key={columTotal.toString()} field={columTotal.toString()} sortable={true} filter={true} width={columnSize} editable={true}></AgGridColumn>));
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
        setRows(rowTotal);
        let index = String.fromCharCode(rowTotal + 65);
        setRowData(rowData.concat({ 0: index }));
    }
    const onRemoveSelected = useCallback(() => {
        const selectedData = gridRef.current.api.getSelectedRows();
        gridRef.current.api.applyTransaction({ remove: selectedData });
    }, []);

    const onCellValueChanged = ({ data }) => {
        var focusedCell = gridRef.current.api.getFocusedCell();
        let rowIndex = focusedCell.rowIndex
        var colNum = focusedCell.column.colId;
        let input = data[colNum];
        let op1 = input;
        let op2 = input;
        if (input != null && input.length === 10) {
            let operation = input.slice(0, 4) + input.slice(6, 7) + input.slice(9);
            validateOperation(operation, op1, op2, rowIndex, colNum)
        } else if (input != null) {
            addConstants(input, rowIndex, colNum)
        }

    };
    const validateOperation = (operation, op1, op2, rowIndex, colNum) => {
        if (operation.length === 6) {
            op1 = op1.slice(4, 6);
            op2 = op2.slice(-3, -1);
        }
        if (operation === 'SUM(;)') {
            let res = convertAndAddValue(op1, op2)
            let items = [...rowData];
            let item = {
                ...items[rowIndex]
            }
            item[colNum] = res.toString()
            items[rowIndex] = item
            setRowData(items)
        } else if (operation === 'SUB(;)') {
            let res = convertAndAddDec(op1, op2)
            console.log(res)
            let items = [...rowData];
            let item = {
                ...items[rowIndex]
            }
            item[colNum] = res.toString()
            items[rowIndex] = item
            setRowData(items)
        }
    }
    const addConstants = (input, rowIndex, colNum) => {
        var count = (input.match(/-/g) || []).length;
        let newArray = input;
        for (let i = 0; i < count; i++) {
            let pos = newArray.search('-');
            if (pos !== 0) {
                newArray = newArray.replace('-', 'x')
            } else {
                newArray = newArray.replace('-', 'j')
            }
        }
        newArray = newArray.replace('j', '-')
        newArray = newArray.replaceAll('x', '+-')
        console.log(newArray)
        let strArr = newArray.split('+');
        let sum = strArr.reduce(function (total, num) {
            return parseFloat(total) + parseFloat(num);
        });
        console.log(sum)
        let items = [...rowData];
        let item = {
            ...items[rowIndex]
        }
        item[colNum] = sum.toString()
        items[rowIndex] = item
        setRowData(items)

    }
    const convertAndAddValue = (op1, op2) => {
        let found = rowData.find(element => element[0] === op1[0]);
        let found2 = rowData.find(element => element[0] === op2[0]);
        let res = parseInt(found[op1[1]]) + parseInt(found2[op2[1]])
        if (Object.is(NaN, res)) {
            res = runtimeEnv.NOT_A_NUMBER_MESSAGE
        }
        return res;
    }
    const onRowEditingStarted = ({ data }) => {
        console.log("Row editing")
        console.log(data)
    }
    const convertAndAddDec = (op1, op2) => {
        let found = rowData.find(element => element[0] === op1[0]);
        let found2 = rowData.find(element => element[0] === op2[0]);
        let res = parseInt(found[op1[1]]) - parseInt(found2[op2[1]])
        if (Object.is(NaN, res)) {
            res = runtimeEnv.NOT_A_NUMBER_MESSAGE
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
                </div >
            </div >
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

                <AgGridColumn field={'0'} sortable={true} filter={true} width={50} editable={true}></AgGridColumn>
                {column}

            </AgGridReact>


        </div >
    );
}

export default Grid;