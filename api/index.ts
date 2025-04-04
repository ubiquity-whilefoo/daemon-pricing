// api/index.ts
import worker from "../src/worker";

// Export the fetch function directly for Vercel Edge Runtime
export default worker.fetch;
