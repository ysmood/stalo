import { setSession, useSession } from "./session";
import { commitName, Connection } from "./constants";
import { setScrollTo } from "./history";

export function useStaging() {
  return useSession((s) => s.staging);
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

export function useSetState() {
  return useSession((s) => s.connection().setState);
}

export function useEditorValue() {
  return useSession((s) => s.getEditorValue);
}

export function useGetState() {
  return useSession((s) => s.connection().getState);
}

export async function revert(getState: Connection["getState"]) {
  const state = await getState();

  setSession((s) => {
    s.staging = JSON.stringify(state, null, 2);
  });
}

export function format() {
  setSession((s) => {
    s.setEditorValue(JSON.stringify(JSON.parse(s.getEditorValue()), null, 2));
  });
}
