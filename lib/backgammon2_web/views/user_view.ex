defmodule Backgammon2Web.UserView do
  use Backgammon2Web, :view
  alias Backgammon2Web.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      username: user.username,
      wins: user.wins,
      losses: user.losses}
  end
end
