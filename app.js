(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    // Load header and footer, then load the initial page
    Promise.all([
      fetch("partials/header.html").then((response) => response.text()),
      fetch("partials/footer.html").then((response) => response.text()),
    ])
      .then(([headerData, footerData]) => {
        document.getElementById("header").innerHTML = headerData;
        document.getElementById("footer").innerHTML = footerData;

        // Load the home page initially after header and footer are loaded
        loadPage("home");

        // Add event listeners to navigation links
        addNavigationListeners();
        attachEventListeners();
      })
      .catch((error) => {
        console.error("Error loading header or footer:", error);
      });

    // Function to load page content
    function loadPage(page) {
      // Show the loader
      const loader = document.getElementById("loader");
      loader.style.display = "flex";

      // Fetch the page content
      fetch(`pages/${page}.html`)
        .then((response) => response.text())
        .then((data) => {
          // Hide the loader after a short delay
          setTimeout(() => {
            document.getElementById("main-content").innerHTML = data;
            loader.style.display = "none";
            document.getElementById("main-content").classList.remove("hidden");
            addNavigationListeners();
            attachEventListeners();

            loader.addEventListener(function () {
              loader.style.display = "none"; // Loader end
            });
          }, 2000);
        })
        
        .catch((error) => {
          console.error("Error loading page:", error);
          loader.style.display = "none"; // Hide loader on error
        });
        
    }

    // Add event listeners to navigation links
    function addNavigationListeners() {
      const buttons = document.querySelectorAll("button[data-page]");
      buttons.forEach((button) => {
        button.addEventListener("click", function () {
          const page = this.getAttribute("data-page");

          loadPage(page);
        });
      });

      // Add event listeners to links within the dynamically loaded pages
      const navLinks = document.querySelectorAll("#header .profile_img a, #header .logo a");
      navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent default link behavior

          // Extract page name
          const page = this.getAttribute("href").split(".html")[0];

          // Hide main content and show the loader
          document.getElementById("main-content").classList.add("hidden");
          document.getElementById("loader").style.display = "flex";

          // Load the new page
          loadPage(page);
        });
      });
    }


    // Profile Update function
    function attachEventListeners() {
      const profileUpdateButton = document.getElementById("profileUpdate");
      const modal = document.getElementById("updateModal");
      const closeButton = document.querySelector(".close-button");

      if (profileUpdateButton) {
        profileUpdateButton.addEventListener("click", function () {

          // Show the modal
          modal.classList.add("show");

          // Automatically hide the modal after 2 seconds
          setTimeout(() => {
            modal.classList.remove("show");
          }, 2000);
        });
      }

      if (closeButton) {
        closeButton.addEventListener("click", function () {
          // Close the modal when the close button is clicked
          modal.classList.remove("show");
        });
      }

      // Close the modal when clicking outside of the modal content
      window.addEventListener("click", function (event) {
        if (event.target === modal) {
          modal.classList.remove("show");
        }
      });
    }
  });
})();
