// Initialize AOS (Animate on Scroll) library with a duration of 1000 milliseconds
AOS.init({ duration: 1000 });

let userEmail = null;

// Check if the page is not in an iframe, redirect to the main page or show an error
if (window.top === window.self) {
  window.location.href = "../../../src/pages/admin/index.html";
}

// Function to show modal by ID
function showModalById(modalId) {
  const modalElement = new bootstrap.Modal(document.getElementById(modalId));
  modalElement.show();
}

// Function to hide a modal by ID
function hideModal(modalId) {
  const updateModalElement = document.getElementById(modalId);
  const updateModal = bootstrap.Modal.getInstance(updateModalElement);
  updateModal.hide();
}

// Function to view student details
async function viewStudentDetails(studentId) {
  try {
    const response = await fetch(
      `${config.API_URL}/students/id?studentRollNo=${studentId}`
    );
    const data = await response.json();
    userEmail = data.email;
    const approveBtn = document.getElementById("activeBtn");
    const rejectBtn = document.getElementById("rejectBtn");
    const closeBtn = document.getElementById("closeBtn");

    // Populate the modal with student details
    if (data) {
      document.getElementById("studentRollNo").textContent = data.studentRollNo;
      document.getElementById("studentName").textContent = data.name;
      document.getElementById("studentGender").textContent = data.gender;
      document.getElementById("studentEmail").textContent = data.email;
      document.getElementById("studentDepartment").textContent =
        await getDepartmentName(data.departmentId);
      document.getElementById("studentAddress").textContent = data.address;
      document.getElementById("studentDob").textContent = formatDate(data.dob);
      document.getElementById("studentStatus").textContent =
        data.status == 1 ? "Active" : "Inactive";

      // Adjust button visibility based on user role and student status
      if (getUserRole().toLowerCase() !== "admin") {
        approveBtn.style.display = "none";
        rejectBtn.style.display = "none";
        closeBtn.style.display = "block";
      } else if ($("#studentStatus").text().toLowerCase() === "active") {
        approveBtn.style.display = "none";
        rejectBtn.style.display = "none";
        closeBtn.style.display = "block";
      } else {
        approveBtn.style.display = "block";
        rejectBtn.style.display = "block";
        closeBtn.style.display = "none";
      }

      showModalById("studentViewModal");
    } else {
      console.error(`Student with ID ${studentId} not found.`);
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
  }
}

// Function to format date as dd-mm-yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Function to get department name by department ID
async function getDepartmentName(departmentId) {
  const response = await fetch(`${config.API_URL}/departments/${departmentId}`);

  if (response.ok) {
    const data = await response.json();
    return data.name;
  } else {
    console.error("Something went wrong while fetching department name");
  }
}

// Function to show a modal with a message
function showModal(title, message, isSuccess) {
  var modal = document.getElementById("responseModal");
  var modalTitle = modal.querySelector(".modal-title");
  var modalBody = modal.querySelector(".modal-body");
  var modalHeader = modal.querySelector(".modal-header");

  modalTitle.textContent = title;
  modalBody.textContent = message;

  // Change modal color based on success or failure
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

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function () {
  if (!checkToken()) {
    return;
  }

  const token = getTokenFromLocalStorage();
  const approveBtn = document.getElementById("activeBtn");
  const rejectBtn = document.getElementById("rejectBtn");

  // Add event listeners for approve and reject buttons
  approveBtn.addEventListener("click", approveStudent);
  rejectBtn.addEventListener("click", rejectStudent);

  // Function to fetch students
  async function fetchStudents() {
    const role = getUserRole();
    let url;

    // Determine API URL based on user role
    if (role.toLowerCase() === "admin") {
      url = `${config.API_URL}/students/all`;
    } else {
      const rollNo = getUserId();
      const facultyResponse = await fetch(
        `${config.API_URL}/faculty/${rollNo}`
      );
      const facultyData = await facultyResponse.json();
      const departmentId = facultyData.departmentId;
      url = `${config.API_URL}/students/department/${departmentId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Handle the response from the API
    if (response.ok) {
      const data = await response.json();
      populateTable(data); // Populate the table with student data
    } else {
      populateTable([]);
      console.error("Error while fetching the data", await response.json());
    }
  }

  async function populateTable(studentData) {
    const tableBody = $("#studentTable tbody");
    tableBody.empty();

    for (const student of studentData) {
      const departmentName = await getDepartmentName(student.departmentId);
      const status = student.status == 1 ? "Active" : "Inactive";
      const row = `
        <tr>
          <th scope="row">${studentData.indexOf(student) + 1}</th>
          <td>${student.studentRollNo}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${departmentName}</td>
          <td id=${status.toLowerCase()}><p>${status}</p></td>
          <td>
            <button class="btn btn-primary"
            onclick="viewStudentDetails(${student.studentRollNo})">
              View Details
            </button>
          </td>
        </tr>
      `;
      tableBody.append(row);
    }

    const table = $("#studentTable").DataTable({
      columns: [
        null,
        null,
        null,
        null,
        null,
        { orderable: false },
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

    $("#filterActive, #filterInactive").on("change", function () {
      table.draw();
    });

    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      const filterActive = $("#filterActive").is(":checked");
      const filterInactive = $("#filterInactive").is(":checked");
      const status = data[5].toLowerCase();

      if (
        (filterActive && status == "active") ||
        (filterInactive && status.includes("inactive"))
      ) {
        return true;
      }
      return false;
    });

    table.draw(); // Initial filter
  }

  fetchStudents();

  // Function to reject a student
  async function rejectStudent() {
    let api_url = `${config.API_URL}/students/delete?email=${userEmail}`;

    // Send a DELETE request to the API to reject the student
    let response = await fetch(api_url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Handle the response from the API
    if (response.ok) {
      hideModal("studentViewModal");
      showModal("Success", "Rejected Successfully", true);
      setTimeout(() => {
        location.reload(); // Reload the page after 3 seconds
      }, 3000);
    } else {
      let error = await response.json();
      hideModal("studentViewModal");
      showModal(
        "Rejection Failed!",
        `Something Went Wrong: ${error.message}`,
        false
      );
    }
  }

  // Function to approve a student
  async function approveStudent() {
    let api_url = `${config.API_URL}/admin/activate/student?email=${userEmail}`;

    // Send a PUT request to the API to approve the student
    let response = await fetch(api_url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Handle the response from the API
    if (response.ok) {
      hideModal("studentViewModal");
      showModal("Success", "Approved Successfully", true);
      setTimeout(() => {
        location.reload(); // Reload the page after 3 seconds
      }, 3000);
    } else {
      let error = await response.json();
      hideModal("studentViewModal");
      showModal(
        "Approval Failed!",
        `Something Went Wrong: ${error.message}`,
        false
      );
    }
  }
});
