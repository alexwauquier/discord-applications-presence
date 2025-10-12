import React, { useState } from 'react';

const ApplicationSearch = ({ apps }: { apps: any[] }) => {
  const [searchText, setSearchText] = useState('');

  const filteredApps = apps.filter((app: any) =>
    app.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <input
        type="text" 
        placeholder="Search for an app..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <ul>
        {filteredApps.map((app) => (
          <li key={app.id}>{app.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationSearch;
