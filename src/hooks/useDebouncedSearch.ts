import { useMemo, useState } from "react";

export function useDebouncedSearch(items: { title: string; [key: string]: unknown }[], delay = 300) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  // Simple debounce via ref-less approach — avoids importing useEffect deps issues
  const handleChange = (value: string) => {
    setQuery(value);
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  };

  const filtered = useMemo(
    () =>
      debounced
        ? items.filter((i) =>
            i.title.toLowerCase().includes(debounced.toLowerCase())
          )
        : items,
    [debounced, items]
  );

  return { query, setQuery: handleChange, filtered };
}
