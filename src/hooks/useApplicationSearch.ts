import { useMemo, useState } from "react";

export const useApplicationSearch = (apps: any[]) => {
  const [searchText, setSearchText] = useState("");

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) =>
        app.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .slice(0, 10);
  }, [searchText, apps]);

  return { searchText, setSearchText, filteredApps };
};
