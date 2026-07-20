import { useState, useRef, useMemo } from 'react';
import Starfield, { type StarfieldHandle } from '@/components/Starfield';
import Header from '@/components/Header';
import ProjectGrid from '@/components/ProjectGrid';
import LonelyButton from '@/components/LonelyButton';
import Footer from '@/components/Footer';
import { useProjects, isIndieProject } from '@/hooks/useProjects';

export default function Home() {
  const [strangersOnly, setStrangersOnly] = useState(false);
  const starfieldRef = useRef<StarfieldHandle>(null);
  const { projects, loading, lastUpdated, refresh } = useProjects();

  const filteredProjects = useMemo(() => {
    if (!strangersOnly) return projects;
    return projects.filter(isIndieProject);
  }, [projects, strangersOnly]);

  const handleAccelerate = () => {
    starfieldRef.current?.accelerate();
    starfieldRef.current?.meteorShower();
  };

  return (
    <div className="app">
      <Starfield ref={starfieldRef} />

      <div className="main-content">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          strangersOnly={strangersOnly}
          onToggleStrangers={() => setStrangersOnly(!strangersOnly)}
          projectCount={filteredProjects.length}
          loading={loading}
        />

        <main className="content-wrapper">
          <ProjectGrid
            key={strangersOnly ? 'strangers' : 'all'}
            projects={filteredProjects}
            loading={loading}
          />
        </main>

        <Footer />
      </div>

      <LonelyButton projectCount={projects.length} onAccelerate={handleAccelerate} />
    </div>
  );
}
