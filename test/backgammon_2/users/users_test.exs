defmodule Backgammon2.UsersTest do
  use Backgammon2.DataCase

  alias Backgammon2.Users

  describe "users" do
    alias Backgammon2.Users.User

    @valid_attrs %{email: "some email", first: "some first", losses: 42, name: "some name", password_hash: "some password_hash", wins: 42}
    @update_attrs %{email: "some updated email", first: "some updated first", losses: 43, name: "some updated name", password_hash: "some updated password_hash", wins: 43}
    @invalid_attrs %{email: nil, first: nil, losses: nil, name: nil, password_hash: nil, wins: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Users.create_user()

      user
    end

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Users.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Users.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = Users.create_user(@valid_attrs)
      assert user.email == "some email"
      assert user.first == "some first"
      assert user.losses == 42
      assert user.name == "some name"
      assert user.password_hash == "some password_hash"
      assert user.wins == 42
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Users.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      assert {:ok, %User{} = user} = Users.update_user(user, @update_attrs)
      assert user.email == "some updated email"
      assert user.first == "some updated first"
      assert user.losses == 43
      assert user.name == "some updated name"
      assert user.password_hash == "some updated password_hash"
      assert user.wins == 43
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Users.update_user(user, @invalid_attrs)
      assert user == Users.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Users.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Users.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Users.change_user(user)
    end
  end
end
