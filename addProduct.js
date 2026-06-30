/*

  Student Name: Maram Sayed
  Student #: 101304334

*/

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // when save button is clicked, send post request with new info
  document.getElementById("next").addEventListener("click", async () => {
    let nameProduct = document.getElementById("name").value;
    let userId = document.getElementById("user").value;
    let priceProduct = document.getElementById("price").value;
    let typeProduct = document.getElementById("type").value;
    let shop = document.getElementById("shopName").value;
    let purchased = document.getElementById("purchased").value;
    let artist = document.getElementById("artistName").value;
    let location = document.getElementById("basedIn").value;

    doneButton.innerHTML = "Done";

    let label1 = document.getElementById("label1");
    let label2 = document.getElementById("label2");

    if (purchased == "Online") {
      label1.innerHTML = "Shop Site: ";
      label2.innerHTML = "Shop Link: ";

      doneButton.addEventListener("click", async () => {
        let input1 = document.getElementById("input1").value;
        let input2 = document.getElementById("input2").value;
        if (nameProduct && priceProduct && shop && userId && input2) {
          let response = await fetch("/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: nameProduct,
              price: parseFloat(priceProduct),
              type: typeProduct,
              purchased: "online",
              shopName: shop,
              shopSite: input1,
              shopLink: input2,
              artistName: artist,
              basedIn: location,
              userID: userId,
            }),
          });

          if (!response.ok) {
            alert("failed");
          } else {
            let res = await response.json();
            window.location.href = "/products/" + res.productID;
          }
        } else {
          alert("Please make sure to enter all data!");
          window.location.href = "/addProduct";
        }
      });
    } else {
      label1.innerHTML = "Store Name: ";
      label2.innerHTML = "Store Address: ";

      doneButton.addEventListener("click", async () => {
        let input1 = document.getElementById("input1").value;
        let input2 = document.getElementById("input2").value;
        if (nameProduct && priceProduct && shop && userId && input1 && input2) {
          let response = await fetch("/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: nameProduct,
              price: parseFloat(priceProduct),
              type: typeProduct,
              purchased: "inPerson",
              shopName: shop,
              storeName: input1,
              storeAddress: input2,
              artistName: artist,
              basedIn: location,
              userID: userId,
            }),
          });

          if (!response.ok) {
            alert("failed");
          } else {
            alert(
              "Please upload product image onto drive folder, naming the file with the image ID given!!",
            );
            let res = await response.json();
            window.location.href = "/products/" + res.productID;
          }
        } else {
          alert("Please make sure to enter all data!");
        }
      });
    }
  });
});
