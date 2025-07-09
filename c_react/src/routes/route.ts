import type { RouteType } from "@/@types/route";
import AuthPage from "@/pages/auth";
import ChatPage from "@/pages/chat";
import DashboardPage from "@/pages/dasboard";
import TaskPage from "@/pages/task";
import ProjectPage from "@/pages/project";
import Room from "@/pages/room";

const publicRoutes: RouteType[] = [
 { path: "/auth", component: AuthPage },
];

const privateRoutes: RouteType[] = [
  { path: "/", component: DashboardPage },
  { path: "/task", component: TaskPage },
  { path: "/project/:id", component: ProjectPage },
  { path: "/chat", component: ChatPage },
  { path: "/room/:id", component: Room },

];

export { publicRoutes, privateRoutes };

