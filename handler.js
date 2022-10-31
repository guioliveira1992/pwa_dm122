import { saveIndexDB, getItemsDDB, getItemDDB, updateIndexDB, deleteItemIndexDB } from "./db.js"

// Global Scope variable we need this
var clickCount = 0;
// Our Timeout, modify it if you need
var timeout = 500;
// Copy this function and it should work
function clicks(ev) {
    // We modify clickCount variable here to check how many clicks there was

    clickCount++;
    if (clickCount == 1) {
        setTimeout(function () {
            if (clickCount == 1) {
                console.log('singleClick');
                let inputs = ev.target.childNodes[0].data.split(" - ")
                let item = new Object()
                console.log("split", inputs)
                item.name = inputs[1]
                let nameModal = document.getElementById("itemName")
                let priceModal = document.getElementById("itemPrice")
                let idModal = document.getElementById("itemId")
                let quantityModal = document.getElementById("itemQuantity")

                item.quantity = inputs[0].replace("x", "")
                quantityModal.value = item.quantity
                nameModal.value = item.name
                if (inputs.length > 1) {
                    inputs[2] = inputs[2].replace("R$ ", "")
                    inputs[2] = inputs[2].replace(",", ".")
                    item.price = inputs[2]
                    console.log(typeof (item.price))
                    priceModal.value = item.price
                }

                console.log(item)
                if (item.name != '×' && item.price !== undefined) {
                    modal.style.display = "block";
                    idModal.value = ev.target.childNodes[1].attributes.id.value
                } else {
                    console.log(ev.target.id)
                    nameModal.value = ""
                    priceModal.value = ""
                    quantityModal.value = ""
                    deleteItemIndexDB(ev.target.id)
                }

                // Single click code, or invoke a function 
            } else {
                console.log('double click');
                ev.target.classList.toggle('checked');
                console.log(ev.target.classList.value)
                // Double click code, or invoke a function
                let inputs = ev.target.childNodes[0].data.split(" - ")
                let item = new Object()
                console.log("split", inputs)
                item.name = inputs[1]
                let nameModal = document.getElementById("itemName")
                let priceModal = document.getElementById("itemPrice")
                let quantityModal = document.getElementById("itemQuantity")

                item.quantity = inputs[0].replace("x", "")
                quantityModal.value = item.quantity
                nameModal.value = item.name
                if (inputs.length > 1) {
                    inputs[2] = inputs[2].replace("R$ ", "")
                    inputs[2] = inputs[2].replace(",", ".")
                    item.price = inputs[2]
                    console.log(typeof (item.price))
                    priceModal.value = item.price
                }

                updateBuyTotal(item, ev)

               

            }
            clickCount = 0;
        }, timeout || 300);
    }
}


// Open te modal when click on list item
var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {

    clicks(ev)
});

var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
    close[i].addEventListener('click', (e) => {
        console.log(e)
        clicks(e)
    })
    // close[i].onclick = function(ev) {
    //   var div = this.parentElement;

    //   div.style.display = "none";
    // }
}

export function saveItem() {
    console.log(window.document.getElementById("itemName"))
    let nameItem = window.document.getElementById("itemName")


    let priceItem = window.document.getElementById("itemPrice")
    let idItem = window.document.getElementById("itemId")
    let quantityItem = window.document.getElementById("itemQuantity")
    console.log("quantity", quantityItem.value)
    var item = new Object()
    item.name = nameItem.value
    item.price = priceItem.value
    if (quantityItem.value == "") {
        item.quantity = 1
    } else {
        item.quantity = quantityItem.value.replace("x", "")
    }

    if (idItem.value != "") {
        item.id = idItem.value
    }
    nameItem.value = ""
    priceItem.value = ""
    quantityItem.value = ""
    idItem.value = ""
    console.log("get", item)
    if (item.id !== undefined) {
        getItemDDB(item.id).then((itemDB) => {

            console.log('update', itemDB, item)
            itemDB.name = item.name
            itemDB.price = item.price
            itemDB.quantity = item.quantity
            updateIndexDB(itemDB)
            location.reload()

            getItems()
        })

    } else {
        console.log('save')
        saveIndexDB(item)
        location.reload()

        getItems()
    }



}

async function getItems() {

    console.log("relaod items")
    getItemsDDB().then((result) => {
        result.forEach(element => {
            console.log(element)
            newElement(element)
        });
    })
}




// Create a new list item when clicking on the "Add" button
function newElement(item) {
    var li = document.createElement("li");
    var inputValue = document.getElementById("myInput");
    console.log("item saved", item)
    inputValue = item.quantity += "x - "
    inputValue += item.name;
    if (item.price !== "") {
        inputValue += " - R$ " + item.price
    }
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("myUL").appendChild(li);
    }

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.id = item.id
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
}

function updateBuyTotal(item, ev) {
    let buyTotal = document.getElementById("buyTotal")
    let total = Number.parseFloat(buyTotal.textContent.replace("R$ ", ""))
    if (ev.target.classList.value == "checked") {
        total += Number.parseFloat(item.quantity * item.price)
    } else {
        if (total > 0) {
            total -= Number.parseFloat(item.quantity * item.price)
        }
    }
    if (total > 0) {
        buyTotal.innerText = "R$ " + total
    } else {
        buyTotal.innerText = "R$ " + total + ",00"
    }
}

getItems()
