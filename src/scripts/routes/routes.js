import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add/add-story-page'; 
import LoginPage from '../pages/login/login-page';
import FavoritePage from '../pages/favorite/favorite-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add': new AddStoryPage(), 
  '/login': new LoginPage(),
  '/favorite': new FavoritePage(),
};

export default routes;
