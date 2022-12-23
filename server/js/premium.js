// JavaScript Document
window.onload = async function () {

    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
        var resFull = await fetch(`https://mypetseal.com/api/user/full`);
        const jsonFull = await resFull.json()
    console.log(jsonUser)
    if (jsonUser.name == "no user") {
        document.getElementById("login").innerText = "Login"
        return;
    } else {
        document.getElementById("login").innerText = jsonUser.name
        document.getElementById("login").href = "https://mypetseal.com/profile"
        document.getElementById("pets").href = `https://mypetseal.com/pets/${jsonUser.id}/`
        if (jsonUser.premium == true) {
            document.getElementById("premium").innerText = "Premium"
        }
        if (jsonFull.paypal !== undefined) {
            const input = document.getElementById("input");
            var form = document.createElement("input")
            form.type = "text";
            form.id = "amount";
            form.placeholder = "1.00";
			form.value = 1.00;
            var h2 = document.createElement("h2")
            h2.innerText = "Amount in form of \"1.00\" = $1 USD"
            input.appendChild(h2);
            input.appendChild(form);
            document.getElementById("paypal-text").hidden = true;
            document.getElementById("paypal-button-container").hidden = false;
        } else {

        }

    }
}