-- An example query -- In this case we're getting a list of all repositories
that use the deprecated 'kinesis-logback-appender'

WITH projects AS ( SELECT tags ->> 'value' AS repo_name FROM ( SELECT
jsonb_array_elements(tags) as tags FROM ( SELECT DISTINCT
jsonb_extract_path_text(jsonb_array_elements(projects), 'id') AS "id" FROM
snyk_dependencies WHERE name LIKE '%kinesis-logback-appender%' )
snyk_dependency_project_ids LEFT JOIN snyk_projects ON
snyk_dependency_project_ids.id = snyk_projects.id ) snyk_project_tags WHERE tags
->> 'key' = 'repo' ) SELECT B.repo_name, A.github_team_name FROM projects B LEFT
JOIN view_repo_ownership A on A.repo_name = B.repo_name ORDER BY
A.github_team_name
