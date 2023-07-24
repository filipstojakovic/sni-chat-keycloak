(window as any).global = window;
// global.Buffer = global.Buffer || require("buffer").Buffer;
// global.process = global.process || require("process");
import * as process from 'process';

window['process'] = process;
