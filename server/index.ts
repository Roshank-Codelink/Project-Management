import { ProjectRoutes } from "./Routes/Project.Routes";

let express = require('express');
require("dotenv").config();
let cors = require('cors')
let { Connenction } = require("./Config/db");
let { Authroutes } = require("./Routes/Auth.Routes");
const cookieParser = require('cookie-parser')

let app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true 
}));
app.use(express.json());

app.use(cookieParser());
app.use(express.static("./Images"));

app.use("/api/v1/authentication", Authroutes);
app.use("/api/v1/projects", ProjectRoutes);


app.listen(process.env.PORT, async () => {
    try {
        await Connenction();
        console.log(`server is running on port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
})