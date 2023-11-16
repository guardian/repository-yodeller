import { Anghammarad, RequestedChannel, Target } from "@guardian/anghammarad";


const anghammaradClient = new Anghammarad();
let anghammaradTopic = Deno.env.get("ANGHAMMARAD_TOPIC");
anghammaradTopic = anghammaradTopic?.substring(1, anghammaradTopic.length-1);

if (anghammaradTopic === undefined || !anghammaradTopic.length) {
    console.log("❌ Could not read ANGHAMMARAD_TOPIC from SSM")
    Deno.exit(1);
}

const messages: {team: string, message: {subject: string, message: string}}[] = [];

for await (const file of Deno.readDir("messages")) {
    if (!file.isFile)
        continue;

    const contents = (await Deno.readTextFile(`messages/${file.name}`)).split("\n");

    messages.push({
        team: file.name.substring(0, file.name.length-3),
        message: {
            subject: contents.shift() ?? "",
            message: contents.join("\n")
        }
    })
}


console.log(`💌 Sending messages to Anghammarad (${anghammaradTopic})`);

await Promise.all(
  messages.map(async (message) => {
    console.log(` - messaging ${JSON.stringify(message.team)}`)

    const target: Target  = { Stack: 'testing-alerts' };

    await anghammaradClient.notify({
      ...message.message,
      actions: [],
      channel: RequestedChannel.Email,
      sourceSystem: "repository-yodeller",
      topicArn: anghammaradTopic ?? '',
      target
    });
  }),
);
