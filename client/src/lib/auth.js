import { redirect } from "react-router";
import { apiClient } from "./apiClient";

export function getHomeRouteForRole(role) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "ORGANIZER":
      return "/organizer/dashboard";
    case "STUDENT":
      return "student/dashboard";
    default:
      return "/auth";
  }
}

export async function rootLoader() {
  try {
    const { data: user } = await apiClient.get("/me");
    throw redirect(getHomeRouteForRole(user?.role));
  } catch (err) {
    console.log("caught:", err.response?.status, err.message); // ← add this
    if (err.response?.status === 401) {
      throw redirect("/auth");
    }
    throw err; // unexpected error -> bubble it
  }
}

export async function requireAdmin() {
  try {
    const { data: user } = await apiClient.get("/me");

    if (user?.role !== "ADMIN") {
      throw redirect("/");
    }

    return user;
  } catch (err) {
    if (err.response?.status === 401) {
      throw redirect("/auth");
    }
    throw err;
  }
}

export async function requireOrganizer() {
  try {
    const { data: user } = await apiClient.get("/me");

    if (user?.role !== "ORGANIZER") {
      throw redirect("/");
    }

    return user;
  } catch (err) {
    if (err.response?.status === 401) {
      throw redirect("/auth");
    }
    throw err;
  }
}
