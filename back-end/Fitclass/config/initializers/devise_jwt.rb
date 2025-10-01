if defined?(Devise::JWT)
  Devise::JWT.setup do |config|
    config.secret = ENV['DEVISE_JWT_SECRET_KEY'] || 'SUA_CHAVE_SECRETA_MUITO_LONGA_E_SEGURA' 
    config.dispatch_requests = [
      ['POST /users/sign_in', '200']
    ]
    config.expiration_time = 1.hour.to_i
  end
end