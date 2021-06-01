import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado


class FileOpenHandler(APIHandler):

    @tornado.web.authenticated
    async def post(self):
        # TODO Open file

        data = self.get_json_body()

        self.finish(json.dumps({
            "openedFile": data["filepath"],
            "success": True
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(
        base_url, "jupyterlab-fileopen", "open-file-explorer"
    )
    handlers = [(route_pattern, FileOpenHandler)]
    web_app.add_handlers(host_pattern, handlers)
