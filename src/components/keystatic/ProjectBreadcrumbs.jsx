import React from 'react';

/**
 * Custom breadcrumb navigation for Keystatic admin
 * Shows workspace context and current location
 */
export function ProjectBreadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = React.useState([]);
  const [currentCollection, setCurrentCollection] = React.useState('');

  React.useEffect(() => {
    // Parse current URL to determine location
    const updateBreadcrumbs = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);

      // Find keystatic index and parse from there
      const keystaticIndex = parts.indexOf('keystatic');
      if (keystaticIndex === -1) return;

      const relevantParts = parts.slice(keystaticIndex + 1);
      const crumbs = [];

      if (relevantParts.length === 0) {
        // Dashboard
        crumbs.push({ label: 'Dashboard', icon: '🏠' });
      } else if (relevantParts[0] === 'collection') {
        // Collection view
        const collectionName = relevantParts[1];
        const collectionLabels = {
          projects: { label: 'Projects', icon: '📁' },
          subProjects: { label: 'Sub-Projects', icon: '📂' },
          tasks: { label: 'Tasks', icon: '✅' },
          updates: { label: 'Updates', icon: '📝' },
          docs: { label: 'Documentation', icon: '📚' },
        };

        const collection = collectionLabels[collectionName] || { label: collectionName, icon: '📄' };
        setCurrentCollection(collectionName);

        crumbs.push({ label: 'Collections', icon: '📋' });
        crumbs.push({ label: collection.label, icon: collection.icon, active: true });

        // If viewing/editing specific entry
        if (relevantParts.length > 2 && relevantParts[2] !== 'create') {
          const action = relevantParts[2]; // 'item' or 'edit'
          const slug = relevantParts[3];
          if (slug) {
            const displayName = decodeURIComponent(slug).replace(/-/g, ' ');
            crumbs.push({
              label: displayName.length > 30 ? displayName.substring(0, 30) + '...' : displayName,
              icon: '✏️',
              active: true
            });
          }
        } else if (relevantParts[2] === 'create') {
          crumbs.push({ label: 'New Entry', icon: '➕', active: true });
        }
      }

      setBreadcrumbs(crumbs);
    };

    updateBreadcrumbs();

    // Listen for navigation changes (for SPA routing)
    const intervalId = setInterval(updateBreadcrumbs, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#374151',
      userSelect: 'none',
    }}>
      {/* Workspace Logo/Name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingRight: '12px',
        borderRight: '1px solid #e5e7eb',
      }}>
        <span style={{ fontSize: '20px' }}>🔬</span>
        <span style={{ fontWeight: 600, color: '#00D084' }}>Workspace</span>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
        }}>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>›</span>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: crumb.active ? '#f0fdf4' : 'transparent',
                color: crumb.active ? '#00D084' : '#6b7280',
                fontWeight: crumb.active ? 600 : 500,
              }}>
                <span style={{ fontSize: '14px' }}>{crumb.icon}</span>
                <span>{crumb.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Collection Context Badge */}
      {currentCollection && (
        <div style={{
          marginLeft: 'auto',
          padding: '4px 10px',
          borderRadius: '12px',
          backgroundColor: '#f3f4f6',
          fontSize: '11px',
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {currentCollection === 'projects' && '🔧 Hardware, 🧬 Biology, ⚡ Plasma'}
          {currentCollection === 'subProjects' && '📂 Nested Projects'}
          {currentCollection === 'tasks' && '✅ Quick Capture → 🔄 Convert to Updates'}
          {currentCollection === 'updates' && '🔬 Research Updates'}
          {currentCollection === 'docs' && '📚 Protocols & Methods'}
        </div>
      )}
    </div>
  );
}
