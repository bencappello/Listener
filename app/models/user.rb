class User < ActiveRecord::Base
  validates :email, :username, :session_token, presence: true
  validates :password, length: { minimum: 5, allow_nil: true }
  validates :email, :username, uniqueness: true

  has_many :user_songs, dependent: :destroy
  has_many :user_blogs, dependent: :destroy
  has_many :user_follows, dependent: :destroy

  has_many :favorite_songs, through: :user_songs, source: :song
  has_many :followed_blogs, through: :user_blogs, source: :blog

  has_many :followers, through: :user_follows, source: :follower
  has_many :followed_users, through: :user_follows, source: :followed_user

  attr_reader :password
  after_initialize :ensure_session_token

  def self.find_by_credentials(user_params)
    user = User.find_by_email(user_params[:email])
    user.try(:is_password?, user_params[:password]) ? user : nil
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)

    if user
      if user.is_password?(password)
        user
      else
        errors[:base] << "That is not the correct password for the user."
        nil
      end
    else
      errors[:base] << "There is no user with that email address."
      nil
    end
  end

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
    self.session_token
  end

  private

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end
end
