class Header {
  async render() {
    const isLoggedIn = !!localStorage.getItem('authToken');

    return `
      <div class="main-header container">
        <a class="brand-name" href="#/">App</a>

        <nav id="navigation-drawer" class="navigation-drawer">
          <ul class="nav-list">
            <li><a href="#/">Beranda</a></li>
            <li><a href="#/about">About</a></li>
            <li><a href="#/add">Tambah Cerita</a></li>
            ${
              isLoggedIn
                ? `<li><a href="#/favorite">Favorite</a></li>
                   <li><a href="#" id="logout-link">Logout</a></li>`
                : '<li><a href="#/login">Login</a></li>'
            }
          </ul>
        </nav>

        <button id="drawer-button" class="drawer-button">☰</button>
      </div>
    `;
  }

  async afterRender() {
    const drawerButton = document.querySelector('#drawer-button');
    const navigationDrawer = document.querySelector('#navigation-drawer');

    // ✅ Toggle drawer
    if (drawerButton && navigationDrawer) {
      drawerButton.addEventListener('click', () => {
        navigationDrawer.classList.toggle('open');
      });

      document.body.addEventListener('click', (event) => {
        if (
          !navigationDrawer.contains(event.target) &&
          !drawerButton.contains(event.target)
        ) {
          navigationDrawer.classList.remove('open');
        }

        navigationDrawer.querySelectorAll('a').forEach((link) => {
          if (link.contains(event.target)) {
            navigationDrawer.classList.remove('open');
          }
        });
      });
    }

    // ✅ Logout
    const logoutLink = document.querySelector('#logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        location.hash = '#/login';
      });
    }
  }
}

export default Header;
