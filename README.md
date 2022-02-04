# Campaign_API [Total development time ETA: 12 days]

# Start server
## server.ts [10 min]
- Pass all the routes to App instance

## App [30 min]
- Initialize all the middlewares, routes, error handlers and class validators etc

## database/Database.ts [10 min]
- To connect to database and provide a query function to query the database

## Routes
### Auth [1 Day]
- [ ] /signup => [POST]
- [ ] /login => [POST]
- [ ] /logout => [POST]
- [ ] /change_password => [PUT]
- [ ] /reset_password => [PUT] Reset Password
    - /reset_password/:token => [GET] Reset password only if the link is opened

### ORGANIZATION [6 days]
Create ALL CRUD APIs
- /organization
    - /organization/:orgId(\\d+) => Info about organization based on the orgId.
    - /organization/:orgId(\\d+)/organizations/ => List of organizations
    - /organization/:orgId(\\d+)/organizations/uid/:uid => organization details for the provided organization uid
    - ### DEVICES
        Create CRUD APIs
        - [ ] /organization/:orgId(\\d+)/devices => [POST] Create a Campaign
        - [ ] /organization/:orgId(\\d+)/devices => [GET] Get All Devices
        - [ ] /organization/:orgId(\\d+)/devices/:id(\\d+) => [GET] Get Device by ID.
        - [ ] /organization/:orgId(\\d+)/devices/:id(\\d+) => [PUT] Update Device by ID.
        - [ ] /organization/:orgId(\\d+)/devices/:id(\\d+) => [Delete] Delete device by ID.
    - ### CONTENTS
        Create CRUD APIs
        - [ ] /organization/:orgId(\\d+)/contents => [POST] Create a new content.
        - [ ] /organization/:orgId(\\d+)/contents => [GET] Get All contents
        - [ ] /organization/:orgId(\\d+)/contents/:id(\\d+) => [GET] Get content by ID.
        - [ ] /organization/:orgId(\\d+)/contents/:id(\\d+) => [PUT] Update Content by ID.
        - [ ] /organization/:orgId(\\d+)/contents/:id(\\d+) => [DELETE] Delete Content by ID.
### OTHERS [1 Hr]
Create ALL CRUD APIs
- /resolutions => [GET] Get All Resolutions
- /countries => [GET] Get All Countries

### Download content [2 days]
- /content/download/:filePath => [GET] Download the content.

### CAMPAIGNS [2 days]
Create CRUD APIs
- [ ] /organization/:orgId(\\d+)/campaigns => [POST] Create a Campaign
- [ ] /organization/:orgId(\\d+)/campaigns => [GET] Get All Campaigns
- [ ] /organization/:orgId(\\d+)/campaigns/:id(\\d+) => [GET] Get Campaign by ID.
- [ ] /organization/:orgId(\\d+)/campaigns/:id(\\d+) => [PUT] Update Campaign by ID.
- [ ] /organization/:orgId(\\d+)/campaigns/:id(\\d+) => [DELETE] Delete Campaign by ID.