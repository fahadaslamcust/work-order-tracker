import app from "./app";
import { config } from "./config";

app.listen(config.port ?? 4000, () => {
  console.log(`Server running on port ${config.port ?? 4000}`);
});