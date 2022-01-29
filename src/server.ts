import 'dotenv/config';
import App from './app';
import ResolutionsRoutes from './routes/resolutions'
import CountriesRoutes from './routes/countries'
import SignUp from './routes/authentication/signup'

const app = new App([
    new ResolutionsRoutes(),
    new CountriesRoutes(),
    new SignUp()
]);

app.listen();
