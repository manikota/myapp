function loadLoginForm () {
    var loginHtml = `
    <div id="reload_mess" align="center">
      <a href='http://localhost:3000/index.html'>Home</a>
      <a href='http://localhost:3000/logout'>logout</a>
      <h3> Welcome</h3>
      <p> Message Anonymously</p>
    <div id="header" align="center">
      <form>
      <textarea id="message_area" placeholder="Leave a message..." rows="20" cols="100"  required></textarea>
      <button type="button" id="message_sub">submit</button>
      </form>
    </div>
    <script src="../another.js"></script>
        `;
    document.getElementById('reload_mess').innerHTML = loginHtml;
  }
    // Submit username/password to login
    var submit = document.getElementById('message_sub');
    submit.onclick = function () {
        // Create a request object

        var request = new XMLHttpRequest();

        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {

                  //document.getElementById("header").innerHTML=this.responseText;
                  alert("messsage submitted successfully");
                  document.getElementById("message_area").value=null;
                //  window.location.assign("http://localhost:3000/message/"+username);

              } else if (request.status === 403) {
                alert("Invalid credentials");
              } else if (request.status === 500) {
                  alert('1');
              } else {
                  alert(request.status);
              }
          }
          // Not done yet
        };

        // Make the request
        var temp=window.location.href;
        var ind=temp.indexOf('message');
        var username=temp.substring(ind+8,temp.length);
        var message=document.getElementById("message_area").value;
        if(message.length==0)
        {
          alert("Enter message:");
          loadLoginForm();
        }else {

        request.open('POST','http://localhost:3000/submit', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, message: message}));
      }

    };
