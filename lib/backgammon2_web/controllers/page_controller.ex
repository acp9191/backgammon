defmodule Backgammon2Web.PageController do
  use Backgammon2Web, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def game(conn, %{"name" => name, "game" => game}) do
    render conn, "game.html", name: name, game: game
  end

end
