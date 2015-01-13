class Api::UsersController < ApplicationController

  def index
    @users = User.all
    render :index
  end

  def show
    @user = User.includes(
      :followed_blogs,
      :followed_users,
      :followers,
      favorite_songs: [:blog, :band]
      ).find(params[:id])
    render :show
  end

  def create
    @user = User.new(user_params)

    if @user.save
      sign_in!(@user)
      render :show
    else
      render json: @user.errors.full_messages, status: :unprocessable_entity
    end
  end

  protected

  def user_params
    self.params.require(:user).permit(:username, :email, :password)
  end
end
