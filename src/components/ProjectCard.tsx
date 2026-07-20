import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  showDailyStars?: boolean;
}

export default function ProjectCard({ project, showDailyStars = true }: ProjectCardProps) {
  const displayName = project.nameCn || project.name;
  const displayDesc = project.descriptionCn || project.description;
  const sources = project.sources || [project.source];

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
    >
      <div className="card-header">
        <h3 className="project-name">
          {project.owner && <span className="owner">{project.owner}/</span>}
          {displayName}
        </h3>
        <div className="source-tags">
          {sources.includes('github') && (
            <span className="source-tag github">GitHub</span>
          )}
          {sources.includes('producthunt') && (
            <span className="source-tag producthunt">Product Hunt</span>
          )}
        </div>
      </div>

      {project.nameCn && project.name !== project.nameCn && (
        <p className="project-original-name">
          {project.name}
        </p>
      )}

      <p className="project-desc">{displayDesc || '暂无描述'}</p>

      <div className="card-footer">
        <div className="stats">
          {sources.includes('github') && showDailyStars && project.dailyStars !== undefined && (
            <span className="stat daily-stars" title="今日新增 Stars">
              🌟 今日 {project.dailyStars}
            </span>
          )}
          {sources.includes('github') && project.stars !== undefined && (
            <span className="stat total-stars" title="总 Star 数">
              ⭐ {formatNumber(project.stars)}
            </span>
          )}
          {sources.includes('producthunt') && project.votes !== undefined && (
            <span className="stat votes">
              🔺 {project.votes}
            </span>
          )}
          {project.language && (
            <span className="stat language">
              {project.language}
            </span>
          )}
        </div>
        <span className="link-arrow">→</span>
      </div>
    </a>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}
