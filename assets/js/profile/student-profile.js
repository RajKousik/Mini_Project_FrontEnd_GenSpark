var cancelButton = document.getElementById("cancelButton");
var editButton = document.getElementById("editButton");
var saveButton = document.getElementById("saveButton");
var editableFields = document.querySelectorAll(".editable");
var originalValues = {};
var profileForm = document.getElementById("profileForm");

if (window.top === window.self) {
  // If the page is not in an iframe, redirect to the main page or show an error
  window.location.href = "../../../src/pages/admin/index.html";
}

// Function to restore original values of editable fields
function restoreOriginalValues() {
  populateStudentProfile(); // Repopulate student profile with original values
  editButton.style.display = "inline-block"; // Show the edit button
  cancelButton.style.display = "none"; // Hide the cancel button
  saveButton.style.display = "none"; // Hide the save button
}

// Event listener for the edit button
editButton.addEventListener("click", function () {
  toggleEditMode(false); // Enable edit mode

  cancelButton.style.display = "inline-block"; // Show the cancel button
  saveButton.style.display = "inline-block"; // Show the save button
  editButton.style.display = "none"; // Hide the edit button
});

// Event listener for the cancel button
cancelButton.addEventListener("click", function () {
  removeValidations(profileForm); // Remove validation errors
  restoreOriginalValues(); // Restore original values
  toggleEditMode(true); // Disable edit mode
});

// Function to toggle the edit mode
function toggleEditMode(isDisabled) {
  editableFields.forEach(function (field) {
    field.disabled = isDisabled; // Enable or disable fields
    field.readOnly = isDisabled; // Make fields read-only or editable
  });
}

// Function to populate student profile and departments on page load
document.addEventListener("DOMContentLoaded", function () {
  if (!checkToken()) {
    return; // If the token is invalid, stop execution
  }
  populateDepartments(); // Populate department dropdown
  populateStudentProfile(); // Populate student profile
  document.getElementById("saveButton").addEventListener("click", handleSave); // Add event listener for save button
});

// Function to populate department dropdown
function populateDepartments() {
  fetch(`${config.API_URL}/departments`)
    .then((response) => response.json())
    .then((data) => {
      const departmentSelect = document.getElementById("inputDepartment");
      data.forEach((department) => {
        if (department.name.toLowerCase() !== "admin") {
          const option = document.createElement("option");
          option.value = department.deptId;
          option.textContent = department.name;
          departmentSelect.appendChild(option); // Append department options to dropdown
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching departments:", error); // Log error if fetching departments fails
    });
}

// Function to handle save button click
function handleSave(e) {
  e.preventDefault(); // Prevent the default form submission

  // Get values from input fields
  const email = document.getElementById("inputEmail4").value.trim();
  const name = document.getElementById("inputName4").value.trim();
  const dob = document.getElementById("inputDOB4").value;
  const gender = document.getElementById("inputGender4").value;
  const mobile = document.getElementById("inputMobile4").value.trim();
  const address = document.getElementById("inputAddress").value.trim();
  const departmentId = document.getElementById("inputDepartment").value;

  // Construct the request body
  const requestBody = {
    name: name,
    dob: dob,
    gender: gender,
    mobile: mobile,
    address: address,
    departmentId: departmentId,
    email: email,
  };

  fetch(`${config.API_URL}/students/update?email=${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then(async (response) => {
      if (response.ok) {
        return await response.json();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to Updated");
      }
    })
    .then((data) => {
      if (data) {
        showModal("Success!", "Successfully Updated the information!", true); // Show success modal
        setTimeout(() => {
          parent.postMessage("iframeReloaded", "*");
          populateFacultyProfile(); // Repopulate faculty profile after update
        }, 2000);
      } else {
        showModal("Failed!", "Something Went wrong!", false); // Show failure modal
      }
    })
    .catch((error) => {
      console.error("Error updating profile:", error); // Log error if update fails
      showModal("Failed!", error.message, false); // Show failure modal
    });

  // Hide save button and cancel button, show edit button
  document.getElementById("saveButton").style.display = "none";
  document.getElementById("editButton").style.display = "inline-block";
  document.getElementById("cancelButton").style.display = "none";

  toggleEditMode(true); // Disable edit mode
  removeValidations(profileForm); // Remove validation errors
}

// Function to populate student profile
function populateStudentProfile() {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = parseJwt(token);
    if (
      decodedToken &&
      decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    ) {
      const studentRollNo =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];
      fetch(`${config.API_URL}/students/id?studentRollNo=${studentRollNo}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Populate input fields with student data
          document.getElementById("inputRollNo4").value = data.studentRollNo;
          document.getElementById("inputName4").value = data.name;
          document.getElementById("inputEmail4").value = data.email;
          document.getElementById("inputGender4").value = data.gender;
          document.getElementById("inputAddress").value = data.address;
          const formattedDate = setDateValue(data.dob);
          document.getElementById("inputDOB4").value = formattedDate;
          document.getElementById("inputMobile4").value = data.mobile;
          document.getElementById("inputDepartment").value = data.departmentId;
        })
        .catch((error) => {
          console.error("Error fetching student data:", error); // Log error if fetching student data fails
        });
    }
  }
}

// Function to format date
function setDateValue(dateString) {
  const date = dateString.split("T")[0]; // Extract the date portion from the given date string
  return date;
}

// Function to show modal with a message
function showModal(title, message, isSuccess) {
  var modal = document.getElementById("responseModal");
  var modalTitle = modal.querySelector(".modal-title");
  var modalBody = modal.querySelector(".modal-body");
  var modalHeader = modal.querySelector(".modal-header");

  modalTitle.textContent = title; // Set modal title
  modalBody.textContent = message; // Set modal message

  // Change modal color based on success or failure
  if (isSuccess) {
    modalHeader.classList.remove("bg-danger");
    modalHeader.classList.add("bg-success");
  } else {
    modalHeader.classList.remove("bg-success");
    modalHeader.classList.add("bg-danger");
  }

  var modalInstance = new bootstrap.Modal(modal);
  modalInstance.show(); // Show the modal
}

// Function to hide modal by ID
function hideModal(modalId) {
  const updateModalElement = document.getElementById(modalId);
  const updateModal = bootstrap.Modal.getInstance(updateModalElement);
  updateModal.hide(); // Hide the modal
}
