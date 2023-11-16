const templateMessage = await Deno.readTextFile("TEMPLATE.md");
const data = await Deno.readTextFile("data.csv");

console.log("🗑️ Deleting old messages");

try {
  await Deno.remove("messages", {
    recursive: true
  });
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
}
await Deno.mkdir("messages");

console.log("🤖 Parsing data.csv...");
const teams = new Map<string, string[]>();
data
  .split("\n")
  .filter((line) => line.trim().length !== 0)
  .map((line) => line.split(","))
  .filter((values) => values.length === 2)
  .forEach((values) => {
    teams.set(values[1], [values[0], ...(teams.get(values[1]) ?? [])]);
  });

console.log("🤖 Preparing messages...");
teams.forEach((repositories, team) => 
  Deno.writeTextFileSync(`messages/${team}.md`, templateMessage
    .replaceAll("${repositories}", repositories.map((repository) => ` - [${repository}](https://github.com/${repository})`).join('\n'))
    .replaceAll("${team}", team)
  )
);

console.log("✅ Done! Review the prepared messages in \`messages\` and run \`npm send-messages\` once you're ready to notify teams!")