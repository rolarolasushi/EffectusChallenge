
import React from 'react';
import { useRef, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { runtimeEnv } from "../runtime-env"
import Button from '@mui/material/Button';
const CustomSpreadSheet = () => {

    const [columnNum, setColumnNum] = useState(18); //state to know how many colums there are
    const [column, setColumn] = useState([]); //the actual colums
    const [rows, setRows] = useState(10); //we keep count of how many rows there are
    const [rowData, setRowData] = useState([ //set initial rows with its index
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
    const gridRef = useRef();
    const defaultColDef = {
        resizable: true,
    };
    // we add columns here when the event is dispatched and we set update the ColumnNun(totalColumn)state
    const onAddBtnClick = event => {
        let columTotal = columnNum + 1;
        let columnSize = 100
        if (columTotal === 0) {
            columnSize = 50
        }
        setColumn(column.concat(<AgGridColumn key={columTotal.toString()} field={columTotal.toString()} sortable={true} filter={true} width={columnSize} editable={true}></AgGridColumn>));
        setColumnNum(columTotal);
    };
    // we delete columns here when the event is dispatched and we set update the ColumnNun(totalColumn)state
    const onDeleteBtnClick = event => {
        if (columnNum > 18) {
            let columTotal = columnNum - 1;
            column.pop()
            setColumnNum(columTotal);
        }
    };
    //we add rows and we set it to be letters instead of numbers
    const onAddRow = () => {
        let rowTotal = rows + 1;
        setRows(rowTotal);
        let index = String.fromCharCode(rowTotal + 65);
        setRowData(rowData.concat({ 0: index }));
    }
    //we remove selected rows here using the api to refrsh the grid
    const onRemoveSelected = () => {
        if (rows > 10) {
            const selectedData = gridRef.current.api.getSelectedRows();
            gridRef.current.api.applyTransaction({ remove: selectedData });
            let rowsTotal = rows - 1;
            rowData.pop()
            setRows(rowsTotal)
        }
    };
    // every time the cell changes its value (when you update it and press enter) we dispatch this event and what it does is check if its a constant
    // addition/substraction or a function
    const onCellValueChanged = ({ data }) => {
        var focusedCell = gridRef.current.api.getFocusedCell();
        let rowIndex = focusedCell.rowIndex
        var colNum = focusedCell.column.colId;
        let input = data[colNum];
        let ocurrence = (input.match(/;/g) || []).length;
        if (input != null && ocurrence > 0) {
            let operation = input.slice(0, 4) + input.slice(input.length - 1);
            validateOperation(operation, input, rowIndex, colNum, ocurrence)
        } else if (input != null) {
            addConstants(input, rowIndex, colNum)
        }

    };
    //this method validates the input and see if its a valid SUM or SUB and does the respectly function
    // if its , it does the math and update the grid
    const validateOperation = (operation, input, rowIndex, colNum, ocurrence) => {
        let op = [];
        let inputAux = input;
        let long;
        let separationIndex;
        let inicialIndex = inputAux.indexOf("(", 0) + 1;
        for (let i = 0; i < ocurrence + 1; i++) {
            long = inputAux.length
            separationIndex = inputAux.indexOf(";", 0)
            if (separationIndex === -1) {
                separationIndex = inputAux.indexOf(")", 0)
            }
            op[i] = inputAux.slice(inicialIndex, separationIndex);
            inicialIndex = 0;
            inputAux = inputAux.slice(separationIndex + 1, long);
        }
        if (operation === 'SUM()') {
            let result = addValue(op, ocurrence);
            updateDataGrid(rowIndex, colNum, result);
        } else if (operation === 'SUB()') {
            let result = substractValue(op, ocurrence);
            updateDataGrid(rowIndex, colNum, result);
        }
    }

    //this method purely add the data sent
    const addValue = (op, ocurrence) => {
        let found = [];
        let res = 0;
        for (let i = 0; i < ocurrence + 1; i++) {
            found[i] = rowData.find(element => element[0] === op[i][0]);
            let posElement = op[i].slice(1);
            res += parseInt(found[i][posElement])
        }
        if (Object.is(NaN, res)) {
            res = runtimeEnv.NOT_A_NUMBER_MESSAGE
        }
        return res;
    }
    //this method only updates the data Grid and keeps what already has
    const updateDataGrid = (rowIndex, colNum, result) => {
        let items = [...rowData];
        let item = {
            ...items[rowIndex]
        };
        item[colNum] = result.toString();
        items[rowIndex] = item;
        setRowData(items);
    }
    //this method purely substract the data sent
    const substractValue = (op, ocurrence) => {
        let found = [];
        let res = 0;
        for (let i = 0; i < ocurrence + 1; i++) {
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

    //this method add constants and updates the grid
    const addConstants = (input, rowIndex, colNum) => {
        var count = (input.match(/-/g) || []).length;
        let inputCopy = input;
        for (let i = 0; i < count; i++) {
            let pos = inputCopy.search('-');
            if (pos !== 0) {
                inputCopy = inputCopy.replace('-', 'x')
            } else {
                inputCopy = inputCopy.replace('-', 'j')
            }
        }
        inputCopy = inputCopy.replace('j', '-')
        inputCopy = inputCopy.replaceAll('x', '+-')
        let strArr = inputCopy.split('+');
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




    return (
        <div className="ag-theme-balham">

            <div className="example-wrapper gridFilterContent">

                <div className="btns">
                    <Button onClick={onAddBtnClick} variant="contained" color="success">
                        Add Column
                    </Button>
                </div>
                <div className="btns">
                    <Button onClick={onDeleteBtnClick} variant="outlined" color="error">
                        Delete Column
                    </Button>
                </div>
                <div className="btns">
                    <Button onClick={onAddRow} variant="contained" color="success">
                        Add Row
                    </Button>
                </div>
                <div className="btns">
                    <Button onClick={onRemoveSelected} variant="outlined" color="error">
                        Delete Row
                    </Button>
                </div>

            </div >
            <AgGridReact
                paginationPageSize={11}
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

export default CustomSpreadSheet;