const schedule = require('node-schedule');
const sgMail = require('@sendgrid/mail')
const express = require('express');
const router = express.Router();
require('dotenv').config()
const postDict = require('../posts/postDict')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const emailSender = process.env.SENDGRID_EMAIL_SENDER
let initialPosts = [1,2,3,4,5,6,7,8,9,10]
let Users = []

const choosePost = posts => {
    let idx = Math.floor(Math.random() * posts.length)

    return [posts.splice(idx, 1), posts]
}

const sendEmail = async user => {
    const msg = {
        to: user.email,
        from: emailSender,
        subject: 'Something Positive to help your day',
        text: 'Positive Post',
        html: `<p>${user.currentPost}</p>`,
        }
    sgMail
    .send(msg)
    .catch((error) => {
        console.error(error)
        if(error.code === 403) console.error("Invalid email sender.")
    })
}

router.post('/', async (req, res) => {
        try {
            const userInput = req.body
            const user = {
                username: userInput.username,
                email: userInput.email
            };
            if (Users.filter(existingUser=> {return existingUser.email == user.email}).length > 0) {
                return res.status(400).send({
                    type: 'Bad Request',
                    message: 'Email address already registered.'
                })
            }
            if (user.username == '') user.username = "Anonymous"
            let [currentPost, remainingPosts] = choosePost([...initialPosts])
            user.currentPost = postDict[currentPost]
            user.remainingPosts = remainingPosts
            Users.push(user)
            await sendEmail(user)
            return res.status(200).send(Users);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    return res.status(200).send('success');
});

router.get('/', async (req, res) => {
    try {
        res.status(200).send(Users)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/', async (req, res) => {
    try {
        Users = []
        res.status(200).json({
            users: Users
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

schedule.scheduleJob("*/1 * * * *", function(){
    if(Users.length) {
      let usersCopy = [...Users]
      usersCopy.forEach(user=>{
        if(user.remainingPosts.length > 0) {
          let [currentPost, remainingPosts] = choosePost([...user.remainingPosts])
          user.currentPost = postDict[currentPost]
          user.remainingPosts = remainingPosts
          sendEmail(user)
        }
      })
    }
});


module.exports = router