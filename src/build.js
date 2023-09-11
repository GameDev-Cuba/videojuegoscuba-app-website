import { cpSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
import parseMD from "parse-md";
import { randomUUID } from "crypto";

const rootDir = "content";
const outDir = "website";

const outputData = {
    developers: []
};

for (const devFileName of readdirSync(rootDir)) {

    const devFolder = join(rootDir, devFileName);

    const stat = statSync(devFolder);

    if (stat.isDirectory()) {

        console.log("Processing developer " + devFileName);

        const developerData = {
            name: devFileName,
            games: []
        };

        mkdirSync(join(outDir, devFileName, "assets"), { recursive: true });

        cpSync(join(devFolder, "assets"), join(outDir, devFileName, "assets"), {
            recursive: true,
        });

        outputData.developers.push(developerData);

        const gameFileNames = readdirSync(devFolder);

        for (const gameFileName of gameFileNames) {

            const gameFile = join(devFileName, gameFileName);

            console.log("Processing game " + gameFile);

            if (!gameFile.endsWith(".md")) {

                continue;
            }

            const fileStr = readFileSync(join(rootDir, gameFile), { encoding: "utf-8" });

            const { metadata, content } = parseMD(fileStr);

            developerData.games.push({ name: gameFileName, ...metadata, content });
        }
    }

    writeFileSync(join(outDir, "data.json"), JSON.stringify(outputData, null, 4));

    const id = randomUUID();
    const time = new Date().toString();

    const updateData = { time, id };

    writeFileSync(join(outDir, "update.json"), JSON.stringify(updateData, null, 4));
}