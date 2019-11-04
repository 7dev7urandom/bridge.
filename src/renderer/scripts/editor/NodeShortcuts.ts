/**
 * Implements JSONNode (JSONTree.js) shortcuts
 */
import TabSystem from "../TabSystem";
import { clipboard } from "electron";
import { JSONAction } from "../TabSystem/CommonHistory";

export default class NodeShortcuts {
    static paste() {
        try {
            TabSystem.getCurrentNavObj().buildFromObject(JSON.parse(clipboard.readText()), undefined, true);
            TabSystem.setCurrentUnsaved();
            return true;
        } catch(e) {
            //Try again with a fix if the key was still in front
            try {
                TabSystem.getCurrentNavObj().buildFromObject(JSON.parse("{" + clipboard.readText() + "}"), undefined, true);
                TabSystem.setCurrentUnsaved();
                return true;
            } catch(e) {
                return false;
            }
        }
    }
    static copy(node=TabSystem.getCurrentNavObj()) {
        try {
            let copy_key = node.key;
            let match = copy_key.match(/(.+_)(\d+)/);
            if(match !== null) {
                copy_key = match[1] + (Number(match[2]) + 1);
            }

            let obj = { [copy_key]: node.toJSON() };
            clipboard.writeText(JSON.stringify(obj, null, "\t"));
            return true;
        } catch(e) {
            return false;
        }
    }
    static cut() {
        try {
            let node = TabSystem.getCurrentNavObj();
            //HISTORY
            TabSystem.getHistory().add(new JSONAction("add", node.parent, node));

            if(this.copy(node)) {
                TabSystem.deleteCurrent();
                TabSystem.setCurrentFileNav("global");
                TabSystem.setCurrentUnsaved();
            }
        } catch(e) {
            
        }
    }
}