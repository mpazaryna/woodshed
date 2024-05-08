class Expense
  include MongoMapper::Document

  key :expense_name, String, :required => true
  key :date_spent, String
  key :amount, Integer

end
