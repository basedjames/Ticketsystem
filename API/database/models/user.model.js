const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { reject } = require('lodash');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// JWT SECRET
const jwtsecret = "936421741722354593412990683042AKJBFG4448904134";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, 
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

/* INSTANCE METHODS */

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    // RETURN THE DOCUMENT EXEPT OF THE PASSWORD AND SESSIONS
    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function() {
    const user = this;
    return new Promise((resolve, reject) => {
        // CREATE JSON WEB TOKEN FOR AUTH
        jwt.sign({_id: user._id.toHexString()}, jwtsecret, {expiresIn: "15m" }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                // IS AN ERROR
                reject();
            }
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function() {
    // GENERATES 64BYTE HEX STRING, NO SAVE IN DATABASE
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                // NO ERROR
                let token = buf.toString('hex');
                return resolve(token);
            }
        })
    })
}

UserSchema.methods.createSession = function() {
    let user = this;
    
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        // SAVED TO DATABASE SUCCESSFULLY
        // RETURN REFRESH TOKEN
        return refreshToken;
    }).catch((e) => {
        return Promise.reject('Failed to save session to database \n' + e);
    })
}



/* MIDDLEWARE */
UserSchema.pre('save', function(next) {
    let user = this;
    let costfactor = 10;

    if(user.isModified('password')) {
        // IF PASSWORD FIELD IS EDITED OR CHANGED RUN THIS
        // GEN SALT AND HASH PASSWORD
        bcrypt.genSalt(costfactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

/* MODEL METHODS (STATIC) */

UserSchema.statics.findByIdAndToken = function(_id, token) {
    // FINDS USER BY ID AND TOKEN
    // USER IN AUTH MIDDLEWARE
    const User = this;
    return User.findOne({
        _id,
        'sessions.token': token
    });
}

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if (!user) return Promise.reject();

        return new Promise ((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) resolve(user);
                else {
                    reject();
                }
            })
        })
    })

}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    if (expiresAt > secondsSinceEpoch) {
        // HASNT EXPIRED
        return false;
    } else {
        // HAS EXPIRED 
        return true;
    }
}

/* HELPER METHODS */

let saveSessionToDatabase = (user, refreshToken) => {
    // SAVE SESSION TO DATABASE
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({'token': refreshToken, expiresAt});

        user.save().then(() => {
            // SAVED SESSION SUCCESSFULLY
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        });
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24 ) * 60) * 60;
    return ((Date.now() / 1000 ) + secondsUntilExpire);
}

const User = mongoose.model('User', UserSchema);
module.exports = { User }