-- Basic: list every user from Azerbaijan, sorted by city then name.
-- A typical "give me all users matching a filter" task — the first
-- thing QA reaches for when scoping a regional bug investigation.

SELECT
    id, first_name, last_name, email, city
FROM users
WHERE country = 'Azerbaijan'
ORDER BY city, last_name, first_name;
