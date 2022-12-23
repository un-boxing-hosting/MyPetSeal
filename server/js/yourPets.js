window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
    // console.log(jsonUser)
    // console.log(jsonPets)
    if (jsonUser.name == "no user") {
        document.getElementById("login").innerText = "Login"
        var txt = document.getElementById("txt")
        txt.innerText = `${jsonPets.error}`
        txt.href = "https://youtu.be/Mg9JQHxmneU?t=18"
        return;
    } else {
        const url = document.URL.split("/");
        var resPets = await fetch(`https://mypetseal.com/api/pets/${url[4]}/${url[5]}`);
        console.log(resPets)
        const jsonPets = await resPets.json()
        document.getElementById("login").innerText = jsonUser.name
        document.getElementById("login").href = "https://mypetseal.com/profile"
        document.getElementById("pets").href = `https://mypetseal.com/pets/${jsonUser.id}/`
        if (jsonUser.premium == true) {
            document.getElementById("premium").innerText = "Premium"
        }

        console.log(document.URL)
        // change to 3 and 4


        pet(jsonPets, jsonUser)
    }
}
async function notOwn(jsonPets, jsonUser) {
    document.getElementById("makepub").remove()
}
async function pet(jsonPets, jsonUser) {
    const publicc = document.createElement("button");
    publicc.innerText = "Public Pets";
    publicc.onclick = async function () {
        window.location.href = `https://mypetseal.com/pets/public/`; //?public`;
    }
    const pets = document.getElementById("petss");
    pets.appendChild(publicc);
    var private = document.createElement("button");
    private.id = "private";
    private.innerText = "Your Pets";
    private.onclick = async function () {
        window.location.href = `https://mypetseal.com/pets/${jsonUser.id}/`;
    }
    pets.appendChild(private);
    if (jsonPets.public == null || jsonPets.public == false) {
        var makepub = document.createElement("button");
        makepub.innerText = "Make Pet Public";
        makepub.id = "makepub"
        makepub.onclick = async function () {
            var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/${jsonPets.url}/setpublic`);
            const json = await res.json()
            console.log(json)
            if (json.success == true) {
                window.location.reload();
            }
            if (json.success == false) {
                window.alert(json.error)
            }
        }
        pets.appendChild(makepub);
    }
    if (jsonPets.public == true) {
        var makepub = document.createElement("button");
        makepub.id = "makepub";
        makepub.innerText = "Make Pet Private";
        makepub.onclick = async function () {
            var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/${jsonPets.url}/removepublic`);
            const json = await res.json()
            console.log(json)
            if (json.success == true) {
                window.location.reload();
            }
            if (json.success == false) {
                window.alert(json.error)
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
    img.className - "img"
    var name = document.createElement("p");
    name.id = "name";
    name.innerHTML = jsonPets.name;
    name.style.fontSize = "30px";
    pets.appendChild(pdiv);
    pdiv.appendChild(name);
    if (jsonPets.owner !== jsonUser.name) {
        var owner = document.createElement("p");
        owner.id = "owner";
        owner.innerHTML = "Owner: " + jsonPets.owner;
        pdiv.appendChild(owner);
    }
    pdiv.appendChild(happy);
    pdiv.appendChild(img);


    if (jsonPets.owner == jsonUser.name) {
        var form = document.createElement("form");
        form.action = `/api/pets/${jsonUser.id}/${jsonPets.url}/name`;
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
                var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/${jsonPets.url}/feed`, {
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
                var res = await fetch(`https://mypetseal.com/api/pets/${jsonUser.id}/${jsonPets.url}/feed`, {
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
    } else {
        notOwn(jsonPets, jsonUser);
    }

}