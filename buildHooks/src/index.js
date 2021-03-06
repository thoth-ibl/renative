import chalk from 'chalk';
import shelljs from 'shelljs';
import path from 'path';
import fs from 'fs';

const hooks = {
    hello: c => new Promise((resolve, reject) => {
        console.log(`\n${chalk.yellow('HELLO FROM BUILD HOOKS!')}\n`);
        resolve();
    }),
    convertPlugins: c => new Promise((resolve, reject) => {
        for (const k in c.files.pluginTemplatesConfig.plugins) {
            const pf = path.join(c.paths.rnvPluginTemplatesFolder, k);
            const fp = path.join(pf, 'renative-plugin.json');

            if (fs.existsSync(pf)) {
                shelljs.mkdir('-p', pf);
            }

            const plugin = Object.assign({ name: k }, c.files.pluginTemplatesConfig.plugins[k]);

            fs.writeFileSync(fp, JSON.stringify(plugin, null, 2));
        }

        resolve();
    }),
};

const pipes = {
    'app:configure:before': hooks.hello,
};

export { pipes, hooks };
