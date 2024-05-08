if Rails.env.development? || Rails.env.test?

  Itslog.configure do |config|
    #config.namespace_colors = {
    #  'action_controller' => "\e[32m",
    #  'active_record'     => "\e[94m",
    #  'mongo'             => "\e[94m",
    #  'action_view'       => "\e[36m"
    #}
    config.format = "%t [%n]: %m"
    config.message_color = "\e[37m"
    config.timestamp_format = "%Y-%b-%d %H:%M:%S %z"
  end

end