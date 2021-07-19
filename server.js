/*requiring node modules starts */
var app = require("express")();
var http = require('http').Server(app);
/*requiring node modules ends */

/* requiring config file starts*/
require('./middleware/config.js')(app);
/* requiring config file ends*/


/* requiring config db.js file starts*/
require("./middleware/db.js");
/* requiring config db.js file ends*/


/* 
requiring config db.js file starts. This files handles the all the Routes for this application.
*/
require('./middleware/routes.js')(app);


http.listen(81,function(){
    console.log("Listening on http://127.0.0.1:81");
});