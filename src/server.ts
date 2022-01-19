import 'dotenv/config';
import App from './app';
import ResolutionsRoutes from './routes/resolutions'
import CountriesRoutes from './routes/countries'

const app = new App([
    new ResolutionsRoutes(),
    new CountriesRoutes()
]);

app.listen();
