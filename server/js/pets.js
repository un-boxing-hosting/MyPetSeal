// JavaScript Document
window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
    var resPets = await fetch(`https://mypetseal.com/api/pets/`);
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
        document.getElementById("pets").href = `https://mypetseal.com/pets`
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
            var res = await fetch("https://mypetseal.com/api/pets/add", {
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

        const pets = document.getElementById("petss");
        var public = document.createElement("button");
        public.id = "public";
        const div = document.createElement("div");
        div.id = "div";
        public.innerText = "Public Pets";
        var private = document.createElement("button");
        private.innerText = "Your Pet";
        public.onclick = async function () {
            if (document.getElementById("pdiv")) {
                document.getElementById("pdiv").remove();
            }
            var res = await fetch("https://mypetseal.com/api/pets/public");
            const json = await res.json()
            console.log(json)

            private.onclick = async function () {
                pets.removeChild(private);

                deletePub();
                pet(jsonPets)
            }
            pets.appendChild(private);
            json.pets.forEach(pet => {
                console.log(pet)


                var img = document.createElement("img");
                var happy = document.createElement("p");
                var owner = document.createElement("p");
                owner.innerHTML = "Owner: " + pet.owner;
                owner.id = "owner";
                happy.innerHTML = "Happiness: " + pet.pets.happy + "/100";
                happy.id = "happy";
                img.src = pet.pets.img;
                img.id = "img";
                var name = document.createElement("p");
                name.id = "name";
                name.innerHTML = pet.pets.name;
                name.style.fontSize = "30px";
                pets.appendChild(div);
                div.appendChild(name);
                div.appendChild(happy);
                div.appendChild(owner);
                div.appendChild(img);
            })
            pets.removeChild(public);
        }
        pets.appendChild(public);
        private.onclick = async function () {
            //deletePub();
            pets.removeChild(private);
            pet(jsonPets)
        }
        pets.appendChild(private);




    }
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

    document.getElementById("name").remove();
    document.getElementById("happy").remove();
    document.getElementById("img").remove();
    document.getElementById("nameForm").remove();
    document.getElementById("nameInput").remove();
    document.getElementById("sub").remove();
    document.getElementById("pdiv").remove();

}

async function pet(jsonPets) {
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
            var res = await fetch("https://mypetseal.com/api/pets/setpublic");
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
            var res = await fetch("https://mypetseal.com/api/pets/removepublic");
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
    form.action = "/api/pets/name";
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

    var but = document.createElement("button");
    var name = document.createElement("img");
    name.src = "/pix/feed-btn.png";
    but.onclick = async function () {
        var res = await fetch("https://mypetseal.com/api/pets/feed", {
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