import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PublicShare() {
  const { shareId } = useParams();
  const [project, setProject] = useState(null);
  useEffect(() => {
    fetch(`/api/shared/${shareId}`)
      .then(res => res.json()).then(setProject);
  }, [shareId]);
  if (!project) return <div>Loading...</div>;
  return <div>Public project: {project.name}</div>;
}
