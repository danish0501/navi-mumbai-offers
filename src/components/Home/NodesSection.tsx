import { Link } from 'react-router-dom';
import { useNodes } from '@/hooks/use-nodes';

export function NodesSection() {
  const { data: nodes, isLoading: nodesLoading } = useNodes();

  return (
    <section className="container py-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Browse by Area</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {nodesLoading ? Array.from({ length: 18 }).map((_, i) => <div key={i} className="h-9 w-24 rounded-full bg-muted animate-pulse" />) :
          nodes?.map(n => (
            <Link key={n.id} to={`/node/${n.slug}`} className="node-chip">{n.name}</Link>
          ))
        }
      </div>
    </section>
  );
}
