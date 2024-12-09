//programmatic push on github branch, endpoint to be made.
import { NextRequest, NextResponse } from "next/server";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import simpleGit from "simple-git";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathToRepoRoot = resolve(__dirname, "../");
console.log("Path to repo root:", pathToRepoRoot);

const githubToken = process.env.GITHUB_PAT;

export const POST = async (req: NextRequest) => {
    const { directory, branch = "Naman" } = await req.json();
    console.log("directory to be staged => ", directory);
    console.log("git-branch => ", branch);

    if(!directory) {
        return NextResponse.json({status: 400, message: "Directory not provided" });
    }

    try {
        //const git = simpleGit(pathToRepoRoot);
        const git = simpleGit({
            baseDir: pathToRepoRoot,
            binary: 'git',
            maxConcurrentProcesses: 6,
            config: [
              `url=https://${githubToken}:x-oauth-basic@github.com/username/repository.git`,  // Use your token here
            ]
        });

        const status = await git.status();
        console.log("git-status => ", status);

        const targetDir = resolve(pathToRepoRoot, "src", "app", directory);

        await git.pull("origin", branch);
        console.log("Pulled changes from branch");

        await git.add(`${targetDir}/*`);
        console.log("Added changes to stage");

        await git.commit(`Add ${directory} page`);
        console.log("Committed changes");
        
        await git.push("origin", branch);
        console.log("Pushed changes to branch");

        return NextResponse.json({ status: 200, message: `Changes in '${directory}' pushed successfully to '${branch}'!` });

    } catch(error){
        console.log("Error in page-ci Route => ", error);
        return NextResponse.json({ status: 400, message: "Error pushing changes to branch" });
    }
} 
