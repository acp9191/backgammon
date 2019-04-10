defmodule Backgammon2Web.PageController do
  use Backgammon2Web, :controller

  def index(conn, _params) do

    leaders = Enum.take(Backgammon2.Users.list_users(), 10)

    render(conn, "index.html", leaders: leaders)
  end

  def game(conn, %{"game" => game}) do
    render conn, "game.html", game: game
  end

end
