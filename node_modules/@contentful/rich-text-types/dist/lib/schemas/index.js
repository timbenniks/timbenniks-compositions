"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaWithNodeType = void 0;
function getSchemaWithNodeType(nodeType) {
    try {
        return require("./generated/" + nodeType + ".json");
    }
    catch (error) {
        throw new Error("Schema for nodeType \"" + nodeType + "\" was not found.");
    }
}
exports.getSchemaWithNodeType = getSchemaWithNodeType;
//# sourceMappingURL=index.js.map