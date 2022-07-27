const fs = require("fs");

try {
  let data = fs.readFileSync("./src/swagger/stubs/api.ts", "utf8");
  data = data.replaceAll(
    "protected configuration: Configuration;",
    "protected configuration: Configuration = new Configuration({});"
  );
  data = data.replaceAll('name: "RequiredError"', 'name = "RequiredError"');
  fs.writeFileSync("./src/swagger/stubs/api.ts", data);
  fs.unlink("./src/swagger/stubs/api_test.spec.ts", () => {});
  console.log("\ngenreate api code completed successfully and fixed!");
} catch (err) {
  console.error(err);
}
