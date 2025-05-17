import fs from "node:fs";
import { stringify } from "javascript-stringify";

function generatePrinters() {
  let output = "";
  output += `const printerDefinitions = {\n`;

  try {
    let files = fs.readdirSync("data/printers");

    for (let file of files) {
      let data = fs.readFileSync("data/printers/" + file, "utf8");

      let definition = {};

      try {
        definition = JSON.parse(data);
      } catch (err) {
        console.log("Error parsing file: " + file);
        console.log(data);
        throw err;
      }

      let name = file.replace(/\.json$/, "");

      output += `\t'${name}': ${stringify(definition)},\n`;
    }
  } catch (err) {
    console.error(err);
  }

  output += "};\n\n";

  output += "export default printerDefinitions;\n";

  fs.writeFileSync("generated/printers.js", output, "utf8");
}

function generateMappings() {
  let output = "";
  output += `const codepageMappings = {\n`;

  try {
    output += `\t'esc-pos': {\n`;

    let files = fs.readdirSync("data/mappings/esc-pos");

    for (let file of files) {
      let data = fs.readFileSync("data/mappings/esc-pos/" + file, "utf8");
      let lines = data.split("\n");

      let name = file.replace(/\.txt$/, "").replace(/-legacy/g, "/legacy");
      let list = new Map();

      for (let line of lines) {
        if (line.length > 1 && line.charAt(0) != "#") {
          let parts = line.split(/\t/).filter((part) => part.length > 0);
          if (parts.length >= 2) {
            let key = parts[0];
            let value = parts[1];
            list.set(parseInt(key, 16), value.trim());
          }
        }
      }

      let mapping = [];
      for (let value of list.values()) {
        mapping.push(value);
      }

      output += `\t\t'${name}': ${stringify(mapping)},\n`;
    }

    output += `\t},\n`;
  } catch (err) {
    console.error(err);
  }

  try {
    output += `\t'star-prnt': {\n`;

    let files = fs.readdirSync("data/mappings/star-prnt");

    for (let file of files) {
      let data = fs.readFileSync("data/mappings/star-prnt/" + file, "utf8");
      let lines = data.split("\n");

      let name = file.replace(/\.txt$/, "").replace(/-legacy/g, "/legacy");
      let list = new Map();

      for (let line of lines) {
        if (line.length > 1 && line.charAt(0) != "#") {
          let parts = line.split(/\t/).filter((part) => part.length > 0);
          if (parts.length >= 2) {
            let key = parts[0];
            let value = parts[1];
            list.set(parseInt(key, 16), value.trim());
          }
        }
      }

      let mapping = [];
      for (let value of list.values()) {
        mapping.push(value);
      }

      output += `\t\t'${name}': ${stringify(mapping)},\n`;
    }

    output += "\t}\n";
  } catch (err) {
    console.error(err);
  }

  output += "};\n\n";

  output += "codepageMappings['star-line'] = codepageMappings['star-prnt'];\n";
  output +=
    "codepageMappings['esc-pos']['zijang'] = codepageMappings['esc-pos']['pos-5890'];\n\n";
  output += "export default codepageMappings;\n";

  fs.writeFileSync("generated/mapping.js", output, "utf8");
}

generateMappings();
generatePrinters();
