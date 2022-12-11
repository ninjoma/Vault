import { Config } from "./config.mjs";

class Category {
    static async CreateNew(categoryname){
        await fetch(Config.API_URL + "/categories", {
            method: "POST",
            headers: Config.DefaultHeader,
            body: JSON.stringify({
                name: categoryname
            }),
        })
    }

    static async GetAllCategories(){
        let res = await fetch(Config.API_URL + "/categories", {
            method: "GET",
            headers: Config.DefaultHeader,
        })
        if(res.ok){
            return res.json().then((result) => result);
        }
    }

    static async DeleteCategory(id){
        await fetch(Config.API_URL + "/" + id, {
            method: "DELETE",
            headers: Config.DefaultHeader,
        })
    }
}

export { Category }