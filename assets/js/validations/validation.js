// Select all forms with the class "needs-validation"
var forms = document.querySelectorAll(".needs-validation");

// Loop through each form
Array.prototype.slice.call(forms).forEach(function (form) {
  // Add a submit event listener to the form
  form.addEventListener(
    "submit",
    function (event) {
      // Check if form validation is successful using HTML5 validation API
      if (!form.checkValidity()) {
        // Prevent default form submission behavior
        event.preventDefault();
        // Prevent event bubbling (optional, depending on use case)
        event.stopPropagation();
      }

      // Add a class "was-validated" to the form after submission attempt (for styling purposes)
      // form.classList.add("was-validated");
    },
    false
  );
});

// Helper function to remove validation classes from form controls
function removeValidations(form) {
  // Select all elements with class "form-control" within the form
  form.querySelectorAll(".form-control").forEach(function (input) {
    // Remove "is-invalid" and "is-valid" classes from the input element
    input.classList.remove("is-invalid", "is-valid");
  });
}

// Real-time validation for form controls (except password fields)
document
  .querySelectorAll(".needs-validation .form-control")
  .forEach(function (input) {
    // Add input event listener (e.g., keyup, change)
    input.addEventListener("input", function () {
      // Skip validation for password fields (might have custom validation logic)
      if (input.classList.contains("password-field")) {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        return;
      }

      // Check if the input element is valid using HTML5 validation API
      if (input.checkValidity()) {
        // Remove "is-invalid" class and add "is-valid" class (for success styling)
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      } else {
        // Remove "is-valid" class and add "is-invalid" class (for error styling)
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
      }
    });
  });

// Similar real-time validation for select elements (except password fields)
document.querySelectorAll(".form-select").forEach(function (input) {
  input.addEventListener("input", function () {
    if (input.classList.contains("password-field")) {
      input.classList.remove("is-invalid");
      input.classList.remove("is-valid");
      return;
    }
    if (input.checkValidity()) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
    }
  });
});
