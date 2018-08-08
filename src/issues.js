import {_,dialog,errorDialog,initDefaults,saveDefaults,uploadContext,paste,rgb,request,networkRequest,zip,encodeData,get,post,getConfig,openUrlInBrowser,createRadioButtons,createRadioButtons2,createArtboard,hexToRgb,unique,SMPanel} from "./common";

export function issuesAction(context) {
    openUrlInBrowser("https://github.com/weixin/wesketch/issues");
};