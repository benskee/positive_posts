const schedule = require('node-schedule');
const express = require('express');
const router = express.Router();


let initialPosts = [1,2,3,4,5,6,7,8,9,10]

const choosePost = posts => {
    let idx = Math.floor(Math.random() * posts.length)

    return [posts.splice(idx, 1), posts]
}

let Users = []

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
            user.currentPost = currentPost
            user.remainingPosts = remainingPosts

            Users.push(user)
            return res.status(200).send(Users);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    return res.status(200).send('success');
});

router.get('/', async (req, res) => {
    try {
        res.status(200).json({
            users: Users
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// schedule.scheduleJob("*/5 * * * * *", function(){
//     if(Users.length) {
//       let usersCopy = [...Users]
//       usersCopy.forEach(user=>{
//         if(user.remainingPosts.length > 0) {
//           let [currentPost, remainingPosts] = choosePost([...user.remainingPosts])
//           user.currentPost = currentPost
//           user.remainingPosts = remainingPosts
//         }
//       })
//       console.log('Messages sent.', Users);
//     }
// });



module.exports = router