import ApplicationListItem from "./ApplicationListItem";

const ApplicationList = ({
  apps,
  onSimulate
}: {
  apps: any[];
  onSimulate: (id: string, name: string) => void;
}) => {
  return (
    <div className="px-4 space-y-2">
      {apps.map((app) => (
        <ApplicationListItem key={app.id} app={app} onSimulate={onSimulate} />
      ))}
    </div>
  );
};

export default ApplicationList;
