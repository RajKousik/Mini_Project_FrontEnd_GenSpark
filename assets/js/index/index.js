// Listen for messages sent to the window
window.addEventListener("message", function (event) {
  if (event.data === "iframeReloaded") {
    location.reload(); // Reload the outer page if the iframe is reloaded
  }
});

// Execute when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  if (!checkToken()) {
    return; // If token is invalid, stop execution
  }

  function handleLogout() {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.top.location.href = "../../../src/auth/user-auth.html";
  }

  // Attach the logout function to the logout link
  const logoutLink = document.getElementById("logout-link");
  logoutLink.addEventListener("click", function (event) {
    event.preventDefault();
    handleLogout(); // Logout user and redirect to login page
  });

  // Get token from localStorage
  const token = getTokenFromLocalStorage("token");

  // Determine API URL based on user role
  const userRole = getUserRole();
  let api_url = `${config.API_URL}/faculty/${getUserId()}`;
  if (userRole.toLowerCase() === "student") {
    api_url = `${config.API_URL}/students/id?studentRollNo=${getUserId()}`;
  }

  // Fetch user data from the API
  let response = await fetch(api_url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  if (response.ok) {
    data = await response.json(); // Parse response JSON
  }
  let fullName = data.name; // Get the full name from the response data

  // Update all elements with the class 'username' with the user's full name
  const usernameElements = document.querySelectorAll(".username");
  usernameElements.forEach((element) => {
    element.textContent = fullName;
  });
});

// Function to toggle the sidebar
function toggleSideBar() {
  var sidebar = document.getElementById("sidebar");
  var togglerIcon = document.getElementById("navbar-toggler-icon");
  if (
    sidebar.classList.contains("collapsing") &&
    togglerIcon.classList.contains("navbar-toggler-icon")
  ) {
    togglerIcon.classList.remove("navbar-toggler-icon");
    togglerIcon.classList.add("btn-close"); // Change icon to close button
  } else {
    togglerIcon.classList.remove("btn-close");
    togglerIcon.classList.add("navbar-toggler-icon"); // Change icon to navbar toggler
  }
}

// Function to adjust sidebar visibility based on window size
function checkWindowSize() {
  var sidebar = document.getElementById("sidebar");
  var togglerIcon = document.getElementById("navbar-toggler-icon");

  if (window.innerWidth > 576) {
    sidebar.classList.remove("collapse");
    sidebar.classList.remove("show");
    togglerIcon.classList.remove("btn-close");
    togglerIcon.classList.add("navbar-toggler-icon"); // Ensure navbar toggler icon is correct
  } else {
    sidebar.classList.add("collapse"); // Collapse sidebar on smaller screens
  }
}

// Function to set the active class on navigation items
function setActiveClass(event) {
  var navItems = document.querySelectorAll(".nav-li-items");
  navItems.forEach(function (item) {
    item.querySelector("a").classList.remove("active"); // Remove active class from all items
  });
  event.currentTarget.querySelector("a").classList.add("active"); // Add active class to the clicked item
}

// Add event listeners to navigation items
var navItems = document.querySelectorAll(".nav-li-items");
navItems.forEach(function (item) {
  item.addEventListener("click", setActiveClass);
});

// Adjust sidebar visibility on window resize and initial load
window.addEventListener("resize", checkWindowSize);
window.addEventListener("load", checkWindowSize);
