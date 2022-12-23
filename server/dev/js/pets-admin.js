// JavaScript Document
window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
    var resPets = await fetch(`https://mypetseal.com/api/pets`);
    const jsonPets = await resPets.json()
    console.log(jsonUser)
    console.log(jsonPets)
    await fetch(`https://mypetseal.com/api/pets/allpets`, {
        method: "POST"
    });;
    /*
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
            if (json.success == "true") {
                window.location.reload();
            }
        }

        petss.appendChild(but);


    } else {
        var pets = document.getElementById("petss");

        var img = document.createElement("img");
        var happy = document.createElement("p");
        happy.innerHTML = "Happiness: " + jsonPets.happy + "/100";
        img.src = jsonPets.img;
        var name = document.createElement("p");
        name.innerHTML = jsonPets.name;
        name.style.fontSize = "30px";
        pets.appendChild(name);
        pets.appendChild(happy);
        pets.appendChild(img);

        var form = document.createElement("form");
        form.action = "/api/pets/name";
        form.method = "POST";
        form.enctype = "application/x-www-form-urlencoded";
        form.id = "nameForm";
        form.enterKeyHint = "submit";



        var input = document.createElement("input");
        input.type = "text";
        input.name = "name";
        input.placeholder = "name";
        var sub = document.createElement("input");
        sub.type = "submit";
        form.appendChild(input);
        form.appendChild(sub);
        pets.appendChild(form);

        var but = document.createElement("button");
        var name = document.createElement("img");
        name.src = "/pix/feed-btn.png";
        but.onclick = async function () {
            var res = await fetch("https://mypetseal.com/api/pets/feed", {
                method: "POST"
            });
            const json = await res.json()
            console.log(json)
            if (json.success == "true") {
                window.location.reload();
                return false;
            }
        }
        but.appendChild(name);
        pets.appendChild(but);

    }
    */

}