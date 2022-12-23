window.onload = async function () {
    var resUser = await fetch("https://mypetseal.com/api/user/");
    const jsonUser = await resUser.json()
    const url = document.URL.split("/");
    //console.log(url)
    var resForms = await fetch(`https://mypetseal.com/api/forums/${url[4]}`);
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
    var h4 = document.createElement("h4");
    h4.innerText = jsonForms.title;
    h4.className = "title";
    formDiv.appendChild(h4);
    var bdiv = document.createElement("div");
    bdiv.className = "bottom";
    var p = document.createElement("p");
    p.innerText = new Date(jsonForms.date).toLocaleString();
    p.className = "timestamp";
    bdiv.appendChild(p);
    var p2 = document.createElement("p");
    p2.innerText = jsonForms.comments.length + " comments";
    p2.className = "comment-count";
    bdiv.appendChild(p2);
    formDiv.appendChild(bdiv);
    var comdiv = document.createElement("div");

    var text = document.createElement("textarea");
    var btn = document.createElement("button");
    btn.innerText = "Add Comment";
    btn.onclick = async function () {

        addComment({
            content: text.value,
            forum: jsonForms.id,
            date: new Date().toLocaleString(),
            user: {
                id: jsonUser.id,
                name: jsonUser.name
            }
        }, comdiv);
        console.log({
            content: text.value,
            forum: jsonForms.id,
            date: new Date().toLocaleString(),
            user: {
                id: jsonUser.id,
                name: jsonUser.name
            }
        })
        var res = await fetch("https://mypetseal.com/api/forums/addcomment", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: text.value,
                forum: jsonForms.id,
                date: new Date().toLocaleString(),
                user: {
                    id: jsonUser.id,
                    name: jsonUser.name
                }
            })
        })
        console.log(res);
        if (res.success == true) {
            window.alert("Comment added!");
        }
        if (res.success == false) {
            window.alert(res.error)
        }
    }
    comdiv.appendChild(text);
    comdiv.appendChild(btn);
    comdiv.className = "comments";
    formDiv.appendChild(comdiv);

    jsonForms.comments.forEach(comment => {
        addComment(comment, comdiv);
    })




}
async function addComment(comment, formDiv) {
    var cdiv = document.createElement("div");
    cdiv.className = "comment";
    var tcdive = document.createElement("div");
    tcdive.className = "top-comment";
    var p = document.createElement("p");
    p.innerText = comment.user.name;
    p.className = "user";
    tcdive.appendChild(p);
    var p2 = document.createElement("p");
    p2.innerText = new Date(comment.date).toLocaleString();
    p2.className = "comment-timestamp";
    tcdive.appendChild(p2);
    cdiv.appendChild(tcdive);
    var ccdiv = document.createElement("div");
    ccdiv.className = "comment-content";
    var p3 = document.createElement("p");
    p3.innerText = comment.content;
    ccdiv.appendChild(p3);
    cdiv.appendChild(ccdiv);
    formDiv.appendChild(cdiv);

}