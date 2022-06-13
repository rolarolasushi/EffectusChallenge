
import React from 'react';
import { useCallback, useRef, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { runtimeEnv } from "../runtime-env"
import Button from '@mui/material/Button';
const Grid = () => {

    const [columnNum, setColumnNum] = useState(18);
    const [column, setColumn] = useState([]);
    const [rows, setRows] = useState(10);
    const gridRef = useRef();
    const [rowData, setRowData] = useState([
        { 0: 'A' },
        { 0: 'B' },
        { 0: 'C' },
        { 0: 'D' },
        { 0: 'E' },
        { 0: 'F' },
        { 0: 'G' },
        { 0: 'H' },
        { 0: 'I' },
        { 0: 'J' },
        { 0: 'K' },
    ])
    const defaultColDef = {
        resizable: true,
    };

    const onAddBtnClick = event => {
        let columTotal = columnNum + 1;
        let columnSize = 100
        if (columTotal === 0) {
            columnSize = 50
        }
        setColumn(column.concat(<AgGridColumn key={columTotal.toString()} field={columTotal.toString()} sortable={true} filter={true} width={columnSize} editable={true}></AgGridColumn>));
        setColumnNum(columTotal);
    };
    const onDeleteBtnClick = event => {
        if (columnNum > 18) {
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
    const onRemoveSelected = () => {

        if (rows > 10) {
            const selectedData = gridRef.current.api.getSelectedRows();
            gridRef.current.api.applyTransaction({ remove: selectedData });
            let rowsTotal = rows - 1;
            rowData.pop()
            setRows(rowsTotal)
        }


    };

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
        let inputAux = input
        let long;
        let separationIndex
        let inicialIndex = inputAux.indexOf("(", 0) + 1
        let add = 0;
        for (let i = 0; i < count + 1; i++) {
            long = inputAux.length
            separationIndex = inputAux.indexOf(";", 0)
            if (separationIndex === -1) {
                separationIndex = inputAux.indexOf(")", 0)
            }
            op[i] = inputAux.slice(inicialIndex, separationIndex);
            inicialIndex = 0;
            add = op[i].length
            inputAux = inputAux.slice(separationIndex + 1, long)
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
            let posElement = op[i].slice(1);
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
            let posElement = op[i].slice(1);
            res += parseInt(found[i][posElement])
        }
        let posIni = op[0].slice(1);
        let resFin = parseInt(found[0][posIni]) - res + parseInt(found[0][posIni])
        if (Object.is(NaN, resFin)) {
            res = runtimeEnv.NOT_A_NUMBER_MESSAGE
        }
        return resFin;
    }

    return (
        <div className="ag-theme-balham">

            <div className="example-wrapper gridFilterContent">

                <Button onClick={onAddBtnClick} variant="contained" color="success">
                    Add Column
                </Button>
                <Button onClick={onDeleteBtnClick} variant="outlined" color="error">
                    Delete Column
                </Button>
                <Button onClick={onAddRow} variant="contained" color="success">
                    Add Row
                </Button>
                <Button onClick={onRemoveSelected} variant="outlined" color="error">
                    Delete Row
                </Button>

            </div >
            <AgGridReact
                paginationPageSize={20}
                rowData={rowData}
                pagination={true}
                defaultColDef={defaultColDef}
                ref={gridRef}
                className={'table-expedition'}
                rowSelection={'single'}
                onCellValueChanged={onCellValueChanged}
            >

                <AgGridColumn field={'0'} sortable={true} filter={true} width={50} editable={true}></AgGridColumn>
                <AgGridColumn field={'1'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'2'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'3'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'4'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'5'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'6'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'7'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'8'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'9'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'10'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'11'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'12'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'13'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'14'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'15'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'16'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'17'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                <AgGridColumn field={'18'} sortable={true} filter={true} width={100} editable={true}></AgGridColumn>
                {column}

            </AgGridReact>


        </div >
    );
}

export default Grid;