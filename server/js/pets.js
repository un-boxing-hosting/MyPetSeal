// JavaScript Document
window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
    var resPets = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/all`);
    console.log(resPets)
    const jsonPets = await resPets.json()
    console.log(jsonUser)
    console.log(jsonPets)
    if (jsonUser.name == "no user") {
        document.getElementById("login").innerText = "Login"
        var txt = document.getElementById("txt")
        txt.innerText = `${jsonPets.error}`
        txt.href = "https://youtu.be/Mg9JQHxmneU?t=18"
        return;
    } else {
        document.getElementById("login").innerText = jsonUser.name
        document.getElementById("login").href = "https://mypetseal.com/profile"
        document.getElementById("pets").href = `https://mypetseal.com/pets/${jsonUser.id}/`
        if (jsonUser.premium == true) {
            document.getElementById("premium").innerText = "Premium"
        }
    }
    if (jsonPets.pets == "not found") {

        document.getElementById("txt").innerText = " no pets found :("
        newPet(jsonPets, jsonUser);


    } else {
        //get #public from adress bar
        var url1 = window.location.href;
        var url3 = url1.split("#");

        console.log(url3[0])
        if (url3[0] == "public"){}
        Pets(jsonPets, jsonUser)
    }
}
async function Pets(jsonPets, jsonUser) {
    const pets = document.getElementById("petss");
    var public = document.createElement("button");
    public.id = "public";
    public.innerText = "Public Pets";
    public.onclick = async function () {
         window.location.href = `https://mypetseal.com/pets/public/`
    }
    pets.appendChild(public);

    var table = document.createElement("table")
    table.id = "table";
    table.border = "1";
    table.className = "center";
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    var tr = document.createElement("tr");
    var thName = document.createElement("th");
    thName.innerHTML = "Name";
    thName.scope = "col";
    thName.style.backgroundColor = "#04AA6D";
    tr.appendChild(thName);
    table.appendChild(tr);


    jsonPets.forEach(pet => {
        console.log(pet)
        var tr1 = document.createElement("tr");
        var neme = document.createElement("td")
        var a = document.createElement("a");
        a.href = `https://mypetseal.com/pets/${jsonUser.id}/${pet.url}`;
        a.innerText = pet.name;
        neme.appendChild(a);
        tr1.appendChild(neme);
        table.appendChild(tr1);

    });
    pets.appendChild(table);
    if (jsonUser.premium == true) {
        newPet(jsonPets, jsonUser);
    }
}
async function newPet(jsonPets, jsonUser) {
    var petss = document.getElementById("petss");
    var but = document.createElement("button");
    var add = document.createElement("img");
    add.src = "/pix/find-btn.png";
    but.id = "add";
    but.appendChild(add);
    but.onclick = async function () {
        var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/add`, {
            method: "POST"
        });
        const json = await res.json()
        console.log(json)
        if (json.success == true) {
            window.location.reload();
        }
    }

    petss.appendChild(but);
}
