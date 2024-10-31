import "monaco-editor";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

window.MonacoEnvironment = {
  getWorker(_, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};

export * as default from "monaco-editor/esm/vs/editor/editor.api";
