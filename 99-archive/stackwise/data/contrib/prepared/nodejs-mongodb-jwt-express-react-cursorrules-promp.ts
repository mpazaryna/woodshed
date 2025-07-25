export const nodejs_mongodb_jwt_express_react_cursorrules_prompRules = [{
    title: "nodejs-mongodb-jwt-express-react-cursorrules-promp",
    tags: [],
    slug: "nodejs-mongodb-jwt-express-react-cursorrules-promp",
    libs: [],
    content: `Tech Stack:Backend: Node.js with Express.jsDatabase: MongoDB with Mongoose ODMFrontend: React.js (for admin panel, if required)Authentication: JSON Web Tokens (JWT)Version Control: GitDeployment: Docker (optional)Precision in User Requirements:Strictly adhere to specified user flow and game rules.Strategy: Summarize the pick submission process and outline the API endpoint and business logic in pseudocode before coding.Strategic Planning with Pseudocode:Begin each feature with detailed pseudocode.Example: Provide pseudocode for the weekly scoring process, detailing steps from game result input to entry status updates.Code Quality:Ensure secure, efficient code following RESTful API best practices.Implement proper error handling and input validation.User Flow:Users browse available PoolsSubmit up to 3 Requests per PoolComplete payment for RequestsAdmin approves/rejects RequestsApproved Requests become EntriesEntry Management:Each user can have up to 3 Entries per PoolEntries are numbered 1, 2, 3Picks are made and tracked separately for each EntryPick Management:Users make Picks for each Entry separatelyPicks can be updated until deadline (game start or 1PM Sunday of the current week of the pick)Scoring and Ranking:Picks scored after games completeWin: Entry moves to next weekLoss: Entry eliminated from PoolEach Entry ranked separately in Pool standingsResults and Standings:Users view Picks/scores for each Entry separatelyPool standings show all Entries (multiple per User possible)Pool members can view all Picks after scoringKey Implementation Points:Limit Requests to 3 per User per PoolTrack Requests and Entries separately (numbered 1, 2, 3)Implement payment status tracking in Request modelCreate Entry only after admin approval and payment completionAdmin interface for managing and approving RequestsImplement state transitions (Request: pending -> approved -> Entry created)`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];