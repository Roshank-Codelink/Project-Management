let mongooes=require("mongoose");
require("dotenv").config();

let MongoDB_URL=process.env.MongoDB_URL as string
export let Connenction=async()=>{
    try {
        await mongooes.connect(MongoDB_URL)
        console.log("db is connected");
    } catch (error) {
        console.log(error);
    }
}
