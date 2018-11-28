import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { ProjectsGetCardParams } from '@octokit/rest';

function extractIssueNumber(app: Application, payload: any): number {
  if (typeof(payload) !== "object" ||
      typeof(payload.pull_request) !== "object" ||
      typeof(payload.pull_request.body) !== "string") {
        app.log.error("Invalid pull request payload");
        return -1;
  }
  const results = /[Ff]ixes\s+#(\d+)/.exec(payload.pull_request.body);
  if (results != null)
    return parseInt(results[1]);
  return -1;
}

interface CardRef {
  project_id: number;
  column_id: number;
  card_id: number;
}

async function findProjectCards(context: Context, issueNumber: number): Promise<CardRef[]> {
  const projects = await context.github.projects.listForRepo(context.repo());
  if (projects.status != 200)
    return [];
  var result: CardRef[] = [];
  for (const project of projects.data) {
    const columns = await context.github.projects.listColumns({ project_id: project.id });
    if (columns.status != 200)
      continue;
    for (const column of columns.data) {
      const cards = await context.github.projects.listCards({
        column_id: column.id,
        per_page: 100
      });
      if (cards.status != 200)
        continue;
      for (const card of cards.data) {
        if (typeof(card.content_url) === "string" && card.content_url.endsWith("/issues/" + issueNumber))
        {
          result.push({
            project_id: project.id,
            column_id: column.id,
            card_id: card.id
          });
          break;
        }
      }
    }
  }
  return result;
}

export = (app: Application) => {
  /*app.on('issues.opened', async (context) => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    await context.github.issues.createComment(issueComment)
  });*/
  app.on('pull_request', async (context) => {
    app.log.info("Hi?");
    const issueNumber = extractIssueNumber(app, context.payload);
    if (issueNumber < 0)
      return;
    const issue = await context.github.issues.get(context.repo({number: issueNumber}));
    if (issue.status !== 200) {
      app.log.error("Did not find fixed issue");
      return;
    }
    if (("pull_request" in issue.data) && issue.data.pull_request) {
      app.log.error("Pull request is fixing a pull request");
      return;
    }
    const cards = await findProjectCards(context, issueNumber);
    if (cards.length == 0)
      app.log.error("Did not found any cards");
    for (const card of cards)
    {
      const didDelete = await context.github.projects.deleteCard({ card_id: card.card_id });
      if (didDelete.status != 204) {
        app.log.error("Could not delete issue " + didDelete.status);
        return;
      }
      const didCreate = await context.github.projects.createCard({
        column_id: card.column_id,
        content_id: context.payload.pull_request.id,
        content_type: "PullRequest"
      });
      if(didCreate.status != 200) {
        app.log.error("Could not create card " + didCreate.status);
        return;
      }
    }
  });
}
