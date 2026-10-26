export default {
  // Folder that CONTAINS Data/ (Foundry → Configure Settings → User Data Path).
  userDataPath: "/path/to/FoundryVTT",
  // Cypress hits this (usually http://localhost:30000).
  baseURL: "http://localhost:30000",
  // World id on the Foundry setup screen — Cypress launches this for Quench e2e.
  testWorldName: "magnusarchives",
  // Gamemaster password that `pnpm dev:seed` writes into the dev world, and that
  // Cypress uses to join. Foundry v14 refuses to join a user with no password.
  gmPassword: "quench-dev",
  // Optional Foundry admin password, used if /auth is shown.
  adminPassword: "",
  // Path to the docker compose project that runs Foundry (for foundry:start / foundry:restart).
  containerDir: "/path/to/container_local_testing",
  // docker compose service name inside containerDir.
  container: "foundry_13"
};
