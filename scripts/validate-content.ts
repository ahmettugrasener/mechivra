import {
  assertContentIntegrity,
  contentRegistryStats,
} from "../src/content/registry";

function main(): void {
  assertContentIntegrity();

  console.log(
    "Mechivra content validation PASS",
  );

  console.log(
    JSON.stringify(
      contentRegistryStats,
      null,
      2,
    ),
  );
}

main();