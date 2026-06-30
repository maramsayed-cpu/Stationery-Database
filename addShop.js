/*

  Student Name: Maram Sayed
  Student #: 101304334

*/

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // when save button is clicked, send post request with new info
  document.getElementById("save").addEventListener("click", async () => {
    let shop = document.getElementById("shopName").value;
    let artist = document.getElementById("artistName").value;
    let location = document.getElementById("basedIn").value;
    let url = document.getElementById("link").value;
    let shopSite = document.getElementById("site").value;

    let response = await fetch("/shops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopName: shop,
        artistName: artist,
        basedIn: location,
        siteName: shopSite,
        shopURL: url,
      }),
    });

    if (!response.ok) {
      alert("failed");
    } else {
      let res = await response.json();
      window.location.href = "/shops/" + res.shopName;
    }
  });
});
