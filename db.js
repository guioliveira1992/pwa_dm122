import Dexie from "https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.mjs";

const db = new Dexie("buylist");


db.version(1).stores({
  buyList: "++id,name,quantity,price,checked",
});


export function saveIndexDB(item){
    var i = item
    db.buyList.add(item).then(()=>{})
}

export function updateIndexDB(item){
    db.buyList.update(item.id, item).then(()=>{})
}

export async function getItemsDDB(){
    return await db.buyList.toArray()
}

export async function deleteItemIndexDB (itemId) {
    await db.buyList.where("id").equals(Number.parseInt(itemId)).modify(function(value) {
        delete this.value;
    });
}

export async function getItemDDB(itemId){
    return await db.buyList.get({id: Number.parseInt(itemId)})
}

db.open();

