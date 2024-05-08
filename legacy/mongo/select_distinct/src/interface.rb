class Interface

  include MongoMapper::Document
  
  key :asset_guid
  key :company_guid
  key :contracting_guid
  key :company_use
  key :component_id
  key :description
  key :device_name
  key :device_guid
  key :internet
  key :interface_id
  key :ip_interface
  key :logical_name
  key :network_name
  key :owner_guid
  key :parent_guid
  key :usage
  key :subtype
  key :billing_port
  key :standard_config
  timestamps!

  def self.report_dropdown(guid)
   dat = Interface.collection.distinct("network_name", :internet => 'yes', :usage => 'yes', 
    '$or' => [{:company_guid => guid},{:owner_guid => guid},{:parent_guid => guid}])
  end

  # def self.query_with_company(guid, body={})
  #   limit = body['limit'] || 100
  #   if limit.to_i > 50000
  #     limit = 50000
  #   end
  #   f = {:$or => [{company_guid: guid}, {contracting_guid: guid}, {owner_guid: guid},{parent_guid: guid}]}
  #   rows = self.where_with(body)
  #   rows = rows.where(f)
  #   total = rows.count
  #   {total: total, data: rows}
  # end

  # def self.where_with_company(guid, body={})
  #   limit = body['limit'] || 100
  #   if limit.to_i > 50000
  #     limit = 50000
  #   end
  #   f = {:$or => [{company_guid: guid},{contracting_guid: guid},{owner_guid: guid},{parent_guid: guid}]}
  #   Rails.logger.info("interface where clause #{h}")
  #   rows = self.where(f).all
  # end

  # def graph_for_token(token,opts={})
  #   h = graphs_meta(opts)
  #   z = Zenoss.new
  #   z.network_graph_image(h[token.to_i][:graph_path],opts)
  # rescue Zenoss::GraphError => e
  #   Rails.logger.error(e.message)
  # end

  # will not return the graph path
  # def friendly_graphs_meta
  #   graphs = self.graphs_meta
  #   return [] if graphs.blank?
  #   graphs.values.map do |h|
  #     {id: h[:id], title: h[:title]}
  #   end
  # rescue => e
  #   Rails.logger.error(e.message)
  #   raise 'No graphs for the interface'  
  # end

  # def graphs_meta(opts={})
  #   opts[:drange] ||= 129600
  #   Rails.cache.fetch({id: self.interface_id , title: 'graphs_meta', drange: opts[:drange]}, expires_in: 10.minutes) do
  #     zenoss = Zenoss.new
  #     metas = zenoss.graphs_for_interface(opts[:drange], {interface: self.ip_interface, guid: self.device_guid})
  #     graphs = metas.first || []
  #     i = 0
  #     graphs.inject({}) do |h,g|
  #       i+=1
  #       url = URI.parse(g['url'])
  #       url.query = URI.decode_www_form(url.query).select{|i| i[0] == 'gopts'}.map{|w| w.join('=')}.join('&')
  #       h[i]={id: i,title: g['title'], graph_path: url.to_s}
  #       h
  #     end
  #   end
  # rescue Zenoss::NetworkNotFoundError => e
  # end
end