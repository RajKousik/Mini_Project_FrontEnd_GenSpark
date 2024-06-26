// Function to retrieve token from local storage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// Function to validate the token
function checkToken() {
  // Get the token from local storage
  const token = localStorage.getItem("token");

  // Check if token exists
  if (!token) {
    // Show modal indicating user is not logged in
    showNotLoggedInModal();
    return false;
  }

  // Parse the token to check expiration
  const isTokenExpired =
    Date.now() >= JSON.parse(atob(token.split(".")[1])).exp * 1000;
  if (isTokenExpired) {
    // Show modal indicating user is not logged in (token expired)
    showNotLoggedInModal();
    return false;
  }

  // Token is valid
  return true;
}

// Function to display a modal for non-logged-in users
function showNotLoggedInModal() {
  // Get the modal element from DOM
  var notLoggedInModal = new bootstrap.Modal(
    document.getElementById("notLoggedInModal")
  );

  // Show the modal
  notLoggedInModal.show();

  // Add click event listener to the login button within the modal
  document.getElementById("login-btn").addEventListener("click", function () {
    // Redirect to login page on click
    window.top.location.href = "../../../src/auth/user-auth.html";
  });
}

// Function to safely parse a JWT token
function parseJwt(token) {
  try {
    // Extract the base64 encoded payload from the token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Decode the base64 payload and convert it to a string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    // Parse the decoded string as JSON
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}

// Function to retrieve user ID from a valid token
function getUserId() {
  const token = getTokenFromLocalStorage();

  // Parse the token and check for specific claim
  const decodedToken = parseJwt(token);
  if (
    decodedToken &&
    decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  ) {
    // Extract the user ID (assuming claim name is "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")
    const rollNo =
      decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ];
    return rollNo;
  } else {
    console.error("Failed to decode token or claim not found.");
  }
  return null;
}

// Function to retrieve user role from a valid token
function getUserRole() {
  const token = getTokenFromLocalStorage();

  const decodedToken = parseJwt(token);
  if (
    decodedToken &&
    decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
  ) {
    // Extract the user role (assuming claim name is "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")
    const role =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    return role;
  } else {
    console.error("Failed to decode token or claim not found.");
  }
  return null;
}

// Function to retrieve user email from a valid token
function getUserEmail() {
  const token = getTokenFromLocalStorage();

  const decodedToken = parseJwt(token);
  if (
    decodedToken &&
    decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  ) {
    // Extract the user email
    const email =
      decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ];
    return email;
  } else {
    console.error("Failed to decode token.");
  }
  return null;
}
