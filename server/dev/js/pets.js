// JavaScript Document
window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
    var resPets = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/`);
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
        document.getElementById("pets").href = `https://mypetseal.com/pets/`
        if (jsonUser.premium == true) {
            document.getElementById("premium").innerText = "Premium"
        }
    }
    if (jsonPets.pets == "not found") {
        var petss = document.getElementById("petss");
        document.getElementById("txt").innerText = " no pets found :("
        var but = document.createElement("button");
        var add = document.createElement("img");
        add.src = "/pix/find-btn.png";
        add.id = "add";
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


    } else {
       
        //  var private = document.createElement("button");
        //  private.innerText = "Your Pet";
      
        //private.onclick = async function () {
        //deletePub();
        //     pets.removeChild(private);
        //     pet(jsonPets, jsonUser)
        //  }
        // pets.appendChild(private);
        Pets(jsonPets, jsonUser)



    }
}
async function Pets(jsonPets, jsonUser) {
    const pets = document.getElementById("petss");
    var public = document.createElement("button");
    public.id = "public";
    public.innerText = "Public Pets";
    public.onclick = async function () {
        pub(jsonPets, jsonUser)
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

    })

    pets.appendChild(table);
}
async function pub(jsonPets, jsonUser) {
    deletePriv();
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
        pets.removeChild(private);

        deletePub();
        Pets(jsonPets, jsonUser)
    }
    pets.appendChild(private);
    json.pets.forEach(pet => {
        console.log(pet)


        var img = document.createElement("img");
        var happy = document.createElement("p");
        var owner = document.createElement("p");
        owner.innerHTML = "Owner: " + pet.owner;
        owner.id = "owner";
        pet.pets.forEach(pet1 => {
            if (pet1.public === true) {
                happy.innerHTML = "Happiness: " + pet1.happy + "/100";
                happy.id = "happy";
                img.src = pet1.img;
                img.id = "img";
                var name = document.createElement("p");
                name.id = "name";
                name.innerHTML = pet1.name;
                name.style.fontSize = "30px";
                pets.appendChild(div);
                div.appendChild(name);
                div.appendChild(happy);
                div.appendChild(owner);
                div.appendChild(img);
            }
        })
    })
    pets.removeChild(public);
}
async function deletePub() {
    //  document.getElementById("public").remove();
    document.getElementById("name").remove();
    document.getElementById("happy").remove();
    document.getElementById("owner").remove();
    document.getElementById("img").remove();
    document.getElementById("div").remove();

}
async function deletePriv() {
    if (document.getElementById("pdiv")) {
        document.getElementById("name").remove();
        document.getElementById("happy").remove();
        document.getElementById("img").remove();
        document.getElementById("nameForm").remove();
        document.getElementById("nameInput").remove();
        document.getElementById("sub").remove();
        document.getElementById("pdiv").remove();
    } else {
        document.getElementById("table").remove();

    }



}

async function pet(jsonPets, jsonUser) {
    const publicc = document.createElement("button");
    publicc.innerText = "Public Pets";
    publicc.onclick = async function () {
        window.location.reload();
    }
    const pets = document.getElementById("petss");
    pets.appendChild(publicc);
    if (jsonPets.public == null) {
        var makepub = document.createElement("button");
        makepub.innerText = "Make Pet Public";
        makepub.onclick = async function () {
            var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/setpublic`);
            const json = await res.json()
            console.log(json)
            if (json.success == true) {
                window.location.reload();
            }
        }
        pets.appendChild(makepub);
    }
    if (jsonPets.public == true) {
        var makepub = document.createElement("button");
        makepub.innerText = "Make Pet Private";
        makepub.onclick = async function () {
            var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/removepublic`);
            const json = await res.json()
            console.log(json)
            if (json.success == true) {
                window.location.reload();
            }
        }
        pets.appendChild(makepub);
    }
    var pdiv = document.createElement("div");
    pdiv.id = "pdiv";
    var img = document.createElement("img");
    var happy = document.createElement("p");
    img.id = "img";
    happy.id = "happy";
    happy.innerHTML = "Happiness: " + jsonPets.happy + "/100";
    img.src = jsonPets.img;
    var name = document.createElement("p");
    name.id = "name";
    name.innerHTML = jsonPets.name;
    name.style.fontSize = "30px";
    pets.appendChild(pdiv);
    pdiv.appendChild(name);
    pdiv.appendChild(happy);
    pdiv.appendChild(img);



    var form = document.createElement("form");
    form.action = `/api/pets/${jsonUser.id}/name`;
    form.method = "POST";
    form.enctype = "application/x-www-form-urlencoded";
    form.id = "nameForm";
    form.enterKeyHint = "submit";



    var input = document.createElement("input");
    input.id = "nameInput";
    input.type = "text";
    input.name = "name";
    input.placeholder = "name";
    var sub = document.createElement("input");
    sub.id = "sub";
    sub.type = "submit";
    form.appendChild(input);
    form.appendChild(sub);
    pdiv.appendChild(form);
    if (jsonUser.cookie == true) {
        var butt = document.createElement("button");
        var name = document.createElement("img");
        name.src = "/pix/feed-btn-cookies.png";
        butt.onclick = async function () {
            var res = await fetch(`https://mypetseal.com/api/${jsonUser.id}/pets/feed`, {
                method: "POST"
            });
            const json = await res.json()
            console.log(json)
            if (json.success == true) {
                window.location.reload();

            }
        }
        butt.appendChild(name);
        pdiv.appendChild(butt);
    } else {

        var but = document.createElement("button");
        var name = document.createElement("img");
        name.src = "/pix/feed-btn.png";
        but.onclick = async function () {
            var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/feed`, {
                method: "POST"
            });
            const json = await res.json()
            console.log(json)
            if (json.success == true) {
                window.location.reload();

            }
        }
        but.appendChild(name);
        pdiv.appendChild(but);
    }


}