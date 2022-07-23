window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
    console.log(jsonUser)
    if (jsonUser.name == "no user") {
        document.getElementById("login").innerText = "Login"
    } else {
        document.getElementById("login").innerText = jsonUser.name
        document.getElementById("login").href = "https://mypetseal.com/profile"
        document.getElementById("pets").href = `https://mypetseal.com/pets/`
    }

    var res = await fetch("https://mypetseal.com/api/bg");
    const json = await res.json()
    console.log(json)
    var bg = document.getElementById("bg");
    bg.src = json.img;
}