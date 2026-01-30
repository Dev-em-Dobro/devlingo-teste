import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/lesson')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/lesson') {
      throw redirect({
        to: '/lesson/$lessonId',
        params: { lessonId: '1' },
      });
    }
  },
  component: () => <Outlet />,
});
