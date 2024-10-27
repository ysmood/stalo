import { setSession, useSession } from "./session";
import { commitName } from "./constants";
import { setScrollTo } from "./history";
import { deepEqual } from "stalo/lib/utils";

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
    const state = JSON.parse(s.getEditorValue());

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
  const val = useSession((s) => s.editorContent);
  const state = useSession((s) => {
    return s.history.list.last()?.state;
  });

  try {
    return deepEqual(JSON.parse(val), state);
  } catch {
    return false;
  }
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
