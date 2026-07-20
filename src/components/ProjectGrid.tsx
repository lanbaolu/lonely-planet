import ProjectCard from './ProjectCard';
import type { Project } from '@/types';

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
}

export default function ProjectGrid({ projects, loading }: ProjectGridProps) {
  if (loading) {
    return (
      <div className="project-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="project-card skeleton">
            <div className="skeleton-line w-3-4"></div>
            <div className="skeleton-line w-full"></div>
            <div className="skeleton-line w-2-3"></div>
            <div className="skeleton-line w-1-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>🛰️ 这片星域暂时没有信号...</p>
        <p className="sub">试试关闭「只看陌生人」模式，或者刷新重新接收信号</p>
      </div>
    );
  }

  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <div
          key={project.id}
          style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}
          className="card-wrapper"
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
