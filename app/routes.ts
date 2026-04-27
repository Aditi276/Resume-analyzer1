import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/hub", "routes/hub.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/interview-prep", "routes/interview-prep.tsx"),
  route("/curated-lists", "routes/curated-lists.tsx"),
  route("/result", "routes/result.tsx"),
] satisfies RouteConfig;
