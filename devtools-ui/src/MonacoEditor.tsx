import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import { useCurrSession } from "./store/session";
import {
  setEditorContent,
  setEditorHandlers,
  useStaging,
} from "./store/staging";
import debounce from "debounce";

export function MonacoEditor({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const modelRef = useRef<monaco.editor.ITextModel | null>(null);
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

    modelRef.current = editor.getModel();

    return () => {
      closeAutoResize();
      editor.dispose();
    };
  }, [container]);

  useEffect(() => {
    if (session) {
      setEditorHandlers(
        () => {
          return modelRef.current?.getValue() || "";
        },
        (val) => {
          modelRef.current?.setValue(val);
        }
      );

      const ln = modelRef.current?.onDidChangeContent(() => {
        setEditorContent(modelRef.current?.getValue() || "");
      });

      setTimeout(() => {
        modelRef.current?.setValue(value);
      });

      return () => {
        ln?.dispose();
      };
    }
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
