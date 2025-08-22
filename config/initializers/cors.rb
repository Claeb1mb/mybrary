# This will aid the tunnel domain
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "localhost:3000", "localhost:3001", /.*\.ngrock-free\.app\z/, /.*\.ngrok\.io\z/
    resource "/api/*", headers: :any, methods: [ :get, :post, :put, :patch, :delete, :options ],
    max_age: 999
  end
end
