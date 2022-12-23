window.onload = async function () {
    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
     var resForms = await fetch("https://mypetseal.com/api/forums/all");
     const jsonForms = await resForms.json()
    console.log(jsonUser)
    console.log(jsonForms)
    if (jsonUser.name == "no user") {
        document.getElementById("login").innerText = "Login"
    } else {
        document.getElementById("login").innerText = jsonUser.name
        document.getElementById("login").href = "https://mypetseal.com/profile"
        document.getElementById("pets").href = `https://mypetseal.com/pets/${jsonUser.id}/`
        if (jsonUser.premium == true) {
            document.getElementById("premium").innerText = "Premium"
        }
    }
    var formDiv = document.getElementById("forms");
    jsonForms.forEach(forum => {
        var li = document.createElement("li");
        li.className = "row";
        var a = document.createElement("a");
        a.href = `https://mypetseal.com/forums/${forum.id}/`;
        var h4 = document.createElement("h4");
         h4.className = "title";
        h4.innerText = forum.title;
        a.appendChild(h4);
        li.appendChild(a);
        var bdiv = document.createElement("div");
        bdiv.className = "bottom";
        var p = document.createElement("p");
        p.innerText = new Date(forum.date).toLocaleString();
        p.className = "timestamp";
        bdiv.appendChild(p);
        var p2 = document.createElement("p");
        p2.innerText = forum.comments.length + " comments";
        p2.className = "comment-count";
        bdiv.appendChild(p2);
        li.appendChild(bdiv);
        formDiv.appendChild(li);
    })


}