function loadLoginForm () {
    var loginHtml = `
        <h3>Login/Register to unlock awesome features</h3>
        <input type="text" id="username" placeholder="username" />
        <input type="password" id="password" />
        <br/><br/>
        <input type="submit" id="login_btn" value="Login" />
        <input type="submit" id="register_btn" value="Register" />
        `;
    document.getElementById('login_area').innerHTML = loginHtml;

    // Submit username/password to login
    var submit = document.getElementById('login_btn');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();

        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Sucess!';
              } else if (request.status === 403) {
                alert("Invalid credentials");
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }
          // Not done yet
        };

        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        if(username.length==0||password.length==0)
        {
          alert("Enter login details:");
          loadLoginForm();
        }else {

        request.open('POST','http://localhost:3000/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));
        submit.value = 'Logging in...';
      }

    };

    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();

        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        if(username.length==0||password.length==0)
        {
          alert("Enter login details:");
          loadLoginForm();
        }else{
        request.open('POST', 'http://localhost:3000/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));
        register.value = 'Registering...';
      }

    };
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    var messArea=document.getElementById('message_area');
   var request=new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
          // Take some action
          if (request.status === 200) {

              //  var arr=JSON.parse("[" + this.responseText + "]");
              var temp="message to "+username+" here";
                document.getElementById("message_link").innerHTML=temp.link("http://localhost:3000/message/"+username);
                document.getElementById("message_field").innerHTML="messages";
                messArea.innerHTML=this.responseText;
                //console.log(this.responseText);
            } else {

              alert("2");
          }
      }
    };
    request.open('POST', 'http://localhost:3000/dashboard', true);
    request.setRequestHeader('Content-Type', 'application/json');
    console.log(username);
    request.send(JSON.stringify({username: username}));
    loginArea.innerHTML = `
        <h3> Hi <i>${username}</i></h3>
        <a href="/logout">Logout</a>
    `;
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };

    request.open('GET', 'http://localhost:3000/check-login', true);
    request.send(null);
}




// The first thing to do is to check if the user is logged in!
loadLogin();
