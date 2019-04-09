defmodule Backgammon2.Users.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :email, :string
    field :first, :string
    field :losses, :integer
    field :name, :string
    field :password_hash, :string
    field :wins, :integer

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :password_hash, :first, :name, :wins, :losses])
    |> validate_required([:email, :password_hash, :first, :name, :wins, :losses])
  end
end
