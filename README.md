# infoscreen
![Build with Docker](https://github.com/C0ntroller/infoscreen/workflows/Build%20with%20Docker/badge.svg)

An infoscreen for my Raspberry Pi to show current weather, news , calendar, etc.

You just need a file `src/js/Secrets.js`. It should look like this:

```js
module.exports = {
    container_name: [
        {
            key: value
        }
    ]
}
```
e.g.:
```js
module.exports = {
    weather: [
        {
            coords: "51.xxxx,13.xxxx",
            api_key: "abcdefg123456"
        }
    ],
    dvb: [
        {
            stop_id: 123456
        }
    ]
}
```
(Obviously obfuscated for privacy reasons).

Because it uses a custom JS container class it should be easely expendable, even if the code is not really documentated.

## To Use

1. Clone
2. npm install
3. build... I guess?

You can build it for armv7l (RPi) via [Electron builder multi platform build](https://www.electron.build/multi-platform-build).

```bash
# Docker command in repo directory:
docker run --rm -ti \
 --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder:wine

 # In docker container:
 yarn && yarn dist
 ```
 Or just download the artifact from the latest CI run.

## Licence
* Weather icons from [erikflowers/weather-icons](https://github.com/erikflowers/weather-icons) licensed under [SIL OFL 1.1](http://scripts.sil.org/OFL)
* This code licensed under [CC0-1.0](../blob/master/LICENSE)
