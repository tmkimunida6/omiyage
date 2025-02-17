class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  # Deviseで許可するパラメータ
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:account_update, keys: [ :nickname, :image ])
  end
end
