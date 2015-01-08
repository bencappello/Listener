class SessionsController < ApplicationController

  def new
    @user = User.new
    render :new
  end

  def create
    email, password = session_params[:email], session_params[:password]
    @user = User.find_by_credentials(email, password)

    if @user.nil?
      @user = User.new(email: email)
      flash.now[:errors] = ["Incorrect email/password combination."]
      render :new
    else
      login!(@user)
      redirect_to root_url
    end
  end

  def destroy
    logout!
    redirect_to new_session_url
  end

  private

  def session_params
    params.require(:user).permit(:email, :password)
  end

end
