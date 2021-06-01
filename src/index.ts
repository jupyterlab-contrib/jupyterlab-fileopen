import { toArray } from '@lumino/algorithm';

import { PathExt } from '@jupyterlab/coreutils';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { folderIcon } from '@jupyterlab/ui-components';

import { requestAPI } from './handler';

const selectorItem = '.jp-DirListing-item[data-isdir]';
const selectorNotDir = '.jp-DirListing-item[data-isdir="false"]';

/**
 * The command IDs.
 */
namespace CommandIDs {
  export const openFileExplorer = 'jupyterlab-fileopen:open-file-explorer';
  export const openFile = 'jupyterlab-fileopen:open-file';
}

export interface IResponse {
  /*
   * Whether the request was a success or not.
   */
  success: boolean;
}

/**
 * Initialization data for the jupyterlab-fileopen extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-fileopen:plugin',
  requires: [IFileBrowserFactory],
  autoStart: true,
  activate: (app: JupyterFrontEnd, factory: IFileBrowserFactory) => {
    app.commands.addCommand(CommandIDs.openFileExplorer, {
      execute: () => {
        const widget = factory.tracker.currentWidget;

        if (widget) {
          const selection = toArray(widget.selectedItems());

          if (selection.length !== 1) {
            return;
          }

          const selected = selection[0];
          const path = PathExt.dirname(selected.path);

          requestAPI<IResponse>('open-file-explorer', {
            method: 'POST',
            body: JSON.stringify({ path: path })
          })
            .then(data => {
              // Was a success
            })
            .catch(reason => {
              console.error(
                `The jupyterlab-fileopen server extension appears to be missing.\n${reason}`
              );
            });
        }
      },
      icon: folderIcon,
      // TODO Translation
      // label: trans.__('Reveal In File Explorer')
      label: 'Reveal In File Explorer'
    });

    app.commands.addCommand(CommandIDs.openFile, {
      execute: () => {
        const widget = factory.tracker.currentWidget;

        if (widget) {
          const selection = toArray(widget.selectedItems());

          if (selection.length !== 1) {
            return;
          }

          const selected = selection[0];

          requestAPI<IResponse>('open-file', {
            method: 'POST',
            body: JSON.stringify({ path: selected.path })
          })
            .then(data => {
              // Was a success
            })
            .catch(reason => {
              console.error(
                `The jupyterlab-fileopen server extension appears to be missing.\n${reason}`
              );
            });
        }
      },
      icon: folderIcon,
      // TODO Translation
      // label: trans.__('Open With Default Application')
      label: 'Open With Default Application'
    });

    app.contextMenu.addItem({
      command: CommandIDs.openFileExplorer,
      selector: selectorItem,
      rank: 2
    });

    app.contextMenu.addItem({
      command: CommandIDs.openFile,
      selector: selectorNotDir,
      rank: 2
    });
  }
};

export default extension;
