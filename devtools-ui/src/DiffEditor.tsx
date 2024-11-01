import { useRef, useEffect } from "react";
import { setStaging, usePrevStateContent, useStaging } from "./store/staging";
import monaco, { theme } from "./store/editor";
import { useThrottle } from "./store/utils";

export function DiffEditor({
  className,
  width,
  height,
}: {
  className?: string;
  width: number;
  height: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>();
  const prevValue = usePrevStateContent();
  const currValue = useStaging();

  const setEditorContent = useThrottle(
    (prev: string, curr: string) => {
      if (editorRef.current?.getModel()?.original.getValue() !== prev)
        editorRef.current?.getModel()?.original.setValue(prev);

      if (editorRef.current?.getModel()?.modified.getValue() !== curr)
        editorRef.current?.getModel()?.modified.setValue(curr);
    },
    100,
    []
  );

  useEffect(() => {
    if (!container.current) return;

    const editor = monaco.editor.createDiffEditor(container.current, {
      theme,
    });

    editor.setModel({
      original: monaco.editor.createModel("", "json"),
      modified: monaco.editor.createModel("", "json"),
    });

    editorRef.current = editor;

    const contentLn = editor.getModel()?.modified.onDidChangeContent(() => {
      setStaging(editorRef.current?.getModel()?.modified.getValue() || "");
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
    const patchLn2 = function (e: ErrorEvent) {
      if (
        e.error.message.includes("AbstractContextKeyService has been disposed")
      ) {
        e.preventDefault();
      } else {
        throw e.error;
      }
    };
    window.addEventListener("error", patchLn2);

    return () => {
      window.removeEventListener("unhandledrejection", patchLn);
      window.removeEventListener("error", patchLn2);

      contentLn?.dispose();
      editor.dispose();
    };
  }, []);

  useEffect(() => {
    setEditorContent(prevValue, currValue);
  }, [setEditorContent, prevValue, currValue]);

  useEffect(() => {
    editorRef.current?.layout({ width, height });
  }, [width, height]);

  return <div ref={container} className={className}></div>;
}
