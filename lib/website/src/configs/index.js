import AppConfig from "./app.json";
import AstroConfig from "./astro.json";
import MenuConfig from "./menu.json";
import NavbarConfig from "./navbar.json";

/**
 * Configuration data for the website.
 * Don't change the name and don't use directly but use `import config from "@walle/config";` instead.
 * This allows to use the `config` in the components without importing the file directly.
 */
export default {
  // Default configuration. Don't change or remove this.
  astro: AstroConfig,
  app: AppConfig,
  menu: MenuConfig,
  navbar: NavbarConfig, // Use the menu configuration for the navbar
  // Custom configuration
};
