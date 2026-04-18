import { registerOTel } from "@vercel/otel";

registerOTel({ serviceName: "workout-tracker" });
// NOTE: You can replace `your-project-name` with the actual name of your project
