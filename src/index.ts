import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupyterlab-fileopen extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-fileopen:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-fileopen is activated!');

    requestAPI<any>('get_example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab-fileopen server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default extension;
