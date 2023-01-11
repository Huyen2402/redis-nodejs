const axios = require("axios");
const express = require("express");
const {createClient} = require('redis') ;

const app = express();
const redisClient  = createClient();
const MOCK_API = "https://jsonplaceholder.typicode.com/users";
// trường hợp truy vấn dữ liệu qua email thông qua database
redisClient.on('error', (err) => console.log('Redis Client Error', err));
const connectRedis = async () => {
    await redisClient.connect().then().catch(error => {
        console.log(error)
    })
}
connectRedis();
app.get("/users", (req, res) => {
    const email = req.query.email;

    // try {
    //     axios.get(`${MOCK_API}?email=${email}`).then(function (response) {
    //         const users = response.data;

    //         console.log("User successfully retrieved from the API");

    //         res.status(200).send(users);
    //     });
    // } catch (err) {
    //     res.status(500).send({ error: err.message });
    // }
});

// trường hợp truy vấn dữ liệu qua email thông qua cache

app.get("/cached-users",  async (req, res) => {
    const email = req.query.email;
    try {
        const data = await redisClient.get(email);
        console.log(data);
        if(data){
            res.status(200).send(data);

        }else{
                    await axios.get(`${MOCK_API}?email=${email}`).then(async function (response) {
                    const users = response.data;
                    console.log(users)
                    await  redisClient.set(email, JSON.stringify(users));

                    console.log("User successfully retrieved from the API");

                    res.status(200).send(users);
                }).catch(error => {
                    console.log(error)
                });
        }
   
        // await redisClient.get(email, async (err, data) => {
        //     if (err) {
        //         console.error(err);
        //         throw err;
        //     }

        //     if (data) {
        //         console.log("User successfully retrieved from Redis");

        //         res.status(200).send(JSON.parse(data));
        //     } else {
        //         console.log("error")

        //         await axios.get(`${MOCK_API}?email=${email}`).then(async function (response) {
        //             const users = response.data;
        //             console.log(users)
        //            await  redisClient.set(email, JSON.stringify(users));

        //             console.log("User successfully retrieved from the API");

        //             res.status(200).send(users);
        //         }).catch(error => {
        //             console.log(error)
        //         });
        //     }
        // });
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});