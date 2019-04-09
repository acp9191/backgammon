defmodule Backgammon2.Users.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :email, :string
    field :first, :string
    field :last, :string
    field :losses, :integer
    field :pw_hash, :string
    field :wins, :integer

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:first, :last, :email, :pw_hash, :wins, :losses])
    |> validate_required([:first, :last, :email, :pw_hash, :wins, :losses])
  end
end
