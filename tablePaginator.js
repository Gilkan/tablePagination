// <table id="tableTest">
//     <tr>
//         <td>head1</td>
//         <td>head2</td>
//     </tr>
//     <tr>
//         <td>data1 row1</td>
//         <td>data2 row1</td>
//     </tr>
//     <tr>
//         <td>data1 row2</td>
//         <td>data2 row2</td>
//     </tr>
//     <tr>
//         <td>data1 row3</td>
//         <td>data2 row3</td>
//     </tr>
//     <tr>
//         <td>data1 row4</td>
//         <td>data2 row4</td>
//     </tr>
//     <tr>
//         <td>data1 row5</td>
//         <td>data2 row5</td>
//     </tr>
//     <tr>
//         <td>data1 row6</td>
//         <td>data2 row6</td>
//     </tr>
//     <tr>
//         <td>data1 row7</td>
//         <td>data2 row7</td>
//     </tr>
//     <tr>
//         <td>data1 row8</td>
//         <td>data2 row8</td>
//     </tr>
//     <tr>
//         <td>data1 row9</td>
//         <td>data2 row9</td>
//     </tr>
//     <tr>
//         <td>data1 row10</td>
//         <td>data2 row10</td>
//     </tr>
//     <tr>
//         <td>data1 row11</td>
//         <td>data2 row11</td>
//     </tr>
//     <tr>
//         <td>data1 row12</td>
//         <td>data2 row12</td>
//     </tr>
//     <tr>
//         <td>foot1</td>
//         <td>foot2</td>
//     </tr>
// </table>

//   simply call:
//      paginateTable("tableTest");

/**
 * @param string tableRef: table id to paginate
 * @param [int] pageMaxDefault: default value of pagination (10).
 * @param [boolean] repaginate: flag to be used by selector
 * @param [string] buttonAreaId: button container id.
 * @param [string] perPageSelectId: select id.
 * @param [array[int]] perPageSelect: array containing select options.
 * @param [boolean] excludeHead: flag to jump first row of table in case of thead existence
 * @param [boolean] excludeFoot: flag to jump last row of table in case of tfoot existence
 * 
 * @return void
 */
function paginateTable(tableRef, pageMaxDefault = 10, repaginate = false, addSortingToHeaders = true,  buttonAreaId = "paginationButtonsContainer", perPageSelectId = "maxPerPage", perPageSelect = [5,10,30,50], excludeHead = true, excludeFoot = true){
    let table = document.getElementById(tableRef);

    let headDif = 0;
    let footDif = 0;
    if(excludeHead){
        headDif++;
    }
    if(excludeFoot){
        footDif++;
    }

    if(addSortingToHeaders && excludeHead && table.rows[0].cells[0].dataset.sortlistener!="attached" && table.rows[0].cells[0].dataset.sortlistener==undefined){
        for(let c = 0; c < table.rows[0].cells.length; c++){
            table.rows[0].cells[c].addEventListener("click", function(event){
                sortColumn(event.target);
            });
            table.rows[0].cells[c].addEventListener("mousedown", function(event){
                event.preventDefault();
            });
            table.rows[0].cells[c].dataset.sortlistener = "attached";
        }
    }


    if(table.rows.length - headDif - footDif > pageMaxDefault){
        table.dataset.page = 1;

        let buttonContainer;
        let isToAppendButtonContainer = false;
        if(buttonAreaId != null && document.getElementById(buttonAreaId) != null){
            buttonContainer = document.getElementById(buttonAreaId);
        } else {
            buttonContainer = document.createElement("div");
            buttonContainer.id = buttonAreaId;
            isToAppendButtonContainer = true;
        }
        buttonContainer.classList.add("button-container");



        //settings done

        //creating elements

        //handling select
        let selectPageSize;
        let isToAppendSelect = false;
        if(perPageSelectId != null && document.getElementById(perPageSelectId) != null){
            selectPageSize = document.getElementById(perPageSelectId);
        } else {
            selectPageSize = document.createElement("select");
            selectPageSize.id = perPageSelectId;
            isToAppendSelect = true;
        }
        selectPageSize.classList.add("select-page-size");

        if(!repaginate){
            for(let i = 0; i < perPageSelect.length; i++){
                let option = document.createElement("option");
                option.value = perPageSelect[i];
                option.text = perPageSelect[i];
                if(perPageSelect[i] == pageMaxDefault){
                    option.selected = true;
                }
                selectPageSize.appendChild(option);
            }
            selectPageSize.addEventListener("change", function(){changePagination(tableRef)});
        }
        //handling select

        if(repaginate){
            if(document.getElementById("actualButton") != null){
                document.getElementById("actualButton").parentNode.removeChild(document.getElementById("actualButton"));
            }
            if(document.getElementById("nextButton") != null){
                document.getElementById("nextButton").parentNode.removeChild(document.getElementById("nextButton"));
            }
            if(document.getElementById("lastButton") != null){
                document.getElementById("lastButton").parentNode.removeChild(document.getElementById("lastButton"));
            }
        }

        createPaginationButton(table.id, buttonAreaId, 'actual', pageMaxDefault, table.dataset.page, false, excludeHead, excludeFoot);
        createPaginationButton(table.id, buttonAreaId, 'next', pageMaxDefault, null, false, excludeHead, excludeFoot);
        createPaginationButton(table.id, buttonAreaId, 'last', pageMaxDefault, null, false, excludeHead, excludeFoot);

        if(isToAppendButtonContainer){
            table.parentNode.insertBefore(buttonContainer, table);
        }
        if(isToAppendSelect){
            table.parentNode.insertBefore(selectPageSize, table);
        }

        goToPage("<?=$this->tableId;?>",1, pageMaxDefault, excludeHead, excludeFoot);
    } else {
        let r;
        for(r = 0 + headDif; r < table.rows.length - footDif; r++){
            table.rows[r].setAttribute("style", "display:table-row;");

        }
        console.log("Max rows: " + (r-1));
        if(document.getElementById(buttonAreaId).children.length > 0){
            let childNodes = document.getElementById(buttonAreaId).children;
            for(let i = childNodes.length-1; i >= 0; i--){
                document.getElementById(buttonAreaId).removeChild(childNodes[i]);
            }
        }
        if(document.getElementById("zeroResultsText") != null){
            document.getElementById(perPageSelectId).parentNode.removeChild(document.getElementById(perPageSelectId));
        }
        if(document.getElementById(perPageSelectId).options.length < 1){
            document.getElementById(perPageSelectId).parentNode.removeChild(document.getElementById(perPageSelectId));
        }
    }
}

function createPaginationButton(tableId, buttonContainerId, buttonMode = "actual", perPageValue = 10, innerValue = null, returnButtonFlag = false, headerExclusion = true, footerExclusion = true){
    let buttonContent;
    switch (buttonMode) {
        case "first":
            //create first button
            buttonContent = "<<";
            break;
        case "back":
            //create back button
            buttonContent = "<";
            break;
        case "next":
            //create next button
            buttonContent = ">";
            break;
        case "last":
            //create last button
            buttonContent = ">>";
            break;
        case 'actual':
            //create actual button
            buttonContent = "1";
            break;
    }

    let returnButton = document.createElement("button");
    if(innerValue == null){
        returnButton.innerHTML = buttonContent;
    } else {
        returnButton.innerHTML = innerValue;
    }

    returnButton.id = buttonMode + "Button";

    if(buttonMode == "first" || buttonMode == "back" || buttonMode == "next" || buttonMode == "last"){
        returnButton.addEventListener("click", function(){
            tableChangePage(buttonMode, tableId, buttonContainerId, perPageValue, headerExclusion, footerExclusion);
        });
    } else {
        if(buttonMode == "actual"){
            returnButton.disabled = true;
        }
    }

    if(returnButtonFlag){
        return returnButton;
    } else {
        document.getElementById(buttonContainerId).appendChild(returnButton);
    }
}

function tableChangePage(mode, tableId, btnContainerId, perPage = 10, excludeHeader = true, excludeFooter = true){
    let table = document.getElementById(tableId);

    let actualValue = table.dataset.page;
    let newPageValue;
    let maxPageValue = Math.ceil(table.rows.length/perPage);

    switch(mode){
        case "first":
            newPageValue = 1;

            //check if buttons next and last exists

            if(document.getElementById("nextButton") == null){
                document.getElementById(btnContainerId).appendChild(
                    createPaginationButton(tableId, btnContainerId, "next", perPage, null, true, excludeHeader, excludeFooter)
                );
            }
            if(document.getElementById("lastButton") == null){
                document.getElementById(btnContainerId).appendChild(
                    createPaginationButton(tableId, btnContainerId, "last", perPage, null, true, excludeHeader, excludeFooter)
                );
            }

            //remove back and first
            if(document.getElementById("backButton") != null){
                document.getElementById("backButton").parentNode.removeChild(document.getElementById("backButton"));
            }
            if(document.getElementById("firstButton") != null){
                document.getElementById("firstButton").parentNode.removeChild(document.getElementById("firstButton"));
            }


            break;
        case "back":
            newPageValue = --actualValue;
            if(newPageValue < 1){
                newPageValue = 1;
            }

            //check if buttons next and last exists

            if(document.getElementById("nextButton") == null){
                document.getElementById(btnContainerId).appendChild(
                    createPaginationButton(tableId, btnContainerId, "next", perPage, null, true, excludeHeader, excludeFooter)
                );
            }
            if(document.getElementById("lastButton") == null){
                document.getElementById(btnContainerId).appendChild(
                    createPaginationButton(tableId, btnContainerId, "last", perPage, null, true, excludeHeader, excludeFooter)
                );
            }

            //remove back and first if is first

            if(newPageValue == 1){
                if(document.getElementById("backButton") != null){
                    document.getElementById("backButton").parentNode.removeChild(document.getElementById("backButton"));
                }
                if(document.getElementById("firstButton") != null){
                    document.getElementById("firstButton").parentNode.removeChild(document.getElementById("firstButton"));
                }
            }

            break;
        case "next":
            newPageValue = ++actualValue;
            if(newPageValue > maxPageValue){
                newPageValue = maxPageValue;
            }

            //check if buttons back and first exists

            if(document.getElementById("backButton") == null){
                document.getElementById(btnContainerId).insertBefore(
                    createPaginationButton(tableId, btnContainerId, "back", perPage, null, true, excludeHeader, excludeFooter),
                    document.getElementById(btnContainerId).firstChild
                );
            }
            if(document.getElementById("firstButton") == null){
                document.getElementById(btnContainerId).insertBefore(
                    createPaginationButton(tableId, btnContainerId, "first", perPage, null, true, excludeHeader, excludeFooter),
                    document.getElementById(btnContainerId).firstChild
                );
            }

            //remove next and last if is last

            if(newPageValue == maxPageValue){
                if(document.getElementById("nextButton") != null){
                    document.getElementById("nextButton").parentNode.removeChild(document.getElementById("nextButton"));
                }
                if(document.getElementById("lastButton") != null){
                    document.getElementById("lastButton").parentNode.removeChild(document.getElementById("lastButton"));
                }
            }
            break;
        case "last":
            newPageValue = maxPageValue;

            //check if buttons back and first exists

            if(document.getElementById("backButton") == null){
                document.getElementById(btnContainerId).insertBefore(
                    createPaginationButton(tableId, btnContainerId, "back", perPage, null, true, excludeHeader, excludeFooter),
                    document.getElementById(btnContainerId).firstChild
                );
            }
            if(document.getElementById("firstButton") == null){
                document.getElementById(btnContainerId).insertBefore(
                    createPaginationButton(tableId, btnContainerId, "first", perPage, null, true, excludeHeader, excludeFooter),
                    document.getElementById(btnContainerId).firstChild
                );
            }

            //remove next and last

            if(document.getElementById("nextButton") != null){
                document.getElementById("nextButton").parentNode.removeChild(document.getElementById("nextButton"));
            }
            if(document.getElementById("lastButton") != null){
                document.getElementById("lastButton").parentNode.removeChild(document.getElementById("lastButton"));
            }
            break;
    }
    //change page
    goToPage(tableId, newPageValue, perPage, excludeHeader, excludeFooter);
}

function goToPage(tId, pageNumber, perP, excludeH = true, excludeF = true){
    let headerDiff;
    if(excludeH){
        headerDiff = 1;
    } else {
        headerDiff = 0;
    }
    let footerDiff;
    if(excludeF){
        footerDiff = 1;
    } else {
        footerDiff = 0;
    }
    let table = document.getElementById(tId);
    table.dataset.page = pageNumber;
    document.getElementById("actualButton").innerHTML = pageNumber;
    for(let r = 0+headerDiff; r < table.rows.length-footerDiff; r++){ //exclude table header and footer. Starting at 1 and endind -1
        if(r >= perP * pageNumber - perP +1 && r < perP * pageNumber +1){
            //show
            table.rows[r].setAttribute("style", "display:table-row;");
        } else {
            //hide
            table.rows[r].setAttribute("style", "display:none;");
        }
    }
}

function changePagination(idTable){
    paginateTable(idTable, document.getElementById("maxPerPage").value, true);
}

function sortColumn(clickedTableCell, order = null, ignoreHeader = true, ignoreFooter = true){
    let hDelta = 0;
    if(ignoreHeader){
        hDelta = 1;
    }
    let fDelta = 0;
    if(ignoreFooter){
        fDelta = 1;
    }

    if(clickedTableCell.tagName == "I"){
        clickedTableCell = clickedTableCell.parentNode;
    }

    let changeOrder = false;
    let changesCount = 0;
    if(order == null){
        order = "asc";
        changeOrder = true;
    }
    if(order == "asc"){
        let icon = document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add("fa-arrow-up");
        icon.id = "orderIcon";
        if(document.getElementById("orderIcon") != null){
            document.getElementById("orderIcon").parentNode.removeChild(document.getElementById("orderIcon"));
        }
        clickedTableCell.appendChild(icon);
    }
    if(order == "desc"){
        let icon = document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add("fa-arrow-down");
        icon.id = "orderIcon";
        if(document.getElementById("orderIcon") != null){
            document.getElementById("orderIcon").parentNode.removeChild(document.getElementById("orderIcon"));
        }
        clickedTableCell.appendChild(icon);
    }


    let table = clickedTableCell;
    while(table.tagName != "TABLE"){
        table = table.parentNode;
    }

    let continueSorting = true;
    while(continueSorting){
        continueSorting = false;
        for(let r = 0+hDelta; r < table.rows.length-fDelta -1; r++){
            switch (order) {
                case "asc":
                    if(isNaN(Number(table.rows[r].cells[clickedTableCell.cellIndex].innerHTML))){
                        if((table.rows[r].cells[clickedTableCell.cellIndex].innerHTML.match(/\//g) || []).length == 2){ //probably a date
                            if(
                                new Date(dmyToMDY(table.rows[r].cells[clickedTableCell.cellIndex].innerHTML)).getTime()
                                >
                                new Date(dmyToMDY(table.rows[r+1].cells[clickedTableCell.cellIndex].innerHTML)).getTime()
                            ){
                                if(!continueSorting){
                                    continueSorting = true;
                                }
                                changesCount++;
                                switchTableRows(table, r, r+1);
                            }
                        } else {
                            if(
                                table.rows[r].cells[clickedTableCell.cellIndex].innerHTML.toUpperCase()
                                >
                                table.rows[r+1].cells[clickedTableCell.cellIndex].innerHTML.toUpperCase()
                            ){
                                if(!continueSorting){
                                    continueSorting = true;
                                }
                                changesCount++;
                                switchTableRows(table, r, r+1);
                            }
                        }

                    } else {
                        if(
                            Number(table.rows[r].cells[clickedTableCell.cellIndex].innerHTML)
                            >
                            Number(table.rows[r+1].cells[clickedTableCell.cellIndex].innerHTML)
                        ){
                            if(!continueSorting){
                                continueSorting = true;
                            }
                            changesCount++;
                            switchTableRows(table, r, r+1);
                        }
                    }
                    break;
                case "desc":
                    if(isNaN(Number(table.rows[r].cells[clickedTableCell.cellIndex].innerHTML))){
                        if((table.rows[r].cells[clickedTableCell.cellIndex].innerHTML.match(/\//g) || []).length == 2){ //probably a date
                            if(
                                new Date(dmyToMDY(table.rows[r].cells[clickedTableCell.cellIndex].innerHTML)).getTime()
                                <
                                new Date(dmyToMDY(table.rows[r+1].cells[clickedTableCell.cellIndex].innerHTML)).getTime()
                            ){
                                if(!continueSorting){
                                    continueSorting = true;
                                }
                                changesCount++;
                                switchTableRows(table, r, r+1);
                            }
                        } else {
                            if(
                                table.rows[r].cells[clickedTableCell.cellIndex].innerHTML.toUpperCase()
                                <
                                table.rows[r+1].cells[clickedTableCell.cellIndex].innerHTML.toUpperCase()
                            ){
                                if(!continueSorting){
                                    continueSorting = true;
                                }
                                changesCount++;
                                switchTableRows(table, r, r+1);
                            }
                        }

                    } else {
                        if(
                            Number(table.rows[r].cells[clickedTableCell.cellIndex].innerHTML)
                            <
                            Number(table.rows[r+1].cells[clickedTableCell.cellIndex].innerHTML)
                        ){
                            if(!continueSorting){
                                continueSorting = true;
                            }
                            changesCount++;
                            switchTableRows(table, r, r+1);
                        }
                    }
                    break;
            }
        }
    }
    if(changeOrder && changesCount==0){
        return sortColumn(clickedTableCell, "desc");
    }
    paginateTable(table.id, document.getElementById("maxPerPage").value, true);
}

function switchTableRows(table, row1, row2){
    let buffer;
    buffer = table.rows[row1];
    table.rows[row1].parentNode.insertBefore(table.rows[row2], table.rows[row1]);
    table.rows[row2].parentNode.insertBefore(buffer, table.rows[row2]);
}

function dmyToMDY(dateDMY, separator = "/"){
    [dia, mes, ano] = dateDMY.split(separator);
    return mes + separator + dia + separator + ano;
}
