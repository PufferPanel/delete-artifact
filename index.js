const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
    try {
        const artifactName = core.getInput('artifact-name');

        const runId = github.context.runId;
        const repositoryOwner = github.context.repo.owner;
        const repositoryName = github.context.repo.repo;

        const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

        const { data: artifacts } = await octokit.actions.listWorkflowRunArtifacts({
            owner: repositoryOwner,
            repo: repositoryName,
            run_id: runId,
        });

        for(let i in artifacts) {
            const artifact = artifacts[i];
            if (artifact.name === artifactName) {
                await octokit.actions.deleteArtifact({
                    owner: repositoryOwner,
                    repo: repositoryName,
                    artifact_id: artifact.id,
                });
            }
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
