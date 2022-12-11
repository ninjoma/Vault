import { Category } from "./category.mjs";
import { Site } from "./site.mjs";

var categoryContainer = document.getElementById("categorycontainer");
var categoryTable = document.getElementById("categorytable");


async function retrieveSites(element) {
    var siteList = await Site.GetAllSitesByCategory(element.dataset.categoryid)
    categoryTable.innerHTML = "";
    siteList.forEach(site => {
        // Parent
        var sitecontainerDOM = document.createElement("tr");
        sitecontainerDOM.dataset.siteid = site.id;

        // site Name
        var sitenameDOM = document.createElement("td");
        sitenameDOM.classList.add("tablecolumn");
        sitenameDOM.innerHTML = site.name;
        sitecontainerDOM.appendChild(sitenameDOM);

        // site Name
        var userDOM = document.createElement("td");
        userDOM.classList.add("tablecolumn");
        userDOM.innerHTML = site.user;
        sitecontainerDOM.appendChild(userDOM);

        // site Password
        var passwordDOM = document.createElement("td");
        passwordDOM.classList.add("tablecolumn");
        passwordDOM.innerHTML = "********";
        sitecontainerDOM.appendChild(passwordDOM);

        // Created Date
        var dateDOM = document.createElement("td");
        dateDOM.classList.add("tablecolumn");
        var createdAtDate = new Date(site.createdAt);
        dateDOM.innerHTML = createdAtDate.getDate() + "/" + createdAtDate.getMonth() + "/" + createdAtDate.getFullYear();
        sitecontainerDOM.appendChild(dateDOM);

        var actionsDOM = document.createElement("td");
        actionsDOM.classList.add("tablecolumn");
        var DeleteButtonDOM = document.createElement("i");
        DeleteButtonDOM.classList.add("bi", "bi-x-circle-fill")
        DeleteButtonDOM.addEventListener("click", () => {
            Site.DeleteSite(sitecontainerDOM.dataset.siteid).then(() => {
                retrieveSites(element);
            });
        })
        actionsDOM.appendChild(DeleteButtonDOM);
        sitecontainerDOM.appendChild(actionsDOM);

        categoryTable.appendChild(sitecontainerDOM);
    })
}


Category.GetAllCategories().then((result) => {
    console.log(result)
    result.forEach(element => {
        var categoryDOM = document.createElement("div");
        categoryDOM.classList.add("category");
        categoryDOM.dataset.categoryid = element.id;
        var categoryTitleDOM = document.createElement("div");
        categoryTitleDOM.classList.add("categorytitle");
        categoryTitleDOM.innerHTML = element.name;

        categoryTitleDOM.addEventListener("click", async () => {
            retrieveSites(categoryDOM);
        });

        categoryDOM.appendChild(categoryTitleDOM);
        categoryContainer.appendChild(categoryDOM);
    });
})