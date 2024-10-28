import { setSession, useSession } from "./session";
import { setScrollTo } from "./history";
import { commitName } from "../constants";

export function useStaging() {
  return useSession((s) => s.staging);
}

export function setEditorContent(content: string) {
  setSession((s) => {
    s.editorContent = content;
  });
}

export function setEditorHandlers(
  get: () => string,
  set: (value: string) => void
) {
  setSession((s) => {
    s.getEditorValue = get;
    s.setEditorValue = set;
  });
}

export function commit() {
  setSession((s) => {
    const state = s.getEditorValue();

    s.selected = s.history.size;
    setScrollTo(s, s.selected);

    s.history.add({
      state,
      name: commitName,
      description: "Committed by devtools",
      createdAt: Date.now(),
    });

    s.connection().setState(state);
  });
}

export function useSameLast() {
  return useSession((s) => s.editorContent === s.history.list.last()?.state);
}

export function useSetState() {
  return useSession((s) => s.connection().setState);
}

export function useEditorValue() {
  return useSession((s) => s.getEditorValue);
}

export function format() {
  setSession((s) => {
    s.setEditorValue(JSON.stringify(JSON.parse(s.getEditorValue()), null, 2));
  });
}
