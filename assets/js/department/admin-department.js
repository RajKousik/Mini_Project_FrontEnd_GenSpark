// Define navigation and form elements
const addDepartmentNav = document.getElementById("add-department-nav");
const updateDepartmentNav = document.getElementById("update-department-nav");
const viewAllDepartmentsNav = document.getElementById(
  "view-all-departments-nav"
);

const addDepartmentView = document.getElementById("add-department-form");
const updateDepartmentView = document.getElementById("update-department-form");
const viewAllDepartmentsView = document.getElementById("view-all-departments");

// Fteching details for Update Modal
function viewUpdateModal(deptId, headId) {
  addDepartmentView.classList.add("d-none");
  updateDepartmentView.classList.remove("d-none");
  viewAllDepartmentsView.classList.add("d-none");

  addDepartmentNav.classList.remove("active");
  updateDepartmentNav.classList.add("active");
  viewAllDepartmentsNav.classList.remove("active");

  document.getElementById("departmentId").value = deptId;
  document.getElementById("updateHeadId").value = headId;
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize animations
  AOS.init({ duration: 1000 });

  // Check token validity
  if (!checkToken()) {
    return;
  }

  // Redirect if in top window
  if (window.top === window.self) {
    // If the page is not in an iframe, redirect to the main page or show an error
    window.location.href = "../../../src/pages/admin/index.html";
  }

  const token = getTokenFromLocalStorage();

  // Populate dropdowns
  populateHeadID("headId");
  populateHeadID("updateHeadId");
  populateDepartments("departmentId");

  // Add event listeners for navigation clicks
  addDepartmentNav.addEventListener("click", () => {
    addDepartmentView.classList.remove("d-none");
    updateDepartmentView.classList.add("d-none");
    viewAllDepartmentsView.classList.add("d-none");

    populateHeadID("headId");

    addDepartmentNav.classList.add("active");
    updateDepartmentNav.classList.remove("active");
    viewAllDepartmentsNav.classList.remove("active");
  });

  // Update event listeners for navigation clicks
  updateDepartmentNav.addEventListener("click", () => {
    addDepartmentView.classList.add("d-none");
    updateDepartmentView.classList.remove("d-none");
    viewAllDepartmentsView.classList.add("d-none");

    populateHeadID("updateHeadId");
    populateDepartments("departmentId");

    addDepartmentNav.classList.remove("active");
    updateDepartmentNav.classList.add("active");
    viewAllDepartmentsNav.classList.remove("active");
  });

  // view event listeners for navigation clicks
  viewAllDepartmentsNav.addEventListener("click", () => {
    addDepartmentView.classList.add("d-none");
    updateDepartmentView.classList.add("d-none");
    viewAllDepartmentsView.classList.remove("d-none");

    populateDepartmentTable();

    addDepartmentNav.classList.remove("active");
    updateDepartmentNav.classList.remove("active");
    viewAllDepartmentsNav.classList.add("active");
  });

  // Function to populate faculty dropdown
  function populateHeadID(elementId) {
    fetch(`${config.API_URL}/faculty`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const headSelect = document.getElementById(elementId);
        headSelect.innerHTML = "";

        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Select Head";
        option.disabled = true;
        option.selected = true;
        headSelect.appendChild(option);

        data.forEach((faculty) => {
          if (faculty.role != 0) {
            const option = document.createElement("option");
            option.value = faculty.facultyId;
            option.textContent = faculty.facultyId + " - " + faculty.name;
            headSelect.appendChild(option);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }

  // Function to fetch the faculty name
  async function getFacultyName(facultyId) {
    const response = await fetch(`${config.API_URL}/faculty/${facultyId}`);
    if (response.ok) {
      const data = await response.json();
      return data.name;
    } else {
      console.error("Something went wrong while fetching department name");
    }
  }

  // Function to populate the department table
  async function populateDepartmentTable() {
    const response = await fetch(`${config.API_URL}/departments`);
    const departments = await response.json();

    const tableBody = document.querySelector("#departmentTable tbody");
    tableBody.innerHTML = "";

    for (let index = 0; index < departments.length; index++) {
      const department = departments[index];
      const facultyName = await getFacultyName(department.headId);

      const isAdminDepartment =
        department.name.toLowerCase() === "admin" ? true : false;

      const disabledAttribute = isAdminDepartment ? "disabled" : "";

      const row = `
        <tr>
          <th scope="row">${index + 1}</th>
          <td>${department.deptId}</td>
          <td>${department.name}</td>
          <td>${department.headId}</td>
          <td>${facultyName}</td>
          <td>
            <button class="btn btn-primary"  onclick="viewUpdateModal
            (${department.deptId}, ${department.headId})"
            ${disabledAttribute}>
              Update
            </button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    }

    // Data Table
    $("#departmentTable").DataTable().destroy();
    $("#departmentTable").DataTable({
      columns: [
        null,
        null,
        null,
        null,
        null,
        { searchable: false, orderable: false },
      ],
      pagingType: "full_numbers",
      language: {
        paginate: {
          previous: '<span class="fa fa-chevron-left"></span>',
          next: '<span class="fa fa-chevron-right"></span>',
          first: '<span class="fa-solid fa-angles-left"></span>',
          last: '<span class="fa-solid fa-angles-right"></span>',
        },
        lengthMenu:
          'Display <select class="form-control input-sm">' +
          '<option value="3">3</option>' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="15">15</option>' +
          '<option value="20">20</option>' +
          '<option value="25">25</option>' +
          '<option value="-1">All</option>' +
          "</select> results",
      },
    });
  }

  // Function to populate faculty dropdown
  function populateDepartments(elementId) {
    fetch(`${config.API_URL}/departments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const departmentSelect = document.getElementById(elementId);
        departmentSelect.innerHTML = "";

        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Select Department";
        option.disabled = true;
        option.selected = true;
        departmentSelect.appendChild(option);

        data.forEach((department) => {
          const option = document.createElement("option");
          option.value = department.deptId;
          option.textContent = department.name;
          departmentSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }

  // Function to show modal with dynamic content
  function showModal(title, message, isSuccess) {
    var modal = document.getElementById("departmentModal");
    var modalTitle = modal.querySelector(".modal-title");
    var modalBody = modal.querySelector(".modal-body");
    var modalHeader = modal.querySelector(".modal-header");

    modalTitle.textContent = title;
    modalBody.textContent = message;

    if (isSuccess) {
      modalHeader.classList.remove("bg-danger");
      modalHeader.classList.add("bg-success");
    } else {
      modalHeader.classList.remove("bg-success");
      modalHeader.classList.add("bg-danger");
    }

    var modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  }

  // Event listeners for form submissions

  // Add Department Form Submission
  var addDepartmentForm = document.getElementById("addDepartmentForm");
  addDepartmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const headId = document.getElementById("headId").value;
    const name = document.getElementById("departmentName").value;

    const token = getTokenFromLocalStorage();

    fetch(`${config.API_URL}/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ headId, name }),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          let data = await response.json();
          throw new Error(data.message);
        }
      })
      .then((data) => {
        showModal("Success", "Department added successfully!", true);
      })
      .catch((error) => {
        showModal("Error", `Failed to add department: ${error.message}`, false);
      });
    addDepartmentForm.reset();
    removeValidations(addDepartmentForm);
  });

  // Update Department Form Submission
  var updateDepartmentForm = document.getElementById("updateDepartmentForm");
  updateDepartmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const deptId = document.getElementById("departmentId").value;
    const updatedHeadId = document.getElementById("updateHeadId").value;

    const token = getTokenFromLocalStorage();

    let api_url = `${config.API_URL}/departments/change-department-head?departmentId=${deptId}&newHeadId=${updatedHeadId}`;
    fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          let data = await response.json();
          throw new Error(data.message);
        }
      })
      .then((data) => {
        showModal("Success", "Department updated successfully!", true);
      })
      .catch((error) => {
        showModal(
          "Error",
          `Failed to update department: ${error.message}`,
          false
        );
      });
    updateDepartmentForm.reset();
    removeValidations(updateDepartmentForm);
  });
});
