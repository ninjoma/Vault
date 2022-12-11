import { Category } from "./category.mjs";
import { Site } from "./site.mjs";

var categoryContainer = document.getElementById("categorycontainer");
var categoryTable = document.getElementById("categorytable");
var createcategory = document.getElementById("createcategory");
var addNewSite = document.getElementById("createsite");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

addNewSite.addEventListener("click", () => {
    if(!window.currentCategory){
        alert("Por favor, selecciona la categoría donde quieres crear el Site.")
        return;
    };
    let url = '/form.html?'
    url = url + 'category=' + window.currentCategory;
    window.location = url;
});

createcategory.addEventListener("click", () => {
    let categoryname = prompt("Por favor, introduce el nombre de la nueva categoría");
    if(categoryname.trim().length < 1){
        alert("por favor, introduzca un nombre válido.")
        return;
    }
    Category.CreateNew(categoryname).then(() => {
        retrieveCategories();
    })
});

async function retrieveSites(categoryid) {
    var siteList = await Site.GetAllSitesByCategory(categoryid)
    categoryTable.innerHTML = "";
    console.log(siteList);
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
        actionsDOM.classList.add("tablecolumn", "tableicons");

        var OpenUrlDOM = document.createElement("i");
        OpenUrlDOM.classList.add("bi", "bi-archive-fill");
        OpenUrlDOM.addEventListener("click", async () => {
            window.open(site.url);
        })
        actionsDOM.appendChild(OpenUrlDOM);

        var DeleteButtonDOM = document.createElement("i");
        DeleteButtonDOM.classList.add("bi", "bi-x-circle-fill");
        DeleteButtonDOM.addEventListener("click", () => {
            Site.DeleteSite(sitecontainerDOM.dataset.siteid).then(() => {
                retrieveSites(categoryid);
            });
        })
        actionsDOM.appendChild(DeleteButtonDOM);

        var EditButtonDOM = document.createElement("i");
        EditButtonDOM.classList.add("bi", "bi-pencil-fill");
        EditButtonDOM.addEventListener("click", () => {
            if(!window.currentCategory){
                return;
            };
            let url = '/form.html?'
            url = url + 'category=' + window.currentCategory;
            url = url + '&site=' + sitecontainerDOM.dataset.siteid;
            window.location = url;
        });
        actionsDOM.appendChild(EditButtonDOM);

        
        sitecontainerDOM.appendChild(actionsDOM);

        categoryTable.appendChild(sitecontainerDOM);
    })
}

async function retrieveCategories() {
    categoryContainer.innerHTML = "";
    Category.GetAllCategories().then((result) => {
        result.forEach(element => {
            var categoryDOM = document.createElement("div");
            categoryDOM.classList.add("category");
            categoryDOM.dataset.categoryid = element.id;
            var categoryTitleDOM = document.createElement("div");
            categoryTitleDOM.classList.add("categorytitle");
            categoryTitleDOM.innerHTML = element.name;
    
            categoryTitleDOM.addEventListener("click", async () => {
                retrieveSites(categoryDOM.dataset.categoryid);
                window.currentCategory = categoryDOM.dataset.categoryid;
            });
            categoryDOM.appendChild(categoryTitleDOM);

            var DeleteCategoryDOM = document.createElement("i");
            DeleteCategoryDOM.classList.add("bi", "bi-dash")
            DeleteCategoryDOM.addEventListener("click", () => {
                Category.DeleteCategory(categoryDOM.dataset.categoryid).then(() => {
                    retrieveCategories();
                });
            }) 
            categoryDOM.appendChild(DeleteCategoryDOM);

            categoryContainer.appendChild(categoryDOM);
        });
    })
}

window.onload = function(){
    retrieveCategories();
    var categoryid = urlParams.get('category');
    var siteid = urlParams.get('site');
    if(categoryid){
        retrieveSites(categoryid).then(() => {
            window.currentCategory = categoryid;
            window.history.pushState({}, document.title, window.location.pathname);
        })
    }
}

