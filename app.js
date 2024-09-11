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

        // toggleMenu();
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

            window.scrollTo({
              top: 0,
              behavior: "smooth", // Adds a smooth scroll effect
            });

            document.getElementById("main-content").classList.remove("hidden");
            addNavigationListeners();
            attachEventListeners();
            toggleMenu();
            walletConnect();
            nftCreate();

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
      const navLinks = document.querySelectorAll(
        "#header .profile_dropdown a, #header .user_profile a, .logo a, .footer_link a, #hero .cta_btn a"
      );
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
    document
      .querySelectorAll("header .profile_dropdown ul li a")
      .forEach((item) => {
        item.addEventListener("click", function () {
          document.querySelector(".profile_dropdown").style.opacity = "0";
          document.querySelector(".profile_dropdown").style.visibility =
            "hidden";
        });
      });

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

    // Navbar toggle open
    function toggleMenu() {
      const checkbox = document.getElementById("check");
      const menu = document.getElementById("menu");
      const content = document.getElementById("main-content");
      const menuItems = document.querySelectorAll("#menu a");

      // Event listener to toggle the menu open/close
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          menu.classList.add("open");
          content.classList.add("blur");
        } else {
          menu.classList.remove("open");
          content.classList.remove("blur");
        }
      });

      // Close the menu if clicked outside
      window.addEventListener("click", function (event) {
        if (
          !menu.contains(event.target) &&
          event.target !== checkbox &&
          event.target.closest("label") === null
        ) {
          checkbox.checked = false;
          menu.classList.remove("open");
          content.classList.remove("blur");
        }
      });

      // Close the menu when a menu item is clicked
      menuItems.forEach((item) => {
        item.addEventListener("click", (event) => {
          checkbox.checked = false;
          menu.classList.remove("open");
          content.classList.remove("blur");

          // Smooth scroll to the section
          const targetId = item.getAttribute("href");
          if (targetId) {
            event.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              const headerOffset =
                document.querySelector("header").offsetHeight;
              const elementPosition =
                targetElement.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = elementPosition - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }
        });
      });
    }

    // Wallet connect
    function walletConnect() {
      const connectWalletButton = document.getElementById(
        "connectWalletButton"
      );
      const walletAddressElement = document.getElementById("walletAddress");

      if (connectWalletButton) {
        connectWalletButton.addEventListener("click", async function () {
          if (typeof window.ethereum !== "undefined") {
            const web3 = new Web3(window.ethereum);
            try {
              // Request account access
              const accounts = await ethereum.request({
                method: "eth_requestAccounts",
              });
              const walletAddress = accounts[0];

              // Shorten the wallet address (e.g., "0x1234...abcd")
              const shortWalletAddress = `${walletAddress.slice(
                0,
                6
              )}...${walletAddress.slice(-4)}`;

              // Display the shortened wallet address
              walletAddressElement.textContent = `${shortWalletAddress}`;

              // Hide the Connect Wallet button
              connectWalletButton.style.display = "none";
            } catch (error) {
              console.error("User denied account access", error);
            }
          } else {
            console.error("MetaMask is not installed!");
          }
        });
      }
    }

    function nftCreate() {
      const imageUpload = document.getElementById("imageUpload");

      if (!imageUpload) {
        console.error("imageUpload element not found");
        return;
      }

      imageUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
          const imagePreview = document.getElementById("imagePreview");
          const svgRemove = document.getElementById("svg");

          svgRemove.style.display = "none";
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
        };

        if (file) {
          reader.readAsDataURL(file); // Read the image as a data URL
        }
      });

      const nftCard = document.getElementById("nftForm");
      nftCard.addEventListener("submit", function (event) {
        event.preventDefault();

        const nftName = document.getElementById("nftName").value;
        const nftLink = document.getElementById("nftLink").value;
        const nftCol = document.getElementById("nftCol").value;
        const nftPrice = document.getElementById("nftPrice").value;
        const description = document.getElementById("nftDescription").value;
        const imageSrc = document.getElementById("imagePreview").src;

        // Create a new card
        const cardContainer = document.getElementById("cardContainer");
        const card = document.createElement("div");
        card.classList.add("card");

        const imgElement = document.createElement("img");
        imgElement.src = imageSrc;

        const nameElement = document.createElement("h3");
        nameElement.textContent = nftName;

        const linkElement = document.createElement("p");
        linkElement.textContent = nftLink;

        const colElement = document.createElement("p");
        colElement.textContent = nftCol;

        const priceElement = document.createElement("p");
        priceElement.textContent = nftPrice;

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = description;

        // Append elements to the card
        card.appendChild(imgElement);
        card.appendChild(nameElement);
        card.appendChild(linkElement);
        card.appendChild(colElement);
        card.appendChild(priceElement);
        card.appendChild(descriptionElement);

        // Add the card to the container
        cardContainer.style.display = 'flex'
        cardContainer.appendChild(card);

        const blurPage = document.getElementById("create");
        blurPage.classList.add("blur");
        // Optionally, reset the form
        document.getElementById('nftForm').reset();
        document.getElementById('imagePreview').style.display = 'none';

      });

      const nftClear = document.getElementById("nftref");
      nftClear.addEventListener("click", function () {
        cardContainer.style.display = 'none';
        cardContainer.reset();
      })
    }

    // addNavigationListeners();
    // attachEventListeners();
    // toggleMenu();
    // walletConnect();
    nftCreate();
  });
})();
