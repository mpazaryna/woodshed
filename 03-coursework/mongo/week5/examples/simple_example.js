// Write the aggregation query that will find the number of products by category of a collection that has the form:
// {
//	"_id" : ObjectId("50b1aa983b3d0043b51b2c52"),
//	"name" : "Nexus 7",
//	"category" : "Tablets",
//	"manufacturer" : "Google",
//	"price" : 199
// }
db.products.aggregate([{$group:{"_id":"$category", "num_products":{"$sum":1}}}])