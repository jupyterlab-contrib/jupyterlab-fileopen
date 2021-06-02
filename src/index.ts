import { Widget } from '@lumino/widgets';

import { toArray } from '@lumino/algorithm';

import { PathExt } from '@jupyterlab/coreutils';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ABCWidgetFactory,
  DocumentRegistry,
  IDocumentWidget,
  DocumentWidget
} from '@jupyterlab/docregistry';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { folderIcon } from '@jupyterlab/ui-components';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { requestAPI } from './handler';

const selectorItem = '.jp-DirListing-item[data-isdir]';
const selectorNotDir = '.jp-DirListing-item[data-isdir="false"]';

const SETTINGS_ID = 'jupyterlab-fileopen:jupyterlab-fileopen-settings';

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
 * A widget that does not will to live.
 */
export class DummyWidget extends Widget {
  protected onAfterAttach(): void {
    this.parent?.dispose();
  }
}

/**
 * A widget factory for opening files with the default desktop application.
 */
export class FileOpenFactory extends ABCWidgetFactory<
  IDocumentWidget<DummyWidget>
> {
  /**
   * Create a new widget factory.
   */
  constructor(
    options: DocumentRegistry.IWidgetFactoryOptions<
      IDocumentWidget<DummyWidget>
    >,
    app: JupyterFrontEnd
  ) {
    super(options);

    this.app = app;
  }

  /**
   * Create a new widget given a context.
   */
  protected createNewWidget(
    context: DocumentRegistry.Context
  ): DocumentWidget<DummyWidget> {
    this.app.commands.execute(CommandIDs.openFile);

    return new DocumentWidget<DummyWidget>({
      context,
      content: new DummyWidget()
    });
  }

  private app: JupyterFrontEnd;
}

/**
 * Initialization data for the jupyterlab-fileopen extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-fileopen:plugin',
  requires: [IFileBrowserFactory, ISettingRegistry],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    factory: IFileBrowserFactory,
    settings: ISettingRegistry
  ) => {
    Promise.all([app.restored, settings.load(SETTINGS_ID)]).then(
      ([, setting]) => {
        const widgetFactory = new FileOpenFactory(
          {
            // TODO Translation
            name: 'FileOpen',
            modelName: 'base64',
            fileTypes: ['desktop'],
            defaultFor: ['desktop'],
            preferKernel: false,
            canStartKernel: false
          },
          app
        );

        const extensions = setting.get('extensions').composite as string[];

        app.docRegistry.addWidgetFactory(widgetFactory);

        app.docRegistry.addFileType({ name: 'desktop', extensions });
        app.docRegistry.setDefaultWidgetFactory('desktop', 'FileOpen');
      }
    );

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
      // label: trans.__('Open With Desktop Application')
      label: 'Open With Desktop Application'
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
