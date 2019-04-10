defmodule Backgammon2.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string
      add :password_hash, :string
      add :wins, :integer, default: 0
      add :losses, :integer, default: 0

      timestamps()
    end

    create unique_index(:users, [:username])

  end
end
