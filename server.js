
var subdomain = require('express-subdomain');
	var express=require('express');
	var morgan=require('morgan');
	var path=require('path');
	var Pool=require('pg').Pool;
	var bodyParser = require('body-parser');
	var crypto=require('crypto');
	var session =require('express-session');


	var config = {
    user: 'postgres',
    database: 'app_database',
    host: '127.0.0.1',
    port: '5432',
    password: 'mani'
};


	var app=express();
	var pool=new Pool(config);
	app.use(bodyParser.json());
	app.use(morgan('combined'));
	app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
	}));
//	document.write("Hello world");


app.get('/',function(req,res)
						{
							res.sendFile(path.join(__dirname,'ui/index.html'));
						}
				);
	app.get('/index.html',function(req,res)
							{
								res.sendFile(path.join(__dirname,'ui/index.html'));
							}
					);
	app.get('/another.js',function(req,res)
					{
								res.sendFile(path.join(__dirname,'ui/another.js'));
					}
				);

	app.get('/style.css',function(req,res)
							{
								res.sendFile(path.join(__dirname,'ui/style.css'));
							}
					);

	app.get('/main.js',function(req,res)
							{
								res.sendFile(path.join(__dirname,'ui/main.js'));
							}
				);

	app.get('/register.html',function(req,res)
					{
						res.sendFile(path.join(__dirname,'ui/register.html'));
					});
	app.get('/fallingsnow_v6.js',function(req,res)
									{
										res.sendFile(path.join(__dirname,'ui/fallingsnow_v6.js'));
									});

		app.get('/style_reg.css',function(req,res)
									{
												res.sendFile(path.join(__dirname,'ui/style_reg.css'));
										}
						);
		app.get('/new.jpg',function(req,res)
									{
												res.sendFile(path.join(__dirname,'ui/new.jpg'));
									}
						);
		app.get('/pair.jpg',function(req,res)
									{
												res.sendFile(path.join(__dirname,'ui/pair.jpg'));
									}
						);

		app.get('/message/:input/',function(req,res)
									{
												res.sendFile(path.join(__dirname,'ui/message.html'));
									});
		app.get('/test-db',function(req,res)
					{
						var username='mani',message='hero';
						pool.query('insert into user_message values($1,$2)',[username,message],function(err,result)
											{
												if(err)

													res.send(err.toString());

													else {

														res.status(200).write("Thank you");
														res.write('<br\>');
													}
											});
					}
				);

					function hash (input, salt) {
			    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
			    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
			}


			app.get('/hash/:input', function(req, res) {
			   var hashedString = hash(req.params.input, 'this-is-some-random-string');
			   res.send(hashedString);
			});

			app.post('/create-user', function (req, res) {

   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO user_table (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});
	app.post('/submit',function(req,res)
					{
						var username=req.body.username;
						var message=req.body.message;
						//res.send(username+message);
						pool.query('insert into user_message values($1,$2)',[username,message],function(err,result)
											{
												if(err)

													res.send(err.toString());

													else {

														res.write('Thank you');
														res.write('<br\>');
														res.end();
													}
											});
					});
	app.post('/dashboard',function(req,res)
	{
		var username=req.body.username;
		pool.query('select message from user_message where username=$1',[username],function(err,result)
		{
			if(err)

				res.status(500).send(err.toString());

				else {

						var temp=result.rowCount;
						//res.write("http://localhost:3000/message/:"+username);
						for(var i=0;i<temp;i++)
						{
							res.write(result.rows[i].message);
							res.write("<br>");
							res.write("<hr/>");
						}
						res.end();
				}
		});
	}
);

app.post('/login', function (req, res) {
 var username = req.body.username;
 var password = req.body.password;

 pool.query('SELECT * FROM user_table WHERE username = $1', [username], function (err, result) {
		if (err) {
				res.status(500).send(err.toString());
		} else {
				if (result.rows.length === 0) {
						res.status(403).send('username/password is invalid');
				} else {

						var dbString = result.rows[0].password;
						var salt = dbString.split('$')[2];
						var hashedPassword = hash(password, salt);
						if (hashedPassword === dbString) {

							req.session.auth = {userId: result.rows[0].id};
							res.send('credentials correct!');

						} else {
							res.status(403).send('username/password is invalid');
						}
				}
		}
 });
});
app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM user_table WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});
app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});


app.listen(3000);
