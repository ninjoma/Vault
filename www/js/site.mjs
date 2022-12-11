import { Config } from "./config.mjs";

class Site {

    static async GetAllSites(){
        let res = await fetch(Config.API_URL + "/sites", {
            method: "GET",
            headers: Config.DefaultHeader,
        })
        if(res.ok){
            return res.json().then((result) => result);
        }
    }

    static async GetAllSitesByCategory(categoryid){
        let res = await fetch(Config.API_URL + "/categories/" + categoryid, {
            method: "GET",
            headers: Config.DefaultHeader,
        })
        if(res.ok){
            return res.json().then((result) => result);
        }
    }

    static async AddNewSite(categoryid, sitebody){
        await fetch(Config.API_URL + "/categories/" + categoryid, {
            method: "POST",
            headers: Config.DefaultHeader,
            body: JSON.stringify(sitebody),
        })
    }

    static async DeleteSite(siteid){
        await fetch(Config.API_URL + "/sites/" + siteid, {
            method: "DELETE",
            headers: Config.DefaultHeader,
        })
    }
}

export { Site }