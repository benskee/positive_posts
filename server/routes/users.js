const schedule = require('node-schedule');
const express = require('express');
const router = express.Router();


let initialPosts = [1,2,3,4,5,6,7,8,9,10]

const choosePost = posts => {
    let idx = Math.floor(Math.random() * posts.length)

    return [posts.splice(idx, 1), posts]
}

router.post('/', async (req, res) => {
        try {
            const userInput = req.body
            const user = {
                username: userInput.username,
                email: userInput.email
            };
            if (user.username == '') user.username = "Anonymous"
            let [currentPost, remainingPosts] = choosePost([...initialPosts])
            user.currentPost = currentPost
            user.remainingPosts = remainingPosts

            console.log(user)
            return res.status(200).send(user);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    return res.status(200).send('success');
});

router.get('/', async (req, res) => {
    try {
        //Get users from DB
        res.status(200).json({
            success: true,
            users: 'users'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// const job = schedule.scheduleJob("*/5 * * * * *", function(){
    // if(users.length) {
  //     let usersCopy = [...users]
  //     usersCopy.forEach(user=>{
  //       if(user.remainingPosts.length > 0) {
  //         let [currentPost, remainingPosts] = choosePost([...user.remainingPosts])
  //         user.currentPost = currentPost
  //         user.remainingPosts = remainingPosts
  //       }
  //     })
//   console.log('The answer to life, the universe, and everything!');
// });



module.exports = router