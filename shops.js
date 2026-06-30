/*

  Student Name: Maram Sayed
  Student #: 101304334

*/

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // when save button is clicked, send post request with new info
  document.getElementById("filter").addEventListener("change", async () => {
    let searchFilter = document.getElementById("filter").value;
    let searchDiv = document.getElementById("searchDiv");
    let shopsDiv = document.getElementById("shops");

    searchDiv.innerHTML = "";
    shopsDiv.innerHTML = "";

    if (searchFilter == "Name") {
      let nameLabel = document.createElement("label");
      nameLabel.innerHTML = "Shop Name: ";
      let name = document.createElement("input");

      let searchButton = document.createElement("button");
      searchButton.innerHTML = "search";

      searchDiv.append(nameLabel, name, searchButton);

      searchButton.addEventListener("click", async () => {
        let result = name.value;
        let response = await fetch("/shops/filter", {
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

          shopsDiv.innerHTML = "";
          console.log(res);

          res.shops.forEach((shop) => {
            let listItem = document.createElement("li");
            let link = document.createElement("a");
            link.href = "/shops/" + shop.shopName;
            link.innerHTML = shop.shopName;

            listItem.appendChild(link);
            list.appendChild(listItem);
          });
          shopsDiv.appendChild(list);
        }
      });
    } else if (searchFilter == "All") {
      let response = await fetch("/shops/filter", {
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

        shopsDiv.innerHTML = "";
        console.log(res);

        res.shops.forEach((shop) => {
          let listItem = document.createElement("li");
          let link = document.createElement("a");
          link.href = "/shops/" + shop.shopName;
          link.innerHTML = shop.shopName;

          listItem.appendChild(link);
          list.appendChild(listItem);
        });
        shopsDiv.appendChild(list);
      }
    }
  });
});
