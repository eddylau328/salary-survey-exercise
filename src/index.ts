import App from "app";
import DB from "db";
import SalarySurveyController from "controllers/salarySurveyController";

const db = new DB();
const app = new App([new SalarySurveyController()]);

db.initialize();
app.initialize();
