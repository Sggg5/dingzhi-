#!/usr/bin/env node
const fs = require("fs");

const [, , target, ...inputs] = process.argv;
if (!target || inputs.length === 0 || inputs.length % 3 !== 0) {
  throw new Error("Usage: node tools/build-cad-profile-data.js target.js source.json type diameter1,diameter2,... [source.json type diameter1,...]");
}

const profiles = [];
for (let index = 0; index < inputs.length; index += 3) {
  const [source, type, diameterList] = inputs.slice(index, index + 3);
  const extracted = JSON.parse(fs.readFileSync(source, "utf8")).profiles;
  const diameters = diameterList.split(",").map(Number);
  if (extracted.length !== diameters.length) {
    throw new Error(`${source}: profile count ${extracted.length} does not match diameter count ${diameters.length}.`);
  }
  extracted.forEach((profile, profileIndex) => {
    profile.type = type;
    profile.diameter = diameters[profileIndex];
    profiles.push(profile);
  });
}

const body = `(function exposeCadProfileData(root) {\n`
  + `  const profiles = ${JSON.stringify(profiles, null, 2)};\n`
  + `  function key(type, diameter) { return String(type) + ":" + String(Number(diameter)); }\n`
  + `  const byKey = new Map(profiles.map((profile) => [key(profile.type, profile.diameter), profile]));\n`
  + `  root.CadProfileData = { getProfile(type, diameter) { return byKey.get(key(type, diameter)) || null; } };\n`
  + `})(typeof globalThis !== "undefined" ? globalThis : window);\n`;

fs.writeFileSync(target, body, "utf8");
console.log(`Built ${target} with ${profiles.length} CAD profiles.`);
