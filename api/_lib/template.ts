
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const noto = readFileSync(`${__dirname}/../_fonts/NotoSansJP-Regular.otf`).toString('base64')

function getCss(fontSize: string, background: string | undefined) {
    return `
    @font-face {
        font-family: 'Noto Sans Japanese';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/otf;charset=utf-8;base64,${noto}) format('opentype');
    }

    body {
        ${background ? `
          background-image: url('${background}');
          background-size: 100%;
          background-repeat: no-repeat;
        ` : '' }
        font-family: 'Noto Sans Japanese';
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        height: 556px;
        width: 1200px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Noto Sans Japanese', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: #000000;
        line-height: 1.8;
        padding: 5px 20px 5px 20px;
        text-align: center;
        overflow-wrap: break-word;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, md, fontSize, background } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(fontSize, background)}
    </style>
    <body>
        <div class="heading">
        ${emojify(
            md ? marked(text) : sanitizeHtml(text)
        )}
        </div>
    </body>
</html>`;
}
