const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const multer = require('multer');

// MULTER ATTACHMENTS
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:|\./g,'') + ' - ' + file.originalname);    }
});

const upload = multer({
    storage: storage, 
});

// LOAD MIDDLEWARE
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// VERIFY REFRESH TOKEN MIDDLEWARE
let verifySession = ((req, res, next) => {
    let refreshToken = req.header('x-refresh=token');
    let _id = req.header('_id');
    let isSessionValid = false;

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                "error": "User not found"
            })
        }

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiredAt) === false) {
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            return Promise.reject({
                "error": "Refresh Token is expired"
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
})

// END MIDDLEWARE

/* CORS HEADERS MIDDLEWARE */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// LOAD DATABASE
const { mongoose } = require('./database/mongoose');
const { Ticket } = require('./database/models/ticket.model');
const { User } = require('./database/models/user.model')

/* ROUTES */

/* READ ALL */
app.get('/ticket/ticketlist', (req, res) => {
	Ticket.find()
    .select('email subject description image')
	.then(tickets => res.json(tickets))
	.catch(err => res.status(400).json('Error: ' + err));
});


/* CREATE */
app.post('/ticket/ticketlist', upload.single('image'), (req, res) => {
	const email = req.body.email;
    const subject = req.body.subject;
    const description = req.body.description;
    var image;

    try {
        var image = req.file.path;
        console.log('ticket with attachment');
    } catch(err) {
        console.log('ticket with no attachment');
    };

    const newTicket = new Ticket({
        email,
        subject,
   	    description,
        image
    });

    newTicket.save()
     	.then(() => res.json('ticket successfully created.'))
        .catch(err => res.status(400).json('error: ' + err));

});

/* READ */
app.get('/ticket/ticketlist/:id', (req, res) => {
    Ticket.findById(req.params.id)
        .select('email subject description image')
        .then(ticket => res.json(ticket))
        .catch(err => res.status(400).json('error: ' + err));
});

/* DELETE */
app.delete('/ticket/ticketlist/:id', (req, res) => {
    Ticket.findByIdAndDelete(req.params.id)
        .then(ticket => res.json('ticket deleted.'))
        .catch(err => res.status(400).json('error: ' + err));
});

/* USER ROUTES */
app.post('/users', (req, res) => {
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return {accessToken, refreshToken}
        });
    }).then((authToken) => {
        res
            .header('x-refresh-token', authToken.refreshToken)
            .header('x-access-token', authToken.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken}
            });
        }).then((authTokens) => {
            res
                .header('x-refresh-token', authToken.refreshToken)
                .header('x-access-token', authToken.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/users/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/* LISTEN */
app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
});
