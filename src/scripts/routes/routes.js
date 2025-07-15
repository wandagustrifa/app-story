import HomePage from '../views/pages/home-page';
import LoginPage from '../views/pages/login-page';
import RegisterPage from '../views/pages/register-page';
import AddStoryPage from '../views/pages/add-story-page';
import FavoritesPage from '../views/pages/favorites-page'; 
import NotFoundPage from '../views/pages/not-found-page'; 

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/add-story': AddStoryPage,
  '/favorites': FavoritesPage,
  '/404': NotFoundPage,
};

export default routes;