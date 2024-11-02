// plugin will be functionality that's not depended on multi-player states
export abstract class Plugin {
  constructor() {
    if (new.target === Plugin) {
      throw new Error(
        "Plugin is an abstract class and cannot be instantiated directly."
      );
    }
  }

  abstract genInitialize(): Promise<void>;

  abstract genUpdate(): Promise<void>;
}

class PluginManager {
  plugins: Plugin[];
  constructor() {
    this.plugins = [];
  }

  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  async genInitializeAll() {
    this.plugins.forEach(async (plugin) => await plugin.genInitialize());
  }

  async genUpdateAll() {
    this.plugins.forEach(async (plugin) => await plugin.genUpdate());
  }
}

const pluginManager = new PluginManager();
export default pluginManager;
