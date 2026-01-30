import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-700" />
  );
}