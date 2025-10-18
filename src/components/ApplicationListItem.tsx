const ApplicationListItem = ({
  app,
  onSimulate
}: {
  app: any;
  onSimulate: (id: string, name: string) => void;
}) => {
  return (
    <div className="bg-[var(--color-gray-darker)] hover:bg-[var(--color-gray-dark)] flex items-center justify-between p-2 ring-2 ring-[var(--color-gray-medium)] rounded-md transition">
      <span>{app.name}</span>
      <button
        onClick={() => onSimulate(app.id, app.name)}
        className="bg-[var(--color-blue)] hover:bg-[var(--color-gray-medium)] px-3 py-1 rounded-md text-sm transition"
      >
        Simulate
      </button>
    </div>
  );
};

export default ApplicationListItem;
