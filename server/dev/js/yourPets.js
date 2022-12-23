window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
   
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
            var url = document.URL.split("/");
            console.log(document.URL)
            var resPet = await fetch(`https://mypetseal.com/api/${url[3]}/pets/${url[4]}`);
            console.log(resPet)
            const jsonPet = await resPet.json()


    }  
}