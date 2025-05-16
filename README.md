## Creating a Frontend User List Management App
The app will have following features: 
## Implementation Details <br/>
> Seperation of concerns with Seperate Client and Server
>> Client:
 >>> Functionality
    - ** Routing **   Different pages are inside pages/ folder
    - ** Schema ** Schema is defined under schemas/ folder

 >>> Libraries   
    -React Router Dom (Defining routes in App.js)
    - Tailwind (Fine tuning the designs)
    - Typescript (Defining Schemas)
    - Ant Design (Filtering tables, sorting data in tables, )
    - Axios Calling Data from client side (REST api)
    - Zod (Form validation)

>> Server:
    >>> Libraries 
    - express 
    - nodemon
    - cors
    - fastcsv
    - fs(node js)

> <br/>

>> A table displaying all users (with color-coded user types and action buttons).
- Tailwind and ANT Design will be implemented for the design components


A view to add, edit, view, and delete users.
- CSV will be used for fetching user-list (since database might be an overkill) 

>> Proper routing and form validation.
- Zod will be used for form validation and express for routing

I decided to split the code into client and server for easier mangement and flow of data

