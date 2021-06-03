import os
import functools
import json
import subprocess
import sys

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url2path, url_path_join
import tornado

try:
    import hybridcontents
except ImportError:
    hybridcontents = None


class BaseHandler(APIHandler):

    @functools.lru_cache()
    def url2localpath(
        self, path: str, with_contents_manager: bool = False
    ):
        """Get the local path from a JupyterLab server path.
        Optionally it can also return the contents manager for that path.
        """
        cm = self.contents_manager

        # Handle local manager of hybridcontents.HybridContentsManager
        if hybridcontents is not None and isinstance(
            cm, hybridcontents.HybridContentsManager
        ):
            _, cm, path = hybridcontents.hybridmanager._resolve_path(path, cm.managers)

        local_path = os.path.join(os.path.expanduser(cm.root_dir), url2path(path))
        return (local_path, cm) if with_contents_manager else local_path


class FileExplorerHandler(BaseHandler):

    @tornado.web.authenticated
    async def post(self):
        data = self.get_json_body()

        path = self.url2localpath(data["path"])

        if sys.platform == "linux" or sys.platform == "linux2":
            subprocess.run(["xdg-open", os.path.dirname(path)])
        elif sys.platform == "darwin":
            subprocess.run(["open", "-R", os.path.dirname(path)])
        elif sys.platform == "win32":
            if os.environ["SystemRoot"]:
                command = os.path.join(os.environ["SystemRoot"], 'explorer.exe')
            else:
                command = "explorer.exe"
            subprocess.run([command, f"/select,{path}"])

        self.finish(json.dumps({
            "success": True
        }))


class FileOpenHandler(BaseHandler):

    @tornado.web.authenticated
    async def post(self):
        data = self.get_json_body()

        path = self.url2localpath(data["path"])

        if sys.platform == "linux" or sys.platform == "linux2":
            subprocess.run(["xdg-open", path])
        elif sys.platform == "darwin":
            subprocess.run(["open", path])
        elif sys.platform == "win32":
            subprocess.run(["start", "", path], shell=True)

        self.finish(json.dumps({
            "success": True
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    handlers = [
        (url_path_join(base_url, "jupyterlab-fileopen", "open-file-explorer"), FileExplorerHandler),
        (url_path_join(base_url, "jupyterlab-fileopen", "open-file"), FileOpenHandler),
    ]
    web_app.add_handlers(host_pattern, handlers)
