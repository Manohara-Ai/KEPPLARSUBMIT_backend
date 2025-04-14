document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const toggleCheckbox = document.getElementById('showPassword');

    if (toggleCheckbox && passwordInput) {
        toggleCheckbox.addEventListener('change', () => {
            passwordInput.type = toggleCheckbox.checked ? 'text' : 'password';
        });
    }

    const form = document.querySelector('.login-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('https://05d7-2409-408c-8d86-bf3c-6880-a029-d4df-c469.ngrok-free.app/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (result.message === "Login successful") {
                    localStorage.setItem("sessionKey", result.sessionKey);
                    console.log("✅ Login successful!");
                    window.location.href = "home.html";
                } else {
                    alert("❌ Invalid username or password");
                }
            } catch (err) {
                alert("🚨 Error connecting to server");
                console.error(err);
            }
        });
    }

    // Define the checkSession function to validate the session
    async function checkSession() {
        const sessionKey = localStorage.getItem("sessionKey");
        if (!sessionKey) {
            alert("❌ Session has expired! Please login again!");
            window.location.href = "index.html";
        } else {
            try {
                const response = await fetch('https://05d7-2409-408c-8d86-bf3c-6880-a029-d4df-c469.ngrok-free.app/validateSession', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({sessionKey})
                });

                const result = await response.json();

                if (result.message === "Session valid") {
                    console.log("✅ Session is still valid!");
                } else {
                    alert("❌ Session is no longer valid. Please login again.");
                    localStorage.removeItem("sessionKey");
                    window.location.href = "index.html";
                }
            } catch (err) {
                alert("🚨 Error connecting to server");
                console.error(err);
            }
        }
    }

    async function checkLeaderboard() {
        try {
            const response = await fetch("https://05d7-2409-408c-8d86-bf3c-6880-a029-d4df-c469.ngrok-free.app/leaderboard");
            
            const result = await response.text();
            console.log(result);
            
            if (data && data.isLive) {
                console.log("Leaderboard is live!");
                window.location.href = "leaderboard.html";
            } else {
                alert("This webpage isn't live yet. Please check back later.");
            }
        } catch (error) {
            console.error("Error checking leaderboard:", error);
            alert("Unable to check leaderboard status. Please try again later.");
        }
    }
    
    
    // Help button event listener
    const helpButton = document.querySelector('.help-link');
    if (helpButton) {
        helpButton.addEventListener('click', function(event) {
            event.preventDefault();
            alert("Need help? Contact volunteers or visit the Help Desk.");
        });
    }

    // Leaderboard button event listener
    const leaderboardButton = document.querySelector('.leaderboard-link');
    if (leaderboardButton) {
        checkSession(); // Ensure session is valid before proceeding

        leaderboardButton.addEventListener('click', async function(event) {
            event.preventDefault();
            window.location.href = "leaderboard.html";
        });
    }

    // Home button event listener
    const homeButton = document.querySelector('.home-link');
    if (homeButton) {
        checkSession();
        homeButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = "home.html";
        });
    }

    // Download button event listener
    const downloadButton = document.querySelector('.download-button');
    if (downloadButton) {
        checkSession();
        downloadButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = "https://05d7-2409-408c-8d86-bf3c-6880-a029-d4df-c469.ngrok-free.app/download";
        });
    }

    // Upload button event listener
    const uploadButton = document.querySelector('.upload-button');
    const modal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close');
    const uploadForm = document.getElementById('uploadForm');
    const uploadStatus = document.getElementById('uploadStatus');

    if (uploadButton) {
        checkSession(); // Keep session check if needed

        uploadButton.addEventListener('click', function(event) {
            event.preventDefault();
            modal.style.display = "block"; // 🔥 Show the modal
        });
    }

    // Modal close functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Upload form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(uploadForm);
            uploadStatus.innerText = "Uploading...";

            try {
                const response = await fetch("https://05d7-2409-408c-8d86-bf3c-6880-a029-d4df-c469.ngrok-free.app/upload", {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();
                uploadStatus.innerText = result.detail || "Upload complete!";
            } catch (err) {
                uploadStatus.innerText = "Upload failed. Please try again.";
            }
        });
    }

    // Logout button event listener
    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function (event) {
            event.preventDefault();
    
            const sessionKey = localStorage.getItem("sessionKey");
    
            // Notify the backend about logout
            try {
                await fetch('https://05d7-2409-408c-8d86-bf3c-6880-a029-d4df-c469.ngrok-free.app/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionKey })
                });
            } catch (err) {
                console.error("Error notifying server during logout:", err);
            }
    
            localStorage.removeItem('sessionKey');
            window.location.href = "index.html";
        });
    }
});
