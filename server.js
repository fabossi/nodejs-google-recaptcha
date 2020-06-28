const express = require('express');
const bodyparser = require('body-parser')
const request = require('request');

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.post('/subscribe', (req, res) => {
    if (req.body.captcha === undefined || req.body.captcha === null || req.body.captcha === '') {
        return res.json({ 'sucess': false, 'msg': 'Please, select captcha' });
    }


    // Secret Key

    const secret_key = '6LfqZqoZAAAAAOvGwo6qXzosp41rNWpbCUWcHzWl';

    // Verify URL

    const virefy_url = `https://google.com/recaptcha/api/siteverify?secret=
    ${secret_key}&response=
    ${req.body.captcha}&remoteapi=
    ${req.connection.remoteAddress}`;


    // Make request to verify url

    request(virefy_url, (err, response, body) => {
        body = JSON.parse(body);

        // If NOT successfull

        if (body.sucess != undefined && !body.sucess) {
            return res.json({ 'sucess': false, 'msg': 'Failed captcha verification' });
        }

        // If Succesfull

        return res.json({ 'sucess': true, 'msg': 'Captcha passed ' });

    })

});

app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/images'));

app.listen(4000, () => {
    console.log('server started at 4000');
})