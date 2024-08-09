document.addEventListener("DOMContentLoaded", function () {
  // Load header
  fetch("partials/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
      addNavigationListeners();
    })
    .catch((error) => console.error("Error loading header:", error));

  // Load footer
  fetch("partials/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch((error) => console.error("Error loading footer:", error));

  // Function to load page content
  function loadPage(page) {
    fetch(`pages/${page}.html`)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("main-content").innerHTML = data;
      })
      .catch((error) => console.error("Error loading page:", error));
  }

  // Example: Load the home page initially
  loadPage("home");

  // Add event listeners to navigation links
  function addNavigationListeners() {
    const navLinks = document.querySelectorAll("#header .profile_img a, #header .logo a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const page = this.getAttribute("href").split(".html")[0];
        loadPage(page);
      });
    });
  }

  

  

});


