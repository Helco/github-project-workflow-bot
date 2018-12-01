# Model description

## when - Event declaration

when is a list of events, an event declaration has the form:

`webhook_name ( or|OR? webhook_name)+`

an event body has the `with` list which are conditions (alias `where` and `condition[s]`) and the `do` list which are actions to take if the conditions apply. The usable webhooks are:

- `issues`
- `issues.assigned`
- `issues.closed`
- `issues.demilestoned`
- `issues.edited`
- `issues.labeled`
- `issues.milestoned`
- `issues.opened`
- `issues.reopened`
- `issues.unassigned`
- `issues.unlabeled`
- `project_card`
- `project_card.closed`
- `project_card.created`
- `project_card.deleted`
- `project_card.edited`
- `project_card.reopened`
- `pull_request`
- `pull_request_review`
- `pull_request_review_comment`
- `pull_request_review_comment.created`
- `pull_request_review_comment.deleted`
- `pull_request_review_comment.edited`
- `pull_request_review.dismissed`
- `pull_request_review.edited`
- `pull_request_review.submitted`
- `pull_request.assigned`
- `pull_request.closed`
- `pull_request.edited`
- `pull_request.labeled`
- `pull_request.opened`
- `pull_request.reopened`
- `pull_request.review_request_removed`
- `pull_request.review_requested`
- `pull_request.synchronize`
- `pull_request.unassigned`
- `pull_request.unlabeled`

## conditions

### reference / annotation

takes list (explicit or space-separated) of strings or variable declarations
searches for a matching line in the description of `$this`

### label

takes a string matcher, searches for label

### description

takes a string matcher, applies it to description of `$this`

### assigned

takes a string matcher, applies it to the usernames assigned to `$this`

### milestone

takes a string matcher, applies it to the milestone

### is_pull_request

takes no parameter

### in_project

takes:
1. optionally a issue or card variable ("issue" or "card")
2. optionally a project name string matcher

## actions

### create_card

takes:
1. optionally a project name string matcher ("project")
2. an issue variable or two strings ("issue" or "title" and "body")
3. a string matcher for the column name to put it into ("column" or "target")

### delete_card

takes:
1. optionally a project name string matcher ("project")
2. an issue variable or string matcher for card title ("issue" or "title")

### move_card

takes:
1. optionally a project name string matcher ("project")
2. an issue variable or string matcher for card title ("issue" or "title")
3. a string matcher for the column name to put it into ("column" or "target")

mind the `move_can_create` config variable

### add_label

takes:
1. an issue variable ("issue")
2. a list of string matchers for labels to add ("label" or "labels")

### remove_label

takes:
1. an issue variable ("issue")
2. a list of string matchers for labels to remove ("label" or "labels")

### close_issue

takes an issue variable ("issue")

### reopen_issue

takes an issue variable ("issue")

### find

takes:
1. a *typed* variable name ("target")
2. a list of conditions ("with")

## string matcher

a string matcher can be either a string or a list of AND'ed matchers. if it
is a string it fully matches the case-insensitive string (alias of equals). If no parameter is given, every string is matched

### regex

takes a single string parameter parses it as a regex expression

### include / includes / contain / contains

takes a single string which has to be contained in the search string fully case-insensitively

### equals

takes a single string which has to fully match case-insensitively the search string

## variable names

variable names are in the form:

`'$'(type':')?name`

variables are typed either by name or by definition, usually their value does not change. there are some special variables:

| name | value |
|:----:|:------|
| `$this` | the object related to the event 

the available types are:

- `issue`
- `pull_request`
- `card`

## for - Pre-filter

the `for` object can have conditions and a `when` list (see above).

## config

there are the following config variables

| name | type | effect |
|:----:|:----:|:-------|
| default_project | string | The default project for `*_card` actions |
| move_can_create | string | If a move operation cannot find the object in the source it nevertheless creates the object in the target |
| check_pull_request_syntax | string | If a pull request changes the config file, the syntax is checked |
| check_warnings_are_errors | bool | On syntax checks warnings are treated as errors |
