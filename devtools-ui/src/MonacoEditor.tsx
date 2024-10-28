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
import {
  setEditorContent,
  setEditorHandlers,
  useStaging,
} from "./store/staging";

window.MonacoEnvironment = {
  getWorker(_, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};

export function MonacoEditor({
  className,
  width,
  height,
}: {
  className?: string;
  width: number;
  height: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<(d: { width: number; height: number }) => void>();
  const modelRef = useRef<monaco.editor.ITextModel | null>();
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

    modelRef.current = editor.getModel();

    resizeRef.current = editor.layout.bind(editor);

    return () => {
      editor.dispose();
    };
  }, []);

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

  useEffect(() => {
    resizeRef.current?.({ width, height });
  }, [width, height]);

  return <div ref={container} className={className}></div>;
}
