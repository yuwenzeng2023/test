const fs = require("fs");

function getInput(name) {
  const envName = `INPUT_${name.replace(/ /g, "_").toUpperCase()}`;
  const value = process.env[envName] || "";
  console.log(`[getInput] ${name} = ${value}`);
  return value;
}

function setOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) {
    console.warn("[setOutput] GITHUB_OUTPUT env not found, cannot set output");
    return;
  }

  const serialized = typeof value === "string" ? value : JSON.stringify(value);

  const safeValue = serialized.replace(/\n/g, "%0A").replace(/\r/g, "%0D");
  fs.appendFileSync(outputPath, `${name}=${safeValue}\n`);
  console.log(`[setOutput] ${name} = ${serialized}`);
}

async function run() {
  try {
    console.log("[Run] Start processing matrix config");

    const SCRIPT = getInput("SCRIPT");
    const Func = eval(`(${SCRIPT})`);

    setOutput("result", Func({
        env: process.env
    }));

    console.log("[Run] All done ✅");
  } catch (err) {
    console.error(`[Error] ${err.stack || err.message}`);
    process.exit(1);
  }
}

run();
