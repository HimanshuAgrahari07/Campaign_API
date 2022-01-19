import 'dotenv/config';
import App from './app';
import ResolutionsRoutes from './routes/resolutions'
const app = new App([
    new ResolutionsRoutes()
]);

app.listen();
