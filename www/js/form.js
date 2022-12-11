import { Category } from "./category.mjs";
import { Site } from "./site.mjs";

var passwordgenerator = document.getElementById("passwordgenerator");

var usernamefield = document.getElementById("username");
var passwordfield = document.getElementById("password");
var sitenamefield = document.getElementById("sitename");
var urlfield = document.getElementById("url");
var descfield = document.getElementById("description");


var siteform = document.getElementById("siteform");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var categoryid = urlParams.get('category');
var siteid = urlParams.get('site');


const generateString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"

function generatePassword(){
    return Array.from(window.crypto.getRandomValues(new Uint32Array(15)))
    .map((x) => generateString[x % generateString.length])
    .join('')
}

passwordgenerator.addEventListener("click", () => {
    passwordfield.value = generatePassword();
});

siteform.addEventListener("submit", (evt) => {
    evt.preventDefault();
    if(!categoryid){
        return;
    }
    var sitebody = {
        user: usernamefield.value,
        name: sitenamefield.value,
        password: passwordfield.value,
        url: urlfield.value,
        description: descfield.value,
    };
    if(siteid){
        sitebody.id = siteid;
    };
    Site.AddNewSite(categoryid, sitebody).then(() => {
        window.location = "/" + "?category=" + categoryid;
    });
})

window.onload = async function(){
    if(siteid){
        let sites = await Site.GetAllSitesByCategory(categoryid)
        let givenSite = sites.filter((site) => site.id == siteid)[0];
        if(givenSite){
            usernamefield.value = givenSite.user;
            sitenamefield.value = givenSite.name;
            passwordfield.value = givenSite.password;
            urlfield.value = givenSite.url;
            descfield.value = givenSite.description;
        }
    }
}

