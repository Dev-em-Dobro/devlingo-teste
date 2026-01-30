import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/Header";
import UnitPath from "../components/UnitPath";

export const Route = createFileRoute("/home")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <UnitPath />
    </div>
  );
}
