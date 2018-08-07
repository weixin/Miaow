To make rapid development on the web page easier (outside of Sketch, preview in the brower):

1. Run the plugin with actual stickers in one of your libraries.

2.  Grab the relevant `index.json` file from `~/Library/Caches/<plugin id>/<library id>/index.json`.
    This is the cached sticker index. That file should look something like:

    ```
    {
      "sections": [
        ...
      ],
    }
    ```

3. Copy the file into this folder and rename it to `_stub-sticker-index.json`.
