/*global WildRydes _config AmazonCognitoIdentity AWSCognito*/

const registerUser = () => {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  const poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
  };

  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email
    })
  ];

  userPool.signUp(email, password, attributeList, null, function(err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }

    // ← INSERT REDIRECT HERE
    window.location.href = 'verify.html';
});

    alert('Sign-up successful! Please check your email for the verification code.');
    // Redirect to verification page or show code input
  });
};

const signInUser = () => {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  const authenticationData = {
    Username: email,
    Password: password
  };

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
  });

  const userData = {
    Username: email,
    Pool: userPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      const idToken = result.getIdToken().getJwtToken();
      console.log("Login successful. Token:", idToken);
    },
    onFailure: (err) => {
      alert(err.message || JSON.stringify(err));
    }
  });
};

function verifyUser() {
  const email = document.getElementById('emailInputVerify').value;
  const code = document.getElementById('codeInputVerify').value;

  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
  });

  const userData = {
    Username: email,
    Pool: userPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.confirmRegistration(code, true, function(err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    alert("Your email has been verified successfully!");
    window.location.href = 'index.html'; // Redirect to homepage or login page
  });

  function showMessage(message, isSuccess) {
      const box = document.getElementById('messageBox');
      box.className = 'alert ' + (isSuccess ? 'alert-success' : 'alert-danger');
      box.textContent = message;
      box.style.display = 'block';
    }

    function verifyUser() {
      const email = document.getElementById('emailInputVerify').value;
      const code = document.getElementById('codeInputVerify').value;

      const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
      });

      const userData = {
        Username: email,
        Pool: userPool
      };

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
          showMessage(err.message || JSON.stringify(err), false);
          return;
        }
        showMessage("✅ Your email has been successfully verified!", true);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2500);
      });
    }
}
