document.addEventListener("DOMContentLoaded", async function () {
  // Check token validity
  if (!checkToken()) {
    return;
  }

  // Redirect if in top window
  if (window.top === window.self) {
    // If the page is not in an iframe, redirect to the main page or show an error
    window.location.href = "../../../src/pages/admin/index.html";
  }

  await fetchDepartments(); // Fetch all departments

  fetchUserDepartment(getUserId());
});

// fetches the faculty name
async function getFacultyName(facultyId) {
  let api_url = `${config.API_URL}/faculty/${facultyId}`;

  let response = await fetch(api_url);

  if (response.ok) {
    let data = await response.json();
    return data.name;
  } else {
    return "Unknown";
  }
}

// Function to highlight the user department
async function fetchUserDepartment(rollNo) {
  let api_url = `${config.API_URL}/students/id?studentRollNo=${rollNo}`;

  let role = await getUserRole();

  if (role.toLowerCase() !== "student") {
    api_url = `${config.API_URL}/faculty/${rollNo}`;
  }

  fetch(api_url)
    .then(async (response) => await response.json())
    .then((data) => {
      const userDepartment = data.departmentId; // Assuming this is how you retrieve the department from the response
      // Add 'user-department' class to the corresponding department card

      const departmentCards = document.querySelectorAll(".department-card");

      departmentCards.forEach((card) => {
        const departmentId = card
          .querySelector(".card-id")
          .textContent.split(": ")[1]; // Extract department ID from card text

        if (departmentId == userDepartment) {
          card.classList.add("user-department");
        }
      });

      AOS.refresh(); // Refresh AOS animations after dynamically adding elements
    })
    .catch((error) => {
      console.error("Error fetching user department:", error);
    });
}

// fetches the departments
async function fetchDepartments() {
  await fetch(`${config.API_URL}/departments`)
    .then((response) => response.json())
    .then((data) => {
      const departmentContainer = document.getElementById(
        "departmentContainer"
      );
      data.forEach(async (department) => {
        const departmentCard = await createDepartmentCard(department);
        departmentContainer.appendChild(departmentCard);
      });
      AOS.refresh(); // Refresh AOS animations after dynamically adding elements
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
    });
}

// Create department card with given department details
async function createDepartmentCard(department) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("department-card");
  cardDiv.setAttribute("data-aos", "fade-up");

  const cardId = document.createElement("h5");
  cardId.classList.add("card-id");
  cardId.textContent = `Department ID: ${department.deptId}`;

  const cardName = document.createElement("h4");
  cardName.classList.add("card-name");
  cardName.textContent = department.name;

  const headContainer = document.createElement("div");
  headContainer.classList.add("head-container");

  const cardLabel = document.createElement("p");
  cardLabel.classList.add("card-label");
  cardLabel.textContent = "Head:";

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = await getFacultyName(department.headId); // Assuming headId is the name of the head. Adjust if necessary.

  headContainer.appendChild(cardLabel);
  headContainer.appendChild(cardText);

  cardDiv.appendChild(cardId);
  cardDiv.appendChild(cardName);
  cardDiv.appendChild(headContainer);

  return cardDiv;
}
