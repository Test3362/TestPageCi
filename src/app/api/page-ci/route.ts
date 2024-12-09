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
const branch = "main";

export const POST = async (req: NextRequest) => {
    const { directory } = await req.json();
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
        });

        const targetDir = resolve(pathToRepoRoot, "src", "app", directory);

        const remoteUrl = `https://${githubToken}@github.com/Test3362/TestPageCi.git`;

        await git.addConfig('user.name', 'Test3362'); // Set your GitHub username
        await git.addConfig('user.email', 'namang25101@gmail.com'); // Set the associated email

        // Ensure remote is set up
        await git.addRemote("origin", remoteUrl).catch((err) => {
            console.log("Remote already exists, skipping...");
        });

        await git.fetch('origin', branch);
        console.log("Fetched all branches from remote");

        // Ensure the branch exists locally
        const branches = await git.branch();
        if (!branches.all.includes(branch)) {
            console.log(`Branch '${branch}' does not exist locally. Checking it out.`);
            await git.checkoutBranch(branch, `origin/${branch}`);
        } else {
            console.log(`Branch '${branch}' exists locally.`);
            await git.checkout(branch);
        }

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
