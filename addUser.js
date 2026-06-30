

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // when save button is clicked, send post request with new info
  document.getElementById("save").addEventListener("click", async () => {
    let name = document.getElementById("name").value;
    if (name) {
      let response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: name,
        }),
      });

      if (!response.ok) {
        alert("failed");
      } else {
        alert("succesfully registered");
        window.location.href = "/";
      }
    } else {
      alert("Please enter a name!");
      window.location.href = "/register";
    }
  });
});
