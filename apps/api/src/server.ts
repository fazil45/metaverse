import app from "./index.js";
import { PORT } from "./utils/imports.js";

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
