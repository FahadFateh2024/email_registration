import express from "express";
import bodyParser from "body-parser";
import request from "request";
import { fileURLToPath } from "url";
import { dirname } from "path";
import https from "https";

//6c5682eec3dcb468cfc4408e574e3b3a-us13
//635ece8191
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const url = __dirname + "/signup.html";

app.use(express.static("public"));
app.get("/", function (req, res) {
	res.sendFile(url);
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (req, res) {
	const first_name = req.body.fname;
	const last_name = req.body.lname;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: first_name,
					LNAME: last_name,
				},
			},
		],
	};
	const jsonData = JSON.stringify(data);
	const url = "https://us13.api.mailchimp.com/3.0/lists/635ece8191";
	const options = {
		method: "POST",
		auth: "fahad:39a4e02fa6b7190a5  	1f9500479a1303a-us13",
	};
	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
		response.on("data", function (data) {});
	});
	request.write(jsonData);
	request.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
	console.log("Server listening on port " + port);
});
