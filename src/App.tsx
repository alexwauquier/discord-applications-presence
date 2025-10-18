import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import ApplicationList from "./components/ApplicationList";
import { useApplicationSearch } from "./hooks/useApplicationSearch";

const App = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchText, setSearchText, filteredApps } =
    useApplicationSearch(apps);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const fetchedApps = await window.discordAPI.getDetectableApplications();
        setApps(fetchedApps);
      } catch (error) {
        console.error("Error fetching apps:", error);
        setApps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const simulateApp = (id: string, name: string) => {
    window.electronAPI.simulateApp(id);
    console.log(`Simulating ${name}`);
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-gray-deep)] flex h-screen items-center justify-center text-2xl text-white">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-gray-deep)] flex flex-col h-screen text-white">
      <SearchBar value={searchText} onChange={setSearchText} />
      <ApplicationList apps={filteredApps} onSimulate={simulateApp} />
    </div>
  );
};

export default App;
