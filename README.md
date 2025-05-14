# Race Time - by up2194051

## Key features

### Create a race
On '/'
Click 'Create a Race' and Add the race Name
Implemented to allow quick new race created. 
Originally wanted to add more detail to the race creator, (like scheduled start time) 
but i never did

### Open race
On '/'
Click on a race to open it
Simple list that is easy to find the race you want in

### Upload runners Batch
On '/race'
Browse for a csv file (runners.csv provided) and click 'Upload Runners' To batch add runners to a race

CSV Upload is an easy and efficient way to load multiple runners at once, The upload works with users who already have ids on the system and with users who have no ids

### Manually Add a Runner
On '/race'
Fill in the runner name and press 'Add', to manually add that runner to the race
Provides a quick way to add individual runners without creating new CSV files. Could be used for late registrations (i used for development testing)

### Record finish time of runner
On '/race'
Click 'Record Time' to record the timer as a race finish time
Seperate from the runner ID assignment as one person can be timing runners coming past the finish 
and an different person can be setting their positions.
Doing it like this increases the accuracy of the times

### Record finishing runners
On '/race'
Fill in the runner id number and click 'Record Runner' to record that runner as having come in that position in the race
Set runner positions via ID numbers associated with each runner (IDs quicker to input than names)

### Start the race
On '/race'
Click 'Start' to start the race timer
Race start is synced to all other users who are online
Designed to be Simple and easy to understand
One Button used for start and Stop which minimused the chance of users pressing the wrong button

### Submit results to a server
Results get automatically submitted to the server while you are online
If you are not online, they get cached for future upload when you are online
Designed so the user does not have to remember to upload results, it is done automatically

### Clear data
Click 'Clear Data' to clear all data from your device
Provides a way to easily clear the data from your device (useful if you need to clear browser storage)

### See Finish board
On '/race'
Click 'Finish Board' to open the finish board
Click 'Stop' to stop the race and go to the finish board
Stop takes you to the finish board as you have no need to stay on the race control screen once the race is over

### Finish page
On '/finish'
See the finish times of all users who have finished the race.
Updates every 10s to show new results

### Switch Users
The circular buttons on the right side of the race control panel switch between user accounts..
Admin, Helper, User1, User2
Different accounts have different permissons for the races depending on their role

### Offline Support
The application uses a service worker allowing it to be reloaded when the user does not have an internet connection
All data used to render the application is cached in localStorage so that it
can be retrieved if the user accidently reloads the page and has no connection
to the server

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
> `account.js` When i switch accounts the page reloads before the access_level requests completes and i get NS_BINDING_ABORTED

This response was not useful as all it did was pull out switchUser into its own function.
> `account.js` Still getting NS_BINDING_ABORTED

This response added a if check on access_level before the page was reload, and for some reason that worked

### Prompts to develop (Get Times)
> `db.js getFinishers` Can you give me an idea of how to modify this query to include runners who have not finished the race yet (their times as null)

This prompt told me that i could accomplish what i wanted using LEFT JOINS.
Query used in `db.js getTimes`
