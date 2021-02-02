//USAGE

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
function paginateTable(tableRef, pageMaxDefault = 10, repaginate = false, buttonAreaId = "paginationButtonsContainer", perPageSelectId = "maxPerPage", perPageSelect = [5,10,30,50], excludeHead = true, excludeFoot = true){
    let table = document.getElementById(tableRef);

    let headDif = 0;
    let footDif = 0;
    if(excludeHead){
        headDif++;
    }
    if(excludeFoot){
        footDif++;
    }


    //handling select
    let selectPageSize;
    let isToAppendSelect = false;
    if(perPageSelectId != null && document.getElementById(perPageSelectId) != null){
        selectPageSize = document.getElementById(perPageSelectId);
    } else {
        selectPageSize = document.createElement("select");
        selectPageSize.id = "maxPerPage";
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

    if(table.rows.length - headDif - footDif > pageMaxDefault){
        table.dataset.page = 1;

        let buttonContainer;
        let isToAppendButtonContainer = false;
        if(buttonAreaId != null && document.getElementById(buttonAreaId) != null){
            buttonContainer = document.getElementById(buttonAreaId);
        } else {
            buttonContainer = document.createElement("div");
            buttonContainer.id = "paginationButtonsContainer";
            isToAppendButtonContainer = true;
        }
        buttonContainer.classList.add("button-container");



        //settings done

        //creating elements

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
        for(let r = 0 + headDif; r < table.rows.length - footDif; r++){
            table.rows[r].setAttribute("style", "display:table-row;");
        }
        if(document.getElementById(buttonAreaId).children.length > 0){
            let childNodes = document.getElementById(buttonAreaId).children;
            for(let i = childNodes.length-1; i >= 0; i--){
                console.log(i + " - removing... " + childNodes[i]);
                document.getElementById(buttonAreaId).removeChild(childNodes[i]);
            }
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
