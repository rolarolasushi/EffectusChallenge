
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
        let ocurrence = (input.match(/;/g) || []).length;
        if (input != null && ocurrence > 0) {
            let operation = input.slice(0, 4) + input.slice(input.length - 1);
            validateOperation(operation, input, rowIndex, colNum)
        } else if (input != null) {
            addConstants(input, rowIndex, colNum)
        }

    };
    const validateOperation = (operation, input, rowIndex, colNum) => {
        var count = (input.match(/;/g) || []).length;
        let op = [];
        let x = 4;
        let y = 6;
        for (let i = 0; i < count + 1; i++) {
            op[i] = input.slice(x, y);
            x = x + 3;
            y = y + 3;
        }

        if (operation === 'SUM()') {
            let res = convertAndAddValue(op, count)
            let items = [...rowData];
            let item = {
                ...items[rowIndex]
            }
            item[colNum] = res.toString()
            items[rowIndex] = item
            setRowData(items)
        } else if (operation === 'SUB()') {
            let res = convertAndAddDec(op, count)
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
        let strArr = newArray.split('+');
        let sum = strArr.reduce(function (total, num) {
            return parseFloat(total) + parseFloat(num);
        });
        let items = [...rowData];
        let item = {
            ...items[rowIndex]
        }
        item[colNum] = sum.toString()
        items[rowIndex] = item
        setRowData(items)

    }
    const convertAndAddValue = (op, count) => {
        let found = [];
        let res = 0;
        for (let i = 0; i < count + 1; i++) {
            found[i] = rowData.find(element => element[0] === op[i][0]);
            let posElement = op[i][1];
            res += parseInt(found[i][posElement])
        }
        if (Object.is(NaN, res)) {
            res = runtimeEnv.NOT_A_NUMBER_MESSAGE
        }
        return res;
    }
    const convertAndAddDec = (op, count) => {
        let found = [];
        let res = 0;
        for (let i = 0; i < count + 1; i++) {
            found[i] = rowData.find(element => element[0] === op[i][0]);
            let posElement = op[i][1];
            res += parseInt(found[i][posElement])
        }
        let posIni = op[0][1];
        let resFin = parseInt(found[0][posIni]) - res + parseInt(found[0][posIni])
        if (Object.is(NaN, resFin)) {
            res = runtimeEnv.NOT_A_NUMBER_MESSAGE
        }
        return resFin;
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
            >

                <AgGridColumn field={'0'} sortable={true} filter={true} width={50} editable={true}></AgGridColumn>
                {column}

            </AgGridReact>


        </div >
    );
}

export default Grid;