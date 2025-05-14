# Race Time - by up2194051

## Key features

### Create a race
Go To '/'
Click 'Create a Race' and Add the race Name
I implemented it like this because at the time i wanted to add more detail to the race creator, (like scheduled start time) but i never did

### Open race
On '/'
Click on a race to open it

### Upload runners Batch
On '/race'
Browse for a csv file (runners.csv provided) and click 'Upload Runners' To batch add runners to a race
Designed like this as it is easy to understand how to use it

### Manually Add a Runner
On '/race'
Fill in the runner name and press 'Add', to manually add that runner to the race
Designed like this as i needed a way to add users in development without creating new csv files, also simple and easy to use

### Record finish time of runner
On '/race'
Click 'Record Time' to record the timer as a race finish time
Seperate from the runner name as one person can be timing runners coming past the finish and an different person can be setting their positions

### Record finishing runners
On '/race'
Fill in the runner id number and click 'Record Runner' to record that runner as having come in that position in the race
Set runner positions via ID numbers associated with each runner

### Start the race
On '/race'
Click 'Start' to start the race timer
Race start is synced to all other users who are online
Designed to be Simple and easy to understand

### Submit results to a server
Results get automatically submitted to the server while you are online
If you are not online, they get cached for future upload when you are online
Designed so the user does not have to remember to upload results, it is done automatically

### Clear data
Click 'Clear Data' to clear all data from your device

### See Finish board
On '/race'
Click 'Finish Board' to open the finish board
Click 'Stop' to stop the race and go to the finish board
Stop takes you to the finish board as you have no need to stay on the race control screen once the race is over

### Finish page
On '/finish'
See the finish times of all users who have finished the race (updated every 10s)


## Usage of AI
### Prompts to develop (User Batch Upload)
A sequence of prompts helped me develop this
> how would i go about loading a csv file into a js obj
This response was useful as it gave me a starting point for the csv parsing, 
However the response given was loading the csv file from the server
> how would i load a csv file from disk in browser js
This response gave me a snippet of code (4 lines) that i used to load the csv file from the disk

### Prompts to develop (Account switching)
For this i was encountering bugs that made no sense to me and using AI helped with that
> `account.js` When i switch accounts the page reloads before the access_level requets completes and i get NS_BINDING_ABORTED
This response was not useful as all it did was pull out switchUser into its own function.
> `account.js` Still getting NS_BINDING_ABORTED
This response added a if check on access_level before the page was reload, and for some reason that worked

### Prompts to develop (Get Times)
> `db.js/getFinishers` Can you give me an idea of how to modify this query to include runners who have not finished the race yet (their times as null)
This prompt told me that i could accomplish what i wanted using LEFT JOINS
