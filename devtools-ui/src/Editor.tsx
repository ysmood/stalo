import { useRef, useEffect } from "react";
import { setStaging, useStaging } from "./store/staging";
import monaco, { theme } from "./store/editor";
import { useThrottle } from "./store/utils";

export function Editor({
  className,
  width,
  height,
}: {
  className?: string;
  width: number;
  height: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>();
  const value = useStaging();

  const setEditorContent = useThrottle(
    (val: string) => {
      if (editorRef.current?.getModel()?.getValue() === val) return;
      editorRef.current?.getModel()?.setValue(val);
    },
    100,
    []
  );

  useEffect(() => {
    if (!container.current) return;

    const editor = monaco.editor.create(container.current, {
      language: "json",
      theme,
      wordBasedSuggestions: "currentDocument",
      quickSuggestions: true,
    });

    editorRef.current = editor;

    const contentLn = editor.getModel()?.onDidChangeContent(() => {
      setStaging(editor.getModel()?.getValue() || "");
    });

    // TODO: Patch to prevent calling setValue on disposed editor
    // Remove it once the issue is fixed in monaco
    const patchLn = function (e: PromiseRejectionEvent) {
      if (
        e.reason.stack.includes("Delayer.cancel") &&
        e.reason.stack.includes("Delayer.dispose")
      ) {
        e.preventDefault();
      } else {
        throw e;
      }
    };
    window.addEventListener("unhandledrejection", patchLn);

    return () => {
      contentLn?.dispose();
      editor.dispose();
      window.removeEventListener("unhandledrejection", patchLn);
    };
  }, []);

  useEffect(() => {
    setEditorContent(value);
  }, [setEditorContent, value]);

  useEffect(() => {
    editorRef.current?.layout({ width, height });
  }, [width, height]);

  return <div ref={container} className={className}></div>;
}
