var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

var client = tumblr.createClient({
  consumer_key: 'OvybOy1Dvna7qxvtf5By0WsY1iDuEKK0zkGdx30KC37yzBOWNY',
  consumer_secret: 'O6eKYCK9JcZCDUcJ1mXAufprYLzzRODuBukHf8rWApwc9fqM05',
  token: 'kWTHAyyDwRiXAySbGNELVFGeLjcAEDHyPHcGJLNhjl438axxjR',
  token_secret: 'qyrTqo95txhqQY5wRcUy6qWxyRwDmtC3nxltWurOGqyoQOw6QM'
});

//creates email object
function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]
    };
};

//parses friend list
function csvParse(csvFile) {
  var arrayOfObjects = [];
  var arr = csvFile.split("\n");
  var newObj;

  var keys = arr.shift().split(",");

  arr.forEach(function(contact){
      contact = contact.split(",");
      newObj = {};

        for(var i =0;i < contact.length; i++)
            newObj[keys[i]] = contact[i];

    if (newObj.firstName!="")
      arrayOfObjects.push(newObj);
    });
    return arrayOfObjects;
  };

  //tumblr request
  var latestPosts = client.posts('thoughtsoncode.tumblr.com', function(err, blog){
	if(err){ return console.log(err); }
	var latestPosts = blog.posts.filter(function(post){
		if(Date.parse(post.date) > (Date.now() - (7 * 24 * 60 * 60 * 1000)))
			 return true;
     else
		   return false;
	});

var contacts = csvParse(csvFile);

//populates template & sends to email object
contacts.forEach(function(row) {
  row.latestPosts = latestPosts;
  var templateCopy = ejs.render(emailTemplate, row);
  sendEmail(row.firstName,row.emailAddress,"Mike","mbushoy@gmail.com","Check out my blog",templateCopy);
});

});
