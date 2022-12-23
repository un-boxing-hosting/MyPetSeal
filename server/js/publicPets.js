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
    pub(jsonPets, jsonUser)

}


async function pub(jsonPets, jsonUser) {
    
    const pets = document.getElementById("petss");
    const div = document.createElement("div");
    div.id = "div";

    if (document.getElementById("pdiv")) {
        document.getElementById("pdiv").remove();
    }
    var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/public`);
    const json = await res.json()
    console.log(json)
    var private = document.createElement("button");
    private.innerText = "Your Pets";
    private.onclick = async function () {
       window.location.href = `https://mypetseal.com/pets/${jsonUser.id}/`
    }
    pets.appendChild(private);

    var table = document.createElement("table")
    table.id = "pubTable";
    table.border = "1";
    table.className = "center";
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    var tr = document.createElement("tr");
    var thName = document.createElement("th");
    thName.innerHTML = "Name";
    thName.scope = "col";
    thName.style.backgroundColor = "#04AA6D";
    var thImg = document.createElement("th");
    thImg.innerHTML = "Link";
    thImg.scope = "col";
    thImg.style.backgroundColor = "#04AA6D";
    var thOwner = document.createElement("th");
    thOwner.innerHTML = "Owner";
    thOwner.scope = "col";
    thOwner.style.backgroundColor = "#04AA6D";


    tr.appendChild(thName);
    tr.appendChild(thOwner);
    tr.appendChild(thImg);
    table.appendChild(tr);


    json.pets.forEach(pet => {
        console.log(pet)
        var tr1 = document.createElement("tr");

        var owner = document.createElement("td");
        owner.innerHTML = pet.owner;
        owner.id = `owner-${pet.ownerId}`;
        pet.pets.forEach(pet1 => {
            if (pet1.public === true) {
                var tdImg = document.createElement("td");
                var a = document.createElement("a");
                var img = document.createElement("img");
                var neme = document.createElement("td")
                neme.id = `name-${pet1.url}`;
                neme.innerHTML = pet1.name;
                img.src = pet1.img;
                img.id = "img";
                img.className = "invite-pix";
                a.href = `https://mypetseal.com/pets/${pet.ownerId}/${pet1.url}/`;
                a.appendChild(img);
                tdImg.appendChild(a);
                tr1.appendChild(neme);
                tr1.appendChild(owner);
                tr1.appendChild(tdImg);

            }
            table.appendChild(tr1);
        })


    })

    pets.appendChild(table);


    //pets.removeChild(public);
}