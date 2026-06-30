/*

  Student Name: Maram Sayed
  Student #: 101304334

*/

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // when save button is clicked, send post request with new info
  document.getElementById("like").addEventListener("click", async () => {
    let productId = document.getElementById("productID").dataset.id;
    let userIdLabel = document.createElement("label");
    userIdLabel.innerHTML = "User ID: ";
    let UserId = document.createElement("input");
    let doneButton = document.createElement("button");
    doneButton.innerHTML = "Done";

    let likeDiv = document.getElementById("likeDiv");
    likeDiv.innerHTML = "";

    likeDiv.append(
      document.createElement("br"),
      document.createElement("br"),
      userIdLabel,
      UserId,
      document.createElement("br"),
      document.createElement("br"),
      doneButton,
    );

    doneButton.addEventListener("click", async () => {
      let response = await fetch("/products/likeProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productID: productId,
          userID: UserId.value,
        }),
      });

      if (!response.ok) {
        alert("failed");
      } else {
        let res = await response.json();
        // update the likes label dynamically
        document.getElementById("likes").innerText = `Likes: ${res.likes}`;
      }
    });
  });

  document.getElementById("review").addEventListener("click", async () => {
    let productId = document.getElementById("productID").dataset.id;
    let userIdLabel = document.createElement("label");
    userIdLabel.innerHTML = "User ID: ";
    let UserId = document.createElement("input");
    let ratingLabel = document.createElement("label");
    ratingLabel.innerHTML = "Rating (out of 5): ";
    let Rating = document.createElement("input");
    let reviewLabel = document.createElement("label");
    reviewLabel.innerHTML = "Review Comment: ";
    let review = document.createElement("textarea");
    let doneButton = document.createElement("button");
    doneButton.innerHTML = "Submit Review";

    let reviewDiv = document.getElementById("reviewDiv");
    reviewDiv.innerHTML = "";

    reviewDiv.append(
      document.createElement("br"),
      document.createElement("br"),
      userIdLabel,
      UserId,
      document.createElement("br"),
      document.createElement("br"),
      ratingLabel,
      Rating,
      document.createElement("br"),
      document.createElement("br"),
      reviewLabel,
      review,
      document.createElement("br"),
      document.createElement("br"),
      doneButton,
    );

    doneButton.addEventListener("click", async () => {
      let response = await fetch("/products/reviewProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: UserId.value,
          productID: productId,
          rating: Rating.value,
          reviewComment: review.value,
        }),
      });

      if (!response.ok) {
        alert("failed");
      } else {
        let res = await response.json();
        window.location.href = "/products/" + res.id;
      }
    });
  });
});
