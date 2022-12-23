//#region constants
const bot = require(`./MyPetSeal-bot.js`).bot;

const hostname = `https://mypetseal.com`
const dirname = `MyPetSeal/server`;
const config = require(`./config/config.json`);
const PORT = 8093;
const util = require(`@un-boxing-hosting/boxing-hosting-utils`)
const utils = new util.Client();
const db = new util.db(config.db);
const list = utils.getIDList();
//#region inports
const stafflist = utils.getStaffList();
const fetch = require('node-fetch');
const express = require('express');
const logger = require(`morgan`);
const app = express();
const serveIndex = require('serve-index');
const bodyParser = require("body-parser")
const fs = require("fs-extra");
const favicon = require('serve-favicon');
const httpProxy = require('http-proxy');
//const db = require('quick.db');
const wump = require('wumpfetch');
const {
    json
} = require('body-parser');
var cookieParser = require('cookie-parser');
const uuid = require('uuid').v4
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const PayPalStrategy = require('passport-paypal-oauth').Strategy
var cf = require('cloudflare')({
    email: config.email,
    key: config.cloud
});
//#endregion
//#region app use
//const httpServer = http.createServer(droApp);
app.use(express.json());
app.use(session({
    genid: (req) => {
        return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
}))
app.use(logger(`combined`));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}))
app.set(`view engine`, `ejs`);
app.set(`trust proxy`, true);
//#endregion


//#region site down
/*
app.use('*', async (req, res) => {
    var url = req.baseUrl.split("/")
   // console.log(`"${url[1]}"`)
    if (url[1] == "dev") {
        res.sendFile(`index.html`, {
            root: dirname
        })
    } else {
        res.sendFile(`/down.html`, {
            root: dirname
        })
    }
})
*/
//#endregion
app.get("/profile", isLoggedin, async (req, res) => {
    if (req.cookies.id) {
        res.sendFile(`/profile/profile.html`, {
            root: dirname
        });
    } else {
        var user = getName(await db.get(req.user.email))
        res.cookie(`id`, user.id)
        res.sendFile(`/profile/profile.html`, {
            root: dirname
        });
    }


})
app.get(`/login`, async (req, res) => {
    if (req.cookies.id) req.cookies.id.remove;

    res.sendFile(`/login.html`, {
        root: dirname
    });
})
app.get('/logout', (req, res) => {
    req.cookies.id.delete;
    req.logout();
    res.redirect('/');
})
app.get("/failed", (req, res) => {
    res.send("Failed")
})

//#region PETS
app.get(`/pets/`, isLoggedin, async (req, res) => {
 if (req.isAuthenticated) {
     console.log("yes")
             if (req.cookies.id == undefined) {
                 res.sendFile(`/pets/yourPets.html`, {
                     root: dirname
                 });
             }
     res.redirect(`/pets/${req.cookies.id}/`)
     return;
 }
 res.sendFile(`/pets/yourPets.html`, {
     root: dirname
 });
})
app.get(`/pets`, isLoggedin, async (req, res) => {
    if(req.isAuthenticated){
        console.log("yes")
        if(req.cookies.id == undefined){
             res.sendFile(`/pets/yourPets.html`, {
                 root: dirname
             });
            }
        res.redirect(`/pets/${req.cookies.id}/`)
        return;
    }
    res.sendFile(`/pets/yourPets.html`, {
        root: dirname
    });
})
app.get("/pets/:id/*", isLoggedin, async (req, res) => {
    var id = req.params.id;
    var url = req.url.split("/");
    var email = await db.get(`${id}`);
    var pets = await db.get(`${email}.pets`)
    //get the pet from the aray that matches the name
    console.log(id + " id")
    console.log(email + " email")
    console.log(url[3])
    if (url[2] == "public") {
        res.sendFile(`/pets/public.html`, {
            root: dirname
        })
    } else if (url[3] == "") {
        res.sendFile(`/pets/pets.html`, {
            root: dirname
        })

    } else {
        var pet = pets.find(pet => pet.name == url[3]);
        console.log(pet)
        res.sendFile(`/pets/yourPets.html`, {
            root: dirname
        })
    }

    // res.send("pets is under maintenance")
    // res.sendFile(`/pets/pets.html`, {
    //     root: dirname
    // })

})
app.get(`/dev/pets/:id/*`, async (req, res) => {
    var id = req.params.id;
    var url = req.url.split("/");
    var email = await db.get(`${id}`);
    var pets = await db.get(`${email}.pets`)
    //get the pet from the aray that matches the name
    console.log(id + " id")
    console.log(email + " email")
    console.log(url[4])
    if (url[4] == "") {
        res.sendFile(`/pets/pets.html`, {
            root: dirname
        })
    } else {
        var pet = pets.find(pet => pet.name == url[4]);
        console.log(pet)
        res.sendFile(`/pets/yourPets.html`, {
            root: dirname
        })
    }


})
app.get("/pets/admin", async (req, res) => {
    const staffIDlist = await stafflist;
    if (staffIDlist.list.includes(await db.get(`${req.user.email}.discord.id`))) {
        res.sendFile(`/pets/staff.html`, {
            root: dirname
        })
    } else {
        res.sendStatus(403)
    }

})

//#endregion

//#region Forums
app.get("/forums/*", isLoggedin, async (req, res) => {
    var url = req.url.split("/")
    console.log(url[2])
    var forums = await db.get(`forums`);
    if (url[2] == "") {
        res.sendFile(`/forums/forums.html`, {
            root: dirname
        })
    } else {
        // var forum = forums.find(forum => forum.id == id);
        //console.log(forum)
        res.sendFile(`/forums/forum.html`, {
            root: dirname
        })
    }
})

//#region API

app.get('/api/bg', async (req, res) => {

    var bg = await db.get(`background`)
    // console.log(bg)
    //console.log("ssss")
    if (bg == null) {
        console.log("work")
        const ress = await wump("https://gallery.fluxpoint.dev/api/album/66", {
            headers: {
                'Authorization': config.fluxtoken
            }
        }).send()

        const json = await ress.json()

        console.log(json.file)
        await db.set(`background`, json.file)
    }
    var bg1 = await db.get(`background`)
    console.log(bg1)

    res.send({
        img: bg1
    })
    //res.send(hi)


})
app.get('/api/forums/*', async (req, res) => {
    var url = req.url.split("/");
    var id = url[3]
    var forums = await db.getArray(`forums`)

    // var forum = forums.find(forum => forum.id == id);
    if (id == "all") {
        res.send(forums)
    } else {
        console.log(forums)
        forums.forEach(forum => {
            if (forum.id == id) {
                res.send(forum)
                return;
            }
        })

    }
})
app.post('/api/forums/*', async (req, res) => {
    var url = req.url.split("/");
    var id = url[3]
    var user = getName(await db.get(req.user.email))
    var formid = await db.get("foruamid");
    //var forums = await db.get(`forums`)
    console.log(url[3])
    switch (url[3]) {
        case "new":
            await db.push(`forums`, {
                title: req.body.title,
                id: formid + 1,
                description: req.body.description,
                author: user.email,
                comments: []
            })
            break;
        case "addcomment":
            console.log(req.body)
            var forums = await db.getArray(`forums`)
            var newForum = []
            forums.forEach(forum => {
                if (forum.id == req.body.forum) {
                    forum.comments.push({
                        content: req.body.content,
                        forum: req.body.forum,
                        date: req.body.date,
                        user: {
                            id: req.body.user.id,
                            name: req.body.user.name
                        }
                    })
                    console.log(forum.comments)
                    newForum.push(forum)
                    return;
                } else {
                    newForum.push(forum)
                }
            })
            console.log(newForum)
            setTimeout(async () => {
                db.set(`forums`, [newForum])
                res.send({
                    success: true
                })
            }, 5000)
    }
})
app.get("/api/user/*", isLoggedin, async (req, res) => {
    if (req.path.slice(10) == "") {
        if (req.user == null) {
            res.send({
                name: "no user",
                id: "no user"
            })
            return;
        }
        var user = undefined;
        if (req.cookies.id) {
            var e = await db.get(req.cookies.id)
            user = await db.get(e)
        } else {
            user = await db.get(req.user.email)
        }
        console.log(user)
        if (user == null) {
            res.send({
                name: "no user",
                id: "no user"
            })
            return;
        }
        console.log(user)
        var premium = false;
        if (user.premium == true) {
            premium = true;
        }
        var cookie = false;
        if (user.cookie == true) {
            cookie = true;
        }
        if (user.discord !== undefined && user.discord !== null) {
            res.send({
                name: user.discord.name,
                id: user.discord.id,
                premium: premium,
                cookie: cookie
            })
            return;
        }
        if (user.google != undefined && user.google != null) {
            res.send({
                name: user.google.name,
                id: user.google.id,
                premium: premium,
                cookie: cookie
            })
            return;
        }
    }
    if (req.path.slice(10) == "full") {
        if (req.user == undefined) {
            res.send({
                name: "no user",
                id: "no user"
            })
            return;
        }
        var user = undefined;
        if (req.cookies.id) {
            var e = await db.get(req.cookies.id)
            user = await db.get(e)
        } else {
            user = await db.get(req.user.email)
        }
        // console.log(user)
        if (user.discord !== undefined) {
            res.send(user)
            return;
        }
        if (user.google != undefined) {
            res.send(user)
            return;
        }
    }

})
app.get("/api/pets/:id/*", async (req, res) => {

    if (req.user == undefined) {
        res.send({
            error: "You must be logged in to view this page. 🐟"
        })
        return;
    }
    // var user = await db.get(req.user.email)
    var id = req.params.id;
    var email = await db.get(`${id}`);
    var pets = await db.get(`${email}.pets`)
    var url = req.url.split("/")
    console.log(email)
    console.log(pets)
    console.log(url[4])
    if (pets == null) {
        res.send({
            pets: "not found"
        })
        return;
    }
    //if (pets.find(pet => pet.url == url[4]) == undefined ) {
    switch (url[4]) {
        case "all":
            var petsNew = await updateHappy(email)
            res.send(petsNew)
            return;
        case `public`:
            var public = await db.getArray(`public_pets`)

            console.log(public)
            var public_pets = []

            await public.forEach(async email => {


                updateHappy(email)
                var user = await db.get(email)
                var owner = getName(user)
                if (user.pets.name !== undefined) {
                    console.log("update pets to aray")
                    var pet = user.pets;
                    console.log(pet)
                    setTimeout(async () => {
                        db.set(`${email}.pets`, [pet])
                    }, 10000)
                }
                var newpets = [];
                var run = false;
                user.pets.forEach(async pet => {
                    //console.log(pet.url)
                    if (pet.owner == undefined) {
                        pet.owner = owner.name
                        newpets.push(pet)
                        run = true;
                        return;
                    }
                    if (pet.url == undefined) {
                        //get pet.name and replace spaces with - and make it work in url 
                        var url = pet.name.replace(/\s+/g, '-').toLowerCase();
                        pet.url = url;
                        console.log(pet.url)
                        newpets.push(pet)
                        run = true;
                        return;
                    }
                    newpets.push(pet);
                })
                if (run == true) {
                    setTimeout(async () => {
                        console.log(newpets)
                        db.set(`${email}.pets`, newpets)
                        run = false;
                    }, 10000)

                }

                //console.log(petsNew)
                if (user.pets != undefined) {
                    public_pets.push({
                        owner: owner.name,
                        ownerId: owner.id,
                        pets: user.pets
                    })
                }
            })
            console.log(public_pets)
            setTimeout(async () => {

                res.send({
                    pets: public_pets
                })
            }, 1000)
            return;

    }

    // }
    //res.send(pets)
    switch (url[5]) {
        case "del-public":
            db.delete(`public_pets`)
            res.send("Deleted")
            break
        case "setpublic":
            var user = await db.get(email)
            var owner = getName(user)
            var public = await db.getArray(`public_pets`)
            console.log(public)
            if (public != null) {
                console.log(public)
                if (public.includes(owner.email)) {
                    res.send({
                        success: false,
                        error: "You already have a pet public"
                    })
                    return;
                } else {
                    db.push(`public_pets`, owner.email)
                }
            }
            var newpets = [];
            pets.forEach(async pet => {
                if (pet.url == url[4]) {
                    pet.public = true;
                    newpets.push(pet)
                    return;
                }
                newpets.push(pet)
            })
            setTimeout(async () => {
                db.set(`${email}.pets`, newpets)
                res.send({
                    success: true
                })
            }, 3000)


            break;
        case "removepublic":
            var user = await db.get(email)
            var owner = getName(user)
            var public = await db.getArray(`public_pets`)

            if (public != null) {
                console.log(public)
                if (public.includes(owner.email)) {
                    db.pull(`public_pets`, owner.email)
                }
            }
            var newpets = [];
            pets.forEach(async pet => {
                if (pet.url == url[4]) {
                    pet.public = false;
                    newpets.push(pet)
                    return;
                }
                newpets.push(pet)
            })
            setTimeout(async () => {
                db.set(`${email}.pets`, newpets)
                res.send({
                    success: true
                })
            }, 3000)
            break;
        default:
            if (pets == null) {
                res.send({
                    pets: "not found"
                })
                return;
            }
            if (pets.name !== undefined) {
                console.log("update pets to aray")
                var pet = pets;
                console.log(pet)
                setTimeout(async () => {
                    db.set(`${email}.pets`, [pet])
                }, 2000)
            }
            var newpets = [];
            var run = false;
            pets.forEach(async pet => {
                //console.log(pet.url)
                if (pet.url == undefined) {
                    //get pet.name and replace spaces with - 
                    var url = pet.name.replace(/\s+/g, '-').toLowerCase();
                    pet.url = url;
                    console.log(pet.url)
                    newpets.push(pet)
                    run = true;
                    return;
                }
                newpets.push(pet);
            })
            if (run == true) {
                setTimeout(async () => {
                    console.log(newpets)
                    db.set(`${email}.pets`, newpets)
                    run = false;
                }, 10000)

            }

            var petsNew = await updateHappy(email)
            console.log(petsNew + " new")
            var pet = pets.find(pet => pet.url == url[4]);
            console.log(pet)
            res.send(pet)
            //console.log()
            //res.send("pet")
    }

})
app.post("/api/pets/:id/*", async (req, res) => {
    var id = req.params.id;
    // var user = await db.get(req.user.email)
    var email = await db.get(`${id}`);
    var pets = await db.get(`${email}.pets`)
    //console.log(pets)

    const url = req.url.split("/")
    console.log(url[4])
    if (url[4] == "add") {
        console.log("add")
        var seal = await getSeal()
        console.log(seal)

        var pets = await db.get(`${email}.pets`)
        var petsa = await db.getArray(`${email}.pets`)
        var owner = getName(await db.get(`${email}`))
        console.log(pets)
         if (pets == undefined) {
            console.log("no pets")
             setTimeout(async () => {
                 await db.set(`${email}.pets`, [{
                     img: seal,
                     name: "Seal",
                     happy: 100,
                     time: getTime(),
                     public: false,
                     url: "seal",
                     owner: owner.name,
                 }])
                 res.send({
                     success: true
                 })
             }, 5000)
             return;
         } 
         var pets = await db.get(`${email}.pets`)
         if (pets.length >= 1) {
            console.log("add")
            var owner = getName(await db.get(`${email}`))
            console.log(owner)
            var newpets = [];
            pets.forEach(async pet => {
                newpets.push(pet);
            })
            console.log(petsa)
            newpets.push({
                img: seal,
                name: "Seal",
                happy: 100,
                time: getTime(),
                public: false,
                url: "seal",
                owner: `${owner.name}`,
            })
            setTimeout(async () => {
                console.log(newpets)
                db.set(`${email}.pets`, newpets)
                res.send({
                    success: true
                })
            }, 5000)
        }

      


        // console.log(pets + " pet1")
        // console.log(Array.isArray(pets) + " length");


        return;

    }
    if (pets.find(pet => pet.url == url[4]) == undefined) {
        switch (url[4]) {
            case "add":
                console.log("add1")
                var seal = await getSeal()
                console.log(seal)

                var pets = await db.get(`${email}.pets`)
                if (pets.length >= 1) {
                    var owner = getName(await db.get(`${email}`))
                    console.log(owner)
                    var newpets = [];
                    pets.forEach(async pet => {
                        newpets.push(pet);
                    })
                    newpets.push({
                        img: seal,
                        name: "Seal",
                        happy: 100,
                        time: getTime(),
                        public: false,
                        url: "seal",
                        owner: `${owner.name}`,
                    })
                    setTimeout(async () => {
                        console.log(newpets)
                        db.set(`${email}.pets`, newpets)
                        res.send({
                            success: true
                        })
                    }, 5000)
                } else {
                    setTimeout(async () => {
                        await db.set(`${email}.pets`, [{
                            img: seal,
                            name: "Seal",
                            happy: 100,
                            time: getTime(),
                            public: false,
                            url: "seal",
                            owner: owner.name,
                        }])
                        res.send({
                            success: true
                        })
                    })
                }

                break;
        }
        return;
    }
    // var pet = pets.find(pet => pet.url == url[4])
    switch (url[5]) {

        case "name":

            //console.log(req)
            var newpets = [];
            var newname = "";
            pets.forEach(async pet => {

                if (pet.url == url[4]) {
                    //remove spaces and make lowercase and remove special characters
                    var urll = req.body.name.replace(/\s+/g, '-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
                    newname = urll
                    pet.url = urll;
                    pet.name = req.body.name
                    newpets.push(pet)
                    return;
                }
                newpets.push(pet);
            })
            setTimeout(async () => {
                db.set(`${email}.pets`, pets)
                res.redirect(`/pets/${id}/${newname}`)
            }, 1000)
            // await db.set(`${req.user.email}.pets.name`, req.body.name)


            break;
        case "feed":
            var newpets = [];
            pets.forEach(async pet => {
                if (pet.url == url[4]) {
                    pet.happy = 100;
                    pet.time = getTime();
                    newpets.push(pet)
                    return;
                }
                newpets.push(pet);
            })
            setTimeout(async () => {
                db.set(`${email}.pets`, pets)
                res.send({
                    success: true
                })
            }, 5000)

            break;

        case "allpets":
            var all = await db.fetchAll()
            all.forEach(itom => {
                if (itom.data.com.pets !== undefined) {
                    console.log(itom.data.com.pets)
                }
                console.log(itom.data.com)

            })
            //console.log(all[0].data)
            res.send({
                success: true
            })
            break;
        default:
            res.send({
                success: false,
                pets: "not found"
            })
            break;
    }


    // res.send("added pet")

})
app.get('/api/owner/*', async (req, res) => {
    var url = req.url.split("/")
    switch (url[3]) {
        case "premove":
            var id = req.cookies.id
            var email = await db.get(`${id}`)
            setTimeout(async () => {
                await db.set(`${email}.premium`, false)
                res.send({
                    success: true
                })
            }, 5000)
            break;
        case "form":
            await db.push(`forums`, {
                title: "first post",
                id: 1,
                date: new Date().toLocaleString(),
                description: "hello",
                author: "conner2004car@gmai.com",
                comments: []
            })
            setTimeout(async () => {
                db.set(`foruamid`, "1")
                res.send({
                    success: true
                })
            }, 5000)

    }
})
app.get('/api/linked-role', async (req, res) => {
    
})
app.get('/linked-role/callback', async (req, res) => {


})
//#endregion

//#region login handling

app.get('/paypal', passport.authenticate('paypal', {
    scope: 'openid email https://uri.paypal.com/services/paypalattributes'
}), (req, res) => {
    console.log(req.user)
    res.send("done")
});
app.get('/paypal/callback', passport.authenticate('paypal', {
        failureRedirect: '/failed'
    }),
    async function (req, res) {
        //console.log(req.user)
        //console.log(req.cookies)
        var id = req.cookies.id

        var email = await db.get(`${id}`)
        //var user = db.get(`${email}`)
        setTimeout(async () => {
            db.set(`${req.payer_id}`, `${id}`)
        }, 10000)
        setTimeout(async () => {
            //  console.log(`id: ${req.payer_id} \n email: ${req.email} \n user: ${req.id}`)
            db.set(`${email}.paypal`, {
                id: req.user.payer_id,
                email: req.user.email,
                longID: req.user.id
            })
            setTimeout(async () => {
                db.set(`${req.user.payer_id}`, `${id}`)
            }, 5000)
            res.redirect("/profile")
        }, 5000)
    });
app.post(`/api/paypal/*`, async (req, res) => {
    var url = req.url.split("/")
    //console.log(req)

    switch (url[3]) {
        case `callback`:
            console.log("callback")
            res.send(200)
            break;
        case `sale`:
            res.send(200)

            break;
        case `finshed`:
            var id = await db.get(`${req.body.payerID}`)
            var email = await db.get(`${id}`)
            setTimeout(async () => {
                db.set(`${email}.premium`, true)
                console.log(email + " is now premium")
                res.send(200)
            }, 5000)
            break;

    }

})
app.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));
app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),

    async function (req, res) {

        res.cookie("id", req.user.sub)


        console.log(req.user)
        setTimeout(async () => {
            db.set(req.user.sub, req.user.email)
        }, 3000)

        await db.set(`${req.user.email}.google`, {
            id: req.user.sub,
            name: req.user.name,
            avatar: req.user.picture,
            email: req.user.email
        })
        res.redirect('/');
    }
)
app.get('/discord', passport.authenticate('discord'));
app.get('/discord/callback',
    passport.authenticate('discord', {
        failureRedirect: '/failed',
    }),

    async function (req, res) {
        res.cookie("id", req.user.id)
        //var user = await db.get(req.user.email)
        setTimeout(async () => {
            db.set(req.user.id, req.user.email)
        })


        await db.set(`${req.user.email}.discord`, {
            id: req.user.id,
            name: req.user.username,
            avatar: req.user.avatar,
            email: req.user.email
        })

        // console.log(req.user)

        res.redirect('/')

    }
);

//#endregion

//#region pages
app.use(favicon(`${dirname}/pix/favicon.ico`))
app.use(express.static(dirname + "/"))
app.use('/', express.static(dirname));
app.use(`/Privacy-Policy`, express.static(dirname + '/Privacy-Policy.html'));
app.use('/terms-of-service', express.static(dirname + '/Terms-of-Service.html'));
app.use('/Terms-of-Service', express.static(dirname + '/Terms-of-Service.html'));
app.set('Access-Control-Allow-Methods', 'GET,POST')
app.use(`/premium`, express.static(dirname + '/premium.html'));
app.use(`/contact`, express.static(dirname + '/contact.html'));
app.use(`/about`, express.static(dirname + '/about.html'));
app.use(`/support`, function (req, res) {
    res.redirect(`https://discord.gg/yqZRP6ujgM`)
    res.status(302).end();
})
app.get(`*`, function (req, res) {
    res.status(404).sendFile(`/404.html`, {
        root: dirname
    })
})
//#endregion

//#region functions

setInterval(async () => {
        const res = await wump("https://gallery.fluxpoint.dev/api/album/66", {
            headers: {
                'Authorization': config.fluxtoken
            }
        }).send()
        const json = await res.json()
        console.log(json.file)
        await db.set(`background`, json.file)
    },
    300000)
//check if user is logged in
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    if (req.url.includes("api")) {
        res.send({
            name: "no user",
            id: "no user"
        })
        return;
    }
    res.redirect('/login');
}

function getName(user) {
    if (user.discord !== null && user.discord !== undefined) {
        var send = {
            email: user.discord.email,
            name: user.discord.name,
            id: user.discord.id
        }
        //db.set(user.discord.id, user.discord.email)
        return send;
    }
    if (user.google != null && user.google != undefined) {
        var send = {
            email: user.google.email,
            name: user.google.name,
            id: user.google.id
        }
        //db.set(user.google.id, user.google.email)
        return send;
    }
}

function getTime() {
    var t = new Date()
    var d = t.getDate();
    var m = t.getMonth();
    var y = t.getFullYear();
    var h = t.getHours();
    var min = t.getMinutes();
    var s = t.getSeconds();
    var time = `${y}-${m + 1}-${d} ${h}:${min}:${s}`
    //console.log(time)
    return time;
}

async function getFood(pet) {
    //console.log(getTime())
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;


    var timeNow = new Date(getTime());
    var happy = pet.happy
    var time = new Date(pet.time) //user.pets.time
    //  console.log(time)
    var sub = timeNow - time
    var days = Math.floor(sub / day);
    var hours = Math.floor((sub % day) / hour);
    if (days > 0) {
        var dh = Math.floor(days * 24 + hours)
        var newHappy = Math.floor(happy - (dh * 2))
    } else {
        console.log(hours)
        var newh = Math.floor(hours * 2)
        //console.log(hours + " new")
        // console.log(happy)
        var newHappy = Math.floor(happy - newh)
    }

    // subtract 2 for evey hour
    console.log(newHappy)
    return newHappy
}

async function getSeal() {
    const ress = await wump("https://gallery.fluxpoint.dev/api/album/66", {
        headers: {
            'Authorization': config.fluxtoken
        }
    }).send()

    const json = await ress.json()
    console.log(json.file)
    return json.file
}
async function updateHappy(email) {
    /*
     if (await db.get(`${email}.pets.happy`) == undefined) {
         db.set(`${email}.pets.happy`, 100)
     }
     if (await db.get(`${email}.pets.time`) == undefined) {
         db.set(`${email}.pets.time`, getTime())
     }
     */
    var newPets = [];
    var petList = await db.get(`${email}.pets`)
    petList.forEach(async (pet) => {

        var newHapy = await getFood(pet);
        // console.log(newHapy)
        pet.happy = newHapy;
        pet.time = getTime();
        // db.set(`${email}.pets.happy`, newHapy)
        // console.log(getTime())
        // db.set(`${email}.pets.time`, getTime())
        newPets.push(pet);
    })
    setTimeout(async () => {
        await db.set(`${email}.pets`, newPets)
    }, 5000)
    var newPetList = await db.get(`${email}.pets`)
    return newPetList;
}

passport.use(new PayPalStrategy({
    sandbox: false,
    clientID: config.paypalID,
    clientSecret: config.paypalsecret,
    callbackURL: hostname + "/paypal/callback"
}, function (accessToken, refreshToken, profile, next) {
    console.log(profile)
    return next(null, profile);
}));

passport.use(new GoogleStrategy({
        clientID: config.googleID,
        clientSecret: config.googlesecret,
        callbackURL: `${hostname}/google/callback`,
    },
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile._json);
    }
));
var scopes = ['identify', 'email'];
passport.use(new DiscordStrategy({
        clientID: config.botID,
        clientSecret: config.botsecret,
        callbackURL: `${hostname}/discord/callback`,
        scope: scopes
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }));
async function login(code) {
    //console.log(`${hostname}/bots/${name}`)
    try {
        const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: config.botID,
                client_secret: config.botsecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: `${hostname}/authed`,
                scope: 'identify',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const oauthData = await oauthResult.json();

        //console.log(oauthData);
        const userResult = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            },
        });

        const user = await userResult.json();
        // console.log(user.username)
        // invite(user.username + "#" + user.discriminator, name, oauthData.guild.name, user.id)
        //console.log(await userResult.json());
    } catch (error) {
        // NOTE: An unauthorized token will not throw an error;
        // it will return a 401 Unauthorized response in the try block above
        console.error(error);
    }

}
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});


//#endregion

//Testing stuff
app.listen(PORT, () => {
    console.log(`my pet seal Listening on port ${PORT}`)
})

app.set("port", PORT);
module.exports = {
    app
}