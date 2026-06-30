

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // when save button is clicked, send post request with new info
  document.getElementById("filter").addEventListener("change", async () => {
    let searchFilter = document.getElementById("filter").value;
    let searchDiv = document.getElementById("searchDiv");
    let productsDiv = document.getElementById("products");

    searchDiv.innerHTML = "";
    productsDiv.innerHTML = "";

    if (searchFilter == "ProductType") {
      let select = document.createElement("select");

      let types = [
        "Select type",
        "Washi Tape",
        "Sticker Flake",
        "Sticker Sheet",
        "Art Print",
        "Other",
        "Memo Pad",
      ];

      types.forEach((type) => {
        let option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
      });

      searchDiv.appendChild(select);

      select.addEventListener("change", async () => {
        let result = select.value;

        let response = await fetch("/products/filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filterType: searchFilter,
            filterResult: result,
          }),
        });

        if (!response.ok) {
          alert("failed");
        } else {
          let res = await response.json();

          let list = document.createElement("ul");

          productsDiv.innerHTML = "";
          console.log(res);

          res.products.forEach((product) => {
            let listItem = document.createElement("li");
            let link = document.createElement("a");
            link.href = "/products/" + product.productID;
            link.innerHTML = product.productName;

            listItem.appendChild(link);
            list.appendChild(listItem);
          });
          productsDiv.appendChild(list);
        }
      });
    } else if (searchFilter == "MyLikes") {
      let select = document.createElement("select");
      let option1 = document.createElement("option");
      option1.value = "Select a user";
      option1.textContent = "Select a user";
      select.appendChild(option1);

      usersList.forEach((user) => {
        let option = document.createElement("option");
        option.value = user.userID;
        option.textContent = user.userID;
        select.appendChild(option);
      });

      searchDiv.appendChild(select);

      select.addEventListener("change", async () => {
        let result = select.value;
        if (result) {
          let response = await fetch("/products/filter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filterType: searchFilter,
              filterResult: result,
            }),
          });

          if (!response.ok) {
            alert("failed");
          } else {
            let res = await response.json();

            let list = document.createElement("ul");

            productsDiv.innerHTML = "";
            console.log(res);

            res.products.forEach((product) => {
              let listItem = document.createElement("li");
              let link = document.createElement("a");
              link.href = "/products/" + product.productID;
              link.innerHTML = product.productName;

              listItem.appendChild(link);
              list.appendChild(listItem);
            });
            productsDiv.appendChild(list);
          }
        } else {
          alert("Please enter your User ID!");
        }
      });
    } else if (searchFilter == "ShopName") {
      let select = document.createElement("select");
      let option1 = document.createElement("option");
      option1.value = "Select a shop";
      option1.textContent = "Select a shop";
      select.appendChild(option1);

      shopsList.forEach((shop) => {
        let option = document.createElement("option");
        option.value = shop.shopName;
        option.textContent = shop.shopName;
        select.appendChild(option);
      });

      searchDiv.appendChild(select);

      select.addEventListener("change", async () => {
        let result = select.value;
        if (result) {
          let response = await fetch("/products/filter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filterType: searchFilter,
              filterResult: result,
            }),
          });

          if (!response.ok) {
            alert("failed");
          } else {
            let res = await response.json();

            let list = document.createElement("ul");

            productsDiv.innerHTML = "";
            console.log(res);

            res.products.forEach((product) => {
              let listItem = document.createElement("li");
              let link = document.createElement("a");
              link.href = "/products/" + product.productID;
              link.innerHTML = product.productName;

              listItem.appendChild(link);
              list.appendChild(listItem);
            });
            productsDiv.appendChild(list);
          }
        } else {
          alert("Please enter a shop name!");
        }
      });
    } else if (searchFilter == "All") {
      let response = await fetch("/products/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterType: searchFilter,
          filterResult: null,
        }),
      });

      if (!response.ok) {
        alert("failed");
      } else {
        let res = await response.json();

        let list = document.createElement("ul");

        productsDiv.innerHTML = "";
        console.log(res);

        res.products.forEach((product) => {
          let listItem = document.createElement("li");
          let link = document.createElement("a");
          link.href = "/products/" + product.productID;
          link.innerHTML = product.productName;

          listItem.appendChild(link);
          list.appendChild(listItem);
        });
        productsDiv.appendChild(list);
      }
    }
  });
});
