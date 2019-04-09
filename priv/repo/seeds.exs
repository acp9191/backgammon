# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Backgammon2.Repo.insert!(%Backgammon2.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Backgammon2.Repo
alias Backgammon2.Users.User

pwhash = Argon2.hash_pwd_salt("password")

Repo.insert!(%User{email: "alice@example.com", first: "Alice", last: "Wonderland", wins: 5, losses: 5, password_hash: pwhash})
Repo.insert!(%User{email: "bob@example.com", first: "Bob", last: "Marley", wins: 4, losses: 0, password_hash: pwhash})
Repo.insert!(%User{email: "charlie@example.com", first: "Charlie", last: "Chaplin", wins: 5, losses: 0, password_hash: pwhash})
