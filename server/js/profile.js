// JavaScript Document
window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
    var resFull = await fetch(`https://mypetseal.com/api/user/full`);
    const jsonFull = await resFull.json()
    // var resPets = await fetch(`https://mypetseal.com/api/pets/`);
    // const jsonPets = await resPets.json()
    console.log(jsonFull)
    //console.log(jsonPets)
    var profile = document.getElementById("profile");
    if (jsonUser.name == "no user") {
        document.getElementById("login").innerText = "Login"
    } else {
        document.getElementById("login").innerText = jsonUser.name
        document.getElementById("login").href = "https://mypetseal.com/profile"
        document.getElementById("pets").href = `https://mypetseal.com/pets/${jsonUser.id}/`
    }
    //if (jsonPets.pets == "not found") {
    // document.getElementById("txt").innerText = " no pets found :("
    //  }
    if (jsonFull.discord !== undefined) {
        var discord = document.createElement("div");
        var liked = document.createElement("p");
        liked.innerHTML = "Discord : Linked";
        var discordName = document.createElement("p");
        discordName.innerHTML = "Discord user name: " + jsonFull.discord.name;
        var discordId = document.createElement("p");
        discordId.innerHTML = "Discord id: " + jsonFull.discord.id;
        var discordEmail = document.createElement("p");
        discordEmail.innerHTML = "Discord email: " + jsonFull.discord.email;
        var discordimg = document.createElement("img");
        discordimg.src = `https://cdn.discordapp.com/avatars/${jsonFull.discord.id}/${jsonFull.discord.avatar}`;
        // discordimg.with = "50px";
        // discordimg.height = "50px";
        profile.appendChild(discord);
        discord.appendChild(liked);
        discord.appendChild(discordName);
        discord.appendChild(discordId);
        discord.appendChild(discordEmail);
        discord.appendChild(discordimg);

    }
    if (jsonFull.discord === undefined) {
        var discord = document.createElement("div");
        var liked = document.createElement("p");
        liked.innerHTML = "Discord : un Linked";
        profile.appendChild(discord);
        discord.appendChild(liked);
    }
    if (jsonFull.google === undefined) {
        var Google = document.createElement("div");
        var liked = document.createElement("p");
        liked.innerHTML = "Google : un Linked";
        profile.appendChild(Google);
        Google.appendChild(liked);
    }
    if (jsonFull.google !== undefined) {
        var Google = document.createElement("div");
        var liked = document.createElement("p");
        liked.innerHTML = "Google : Linked";
        var GoogleName = document.createElement("p");
        GoogleName.innerHTML = "Google user name: " + jsonFull.google.name;
        var GoogleId = document.createElement("p");
        GoogleId.innerHTML = "Google id: " + jsonFull.google.id;
        var GoogleEmail = document.createElement("p");
        GoogleEmail.innerHTML = "Google email: " + jsonFull.google.email;
        var Googleimg = document.createElement("img");
        Googleimg.src = `${jsonFull.google.avatar}`;
        // Googleimg.with = "50px";
        // Googleimg.height = "50px";
        profile.appendChild(Google);
        Google.appendChild(liked);
        Google.appendChild(GoogleName);
        Google.appendChild(GoogleId);
        Google.appendChild(GoogleEmail);
        Google.appendChild(Googleimg);

    }
    if (jsonFull.paypal === undefined) {

        var paypal = document.createElement("div");
        var liked = document.createElement("p");
        liked.innerHTML = "PayPal : un Linked";
        var button = document.createElement("button");
        var img = document.createElement("img");
        img.src = "/pix/log-in-with-paypal-button.png";
        //img.width = "100px";
        // img.height = "50px";
        button.appendChild(img);
        button.onclick = function () {
            window.location.href = "https://mypetseal.com/paypal";
        }

        profile.appendChild(paypal);
        paypal.appendChild(liked);
        paypal.appendChild(button);
    }
    if (jsonFull.paypal !== undefined) {


        var paypal = document.createElement("div");
        var liked = document.createElement("p");
        liked.innerHTML = "PayPal : Linked";
        var paypalName = document.createElement("p");
        paypalName.innerHTML = "PayPal Payer ID: " + jsonFull.paypal.id;
        // var paypalId = document.createElement("p");
        // paypalId.innerHTML = "PayPal id: " + jsonFull.paypal.longID;
        var paypalEmail = document.createElement("p");
        paypalEmail.innerHTML = "PayPal email: " + jsonFull.paypal.email;
        paypal.appendChild(liked);
        paypal.appendChild(paypalName);
        // paypal.appendChild(paypalId);
        paypal.appendChild(paypalEmail);
       // paypal.appendChild(button);
       profile.appendChild(paypal);

    }
    var premium = document.createElement("p");
    premium.innerHTML = "Premium: " + jsonUser.premium;
    profile.appendChild(premium);
    if (jsonUser.cookie == true) {
        var cookie = document.createElement("p");
        cookie.innerHTML = "Cookie: " + jsonUser.cookie;
        profile.appendChild(cookie);
    }
    var logout = document.createElement("button");
    logout.innerHTML = "logout";
    logout.onclick = function () {
        window.location.href = "https://mypetseal.com/logout";
    }
    profile.appendChild(logout);

}