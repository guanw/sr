// plugin will be functionality that's not depended on multi-player states
export interface Plugin {
  genInitialize(): Promise<void>;

  genUpdate(): Promise<void>;
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
