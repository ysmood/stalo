import "monaco-editor";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useCurrSession } from "./store/session";
import { setEditorHandlers, useStaging } from "./store/staging";
import debounce from "debounce";

window.MonacoEnvironment = {
  getWorker(_, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};

export function MonacoEditor({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const value = useStaging();
  const session = useCurrSession();

  useEffect(() => {
    if (!container.current) return;

    const editor = monaco.editor.create(container.current, {
      language: "json",
      theme: "vs-dark",
      wordBasedSuggestions: "currentDocument",
      quickSuggestions: true,
    });

    const closeAutoResize = autoResize(editor);

    editorRef.current = editor;

    return () => {
      closeAutoResize();
      editor.dispose();
    };
  }, [container]);

  useEffect(() => {
    if (session) {
      setEditorHandlers(
        () => {
          return editorRef.current?.getModel()?.getValue() || "";
        },
        (val) => {
          if (editorRef.current) setContent(editorRef.current, val);
        }
      );
    }

    setTimeout(() => {
      if (editorRef.current) setContent(editorRef.current, value);
    });
  }, [session, value]);

  return <div ref={container} className={className}></div>;
}

function autoResize(editor: monaco.editor.IStandaloneCodeEditor) {
  const ln = debounce(() => {
    editor.layout({ height: 0, width: 0 });
    editor.layout();
  }, 300);
  window.addEventListener("resize", ln);

  return () => {
    window.removeEventListener("resize", ln);
  };
}

function setContent(
  editor: monaco.editor.IStandaloneCodeEditor,
  newValue: string
) {
  const model = editor.getModel();
  if (!model) return;

  const fullRange = model.getFullModelRange();

  // Ensure the editor history is preserved
  editor.executeEdits("replace-content", [
    {
      range: fullRange,
      text: newValue,
    },
  ]);
}
