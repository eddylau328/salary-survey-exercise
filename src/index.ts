import App from "app";
import DB from "db";

const db = new DB();
const app = new App([]);

db.initialize();
app.initialize();
