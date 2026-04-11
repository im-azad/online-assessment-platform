import { setupWorker } from "msw/browser";
import { authHandlers, examHandlers, examAttemptHandlers } from "./handlers";

const handlers = [...authHandlers, ...examHandlers, ...examAttemptHandlers];

export const worker = setupWorker(...handlers);
