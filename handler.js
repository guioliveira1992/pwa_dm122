import { saveIndexDB, getItemsDDB, getItemDDB, updateIndexDB, deleteItemIndexDB } from "./store.js"

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
                console.log(item)
                item.name = inputs[0]
                let nameModal = document.getElementById("itemName")
                let priceModal = document.getElementById("itemPrice")
                let idModal = document.getElementById("itemId")

                nameModal.value = item.name
                if (inputs.length > 1) {
                    inputs[1] = inputs[1].replace("R$ ", "")
                    inputs[1] = inputs[1].replace(",", ".")
                    item.price = inputs[1]
                    console.log(typeof (item.price))
                    priceModal.value = item.price
                }

                console.log(item)
                if (item.name != '×' && item.price !== undefined) {
                    modal.style.display = "block";
                    idModal.value = ev.target.childNodes[1].attributes.id.value
                } else {
                    console.log(ev.target.id)
                    deleteItemIndexDB(ev.target.id)
                }

                // Single click code, or invoke a function 
            } else {
                console.log('double click');
                ev.target.classList.toggle('checked');
                // Double click code, or invoke a function 
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
    var item = new Object()
    item.name = nameItem.value
    item.price = priceItem.value
    if (idItem.value != "") {
        item.id = idItem.value
    }
    nameItem.value = ""
    priceItem.value = ""
    idItem.value = ""
    console.log("get", item)
    if (item.id !== undefined) {
        getItemDDB(item.id).then((itemDB) => {

            console.log('update', itemDB, item)
            itemDB.name = item.name
            itemDB.price = item.price
            updateIndexDB(itemDB)
        })

    } else {
        console.log('save')
        saveIndexDB(item)
    }

    location.reload()


    newElement(item)
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
    inputValue = item.name;
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

getItems()
