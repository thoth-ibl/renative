import chalk from 'chalk';
import path from 'path';
import { isPlatformSupported, getConfig, logTask, logComplete, logError } from './common';
import { cleanFolder, copyFolderContentsRecursiveSync } from './fileutils';

const create = (configName, program, process) => {
    getConfig(configName).then((v) => {
        _runCreateApp(v)
            .then(() => logComplete())
            .catch(e => logError(e));
    });
};

const _runCreateApp = c => new Promise((resolve, reject) => {
    logTask('runCreateApp');
    // console.log('CONFIGIS:', c);
    _runCleanPlaformFolders(c)
        .then(() => _runCopyPlatforms(c))
        .then(() => resolve());
});

const _runCleanPlaformFolders = c => new Promise((resolve, reject) => {
    logTask('_runCleanPlaformFolders');

    const cleanTasks = [];

    for (const k in c.appConfigFile.platforms) {
        if (isPlatformSupported(k)) {
            const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${k}`);
            const ptPath = path.join(c.platformTemplatesFolder, `${k}`);
            cleanTasks.push(cleanFolder(pPath));
        }
    }

    Promise.all(cleanTasks).then((values) => {
        resolve();
    });
});

const _runCopyPlatforms = c => new Promise((resolve, reject) => {
    const copyPlatformTasks = [];
    for (const k in c.appConfigFile.platforms) {
        if (isPlatformSupported(k)) {
            const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${k}`);
            const ptPath = path.join(c.platformTemplatesFolder, `${k}`);
            copyPlatformTasks.push(copyFolderContentsRecursiveSync(ptPath, pPath));
        }
    }

    Promise.all(copyPlatformTasks).then((values) => {
        resolve();
    });
});

export { create };