//#region constants
const hostname = `https://mypetseal.com`
const dirname = `MyPetSeal/server`;
const config = require(`./config/config.json`);
const PORT = 8093;
const util = require(`@un-boxing-hosting/boxing-hosting-utils`)
const utils = new util();
const list = utils.getIDList();
const stafflist = utils.getStaffList();
//const fetch = require(`node-fetch`);
const express = require('express');
const logger = require(`morgan`);
const app = express();
const serveIndex = require('serve-index');
const bodyParser = require("body-parser")
const fs = require("fs-extra");
const favicon = require('serve-favicon');
const httpProxy = require('http-proxy');
const db = require('quick.db');
const wump = require('wumpfetch');
const {
    json
} = require('body-parser');
const uuid = require('uuid').v4
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var cf = require('cloudflare')({
    email: config.email,
    key: config.cloud
});
//const httpServer = http.createServer(droApp);
app.use(bodyParser.json());
app.use(session({
    genid: (req) => {
        return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}))
app.use(logger(`combined`));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({
    extended: true
}))
app.set(`view engine`, `ejs`);
app.set(`trust proxy`, true);
//#endregion
setInterval(async () => {
        const res = await wump("https://gallery.fluxpoint.dev/api/album/66", {
            headers: {
                'Authorization': config.fluxtoken
            }
        }).send()
        const json = await res.json()
        console.log(json.file)
        db.set(`background`, json.file)
    },
    300000)

app.get('/api/bg', async (req, res) => {

    var bg = db.get(`background`)
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
        db.set(`background`, json.file)
    }
    var bg1 = db.get(`background`)
    console.log(bg1)
    res.send({
        img: bg1
    })
    //res.send(hi)


})
app.get(`/login`, async (req, res) => {
    res.sendFile(`/login.html`, {
        root: dirname
    });
})

app.get("/failed", (req, res) => {
    res.send("Failed")
})
app.get("/api/user/*", (req, res) => {
    if (req.path.slice(10) == "") {
        if (req.user == undefined) {
            res.send({
                name: "no user",
                id: "no user"
            })
            return;
        }
        var user = db.get(req.user.email)
        console.log(user)
        if (user.discord !== undefined && user.discord !== null) {
            res.send({
                name: user.discord.name,
                id: user.discord.id
            })
            return;
        }
        if (user.google != undefined && user.google != null) {
            res.send({
                name: user.google.name,
                id: user.google.id
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
        var user = db.get(req.user.email)
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
app.get("/profile", (req, res) => {
    res.sendFile(`/profile/profile.html`, {
        root: dirname
    });
})
app.get("/pets", (req, res) => {
    res.sendFile(`/pets/pets.html`, {
        root: dirname
    })

})
app.get("/pets/admin", async (req, res) => {
    const staffIDlist = await stafflist;
    if (staffIDlist.list.includes(db.get(`${req.user.email}.discord.id`))) {
        res.sendFile(`/pets/staff.html`, {
            root: dirname
        })
    } else {
        res.sendStatus(403)
    }

})
app.get("/api/pets/*", async (req, res) => {

    if (req.user == undefined) {
        res.send({
            error: "You must be logged in to view this page. 🐟"
        })
        return;
    }
    var user = db.get(req.user.email)
    var pets = db.get(req.user.email).pets
    var url = req.url.split("/")
    console.log(pets)
    console.log(url[3])

    switch (url[3]) {
        case "public":
            var public = db.get(`public_pets`)
            res.send({
                pets: public
            })
            break
        case "setpublic":
            var public = db.get(`public_pets`)
            //get user.dicord.name if undefined get user.google.name
            var name = getName(user).name
            var public = db.get(`public_pets`)




            db.push(`public_pets`, {
                owner: name,
                pets: pets
            })
            res.send({
                success: true
            })
            break;

        default:
            if (db.get(`${req.user.email}.pets.happy`) == undefined) {
                db.set(`${req.user.email}.pets.happy`, 100)
            }
            if (db.get(`${req.user.email}.pets.time`) == undefined) {
                db.set(`${req.user.email}.pets.time`, getTime())
            }
            var newHapy = await getFood(req.user.email);
            console.log(newHapy)
            db.set(`${req.user.email}.pets.happy`, newHapy)
            console.log(getTime())
            db.set(`${req.user.email}.pets.time`, getTime())
            if (pets == null) {
                res.send({
                    pets: "not found"
                })
                return;
            }
            res.send(pets)
            //console.log()
            //res.send("pet")
    }

})
app.post("/api/pets/*", async (req, res) => {
    // var user = db.get(req.user.email)
    var pets = db.get(`${req.user.email}.pets`)
    var url = req.url.split("/")
    console.log(url[3])

    switch (url[3]) {
        case "add":
            console.log("add")
            var seal = await getSeal()
            console.log(seal)
            db.set(`${req.user.email}.pets`, {
                img: seal,
                name: "Seal"
            })
            res.send({
                success: true
            })
            break;
        case "name":

            //console.log(req)
            console.log(req.body)
            db.set(`${req.user.email}.pets.name`, req.body.name)
            res.redirect(`/pets`)
            break;
        case "feed":
            db.set(`${req.user.email}.pets.happy`, 100)
            db.set(`${req.user.email}.pets.time`, getTime())

            res.send({
                success: true
            })
            break;

        case "allpets":
            var all = db.fetchAll()
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

    }

    if (pets == null) {
        res.send({
            pets: "not found"
        })
        //return;
    }


    // res.send("added pet")

})
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));
app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        var user = db.get(req.user.email)
        console.log(req.user)

        db.set(`${req.user.email}.google`, {
            id: req.user.sub,
            name: req.user.name,
            avatar: req.user.picture,
            email: req.user.email
        })
        res.redirect('/');
    }
);
app.get('/discord',
    passport.authenticate('discord'));
app.get('/discord/callback',
    passport.authenticate('discord', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        var user = db.get(req.user.email)
        if (user !== null) {
            db.set(`${req.user.email}.discord`, {
                id: req.user.id,
                name: req.user.username,
                avatar: req.user.avatar,
                email: req.user.email
            })
        }
        // console.log(req.user)
        res.redirect('/')

    }
);


//#region pages
app.use(favicon(`${dirname}/pix/favicon.ico`))
app.use(express.static(dirname + "/"))
app.use('/', express.static(dirname));
app.use(`/Privacy-Policy`, express.static(dirname + '/Privacy-Policy.html'));
app.use('/terms-of-service', express.static(dirname + '/Terms-of-Service.html'));
app.use('/Terms-of-Service', express.static(dirname + '/Terms-of-Service.html'));
app.set('Access-Control-Allow-Methods', 'GET,POST')
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
//getFood("conner2004car@gmail.com")

function getName(user) {
    if (user.discord !== undefined && user.discord !== null) {
        var send = {
            name: user.discord.name,
            id: user.discord.id
        }
        return send;
    }
    if (user.google != undefined && user.google != null) {
        var send = {
            name: user.google.name,
            id: user.google.id
        }

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
    console.log(time)
    return time;
}

async function getFood(email) {
    //console.log(getTime())
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;


    var timeNow = new Date(getTime());
    var user = db.get(email)
    var happy = user.pets.happy
    var time = new Date(user.pets.time) //user.pets.time
    console.log(time)
    var sub = timeNow - time
    var days = Math.floor(sub / day);
    var hours = Math.floor((sub % day) / hour);
    if (days > 0) {
        var dh = Math.floor(days * 24 + hours)
        var newHappy = Math.floor(happy - (dh * 2))
    } else {
        console.log(hours)
        var newh = Math.floor(hours * 2)
        console.log(hours + " new")
        console.log(happy)
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
    console.log(`Listening on port ${PORT}`)
})

app.set("port", PORT);
module.exports = {
    app
}