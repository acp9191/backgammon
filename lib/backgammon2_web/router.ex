defmodule Backgammon2Web.Router do
  use Backgammon2Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Backgammon2Web do
    pipe_through :browser

    get "/", PageController, :index

    get "/game/:game", PageController, :game

    post "/game/", PageController, :game
  end

  # Other scopes may use custom stacks.
  scope "/api", Backgammon2Web do
    pipe_through :api

    resources "/users", UserController, except: [:new, :edit]
  end
end
