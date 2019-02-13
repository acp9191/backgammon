defmodule BackgammonWeb.PageController do
  use BackgammonWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
