[Bookingo](https://bookingo-jade.vercel.app/)

## Software used

* Software used:
* Clerk for authentication and User Management
Shadcn Tailwind CSS library
Formik for forms
Hyperui
Supabase as backend
Google Places Autocomplete
Vercel for deployment.

## Authentication

Open your terminal and run the following command to install the Clerk package:
npm install @clerk/nextjs
Create a file named .env.local in the root of your project directory. Add the environment variables to this file.
Wrap Application with ClerkProvider
Create a file named middleware.js in the root of your project directory to initialize private and public components.
![image](https://github.com/user-attachments/assets/e2a63f06-0a72-42f4-83fd-c1932a63986e)


## Backend setup using Supabase

Sign up at Supabase, create a new project, and wait for the setup to complete.
In your VS Code terminal, run npm install @supabase/supabase-js to install the Supabase client library.
Listings Table: This table stores details about various listings. It includes columns for listing variables and conditions.
ListingImages Table: This table stores information about images. Its foreign key links each image to a specific listing in the Listings Table.
Foreign Key Relationship:
Foreign Key Setup: In the Images Table, you have a foreign key column referencing the Listings Table's primary key. This relationship ensures that each image is associated with a specific listing.
Image Upload: When an image is uploaded, it is linked to a particular listing by using the foreign key. This means that the image data is connected to the corresponding listing entry, maintaining the relational integrity between the two tables.

## Google Places Autocomplete Installation and Usage

Install the react-google-places-autocomplete Library using the command npm install react-google-places-autocomplete
Get Google Places API Key:
Go to the Google Cloud Console.
Create a new project or select an existing project.
Navigate to the API & Services section.
Enable "Places API" 
Maps JavaScript API
Geocoding API
Maps Embed API
Search Places API (new)
Generate an API key and add the above APIs restricted for unauthorized usage.
Add API Key generated to .env.local File:

## Google Place Autocomplete for Search and Map

Use Google Place Autocomplete to search for places.
The map will automatically update with relevant locations based on your search.


## Add/Edit Listing/update listing 

![image](https://github.com/user-attachments/assets/22e88408-7344-4720-be51-1580b0fb417e)


## Image uploading in Supabase

![image](https://github.com/user-attachments/assets/22530af3-36bf-4982-bf7c-d7995abd1c49)

## General Process
Click the Login button to be redirected to the login page.
You can log in using Google or email.
Return to the home page where you can post an ad.
Add different places or property locations.
Upload images and publish the ad.
Once published, the ad will be listed below.
Use the search function to find places by name.
Utilize the Google API to get listings of properties you have added or searched.
Markers or pins will be located on the map for these places by default.
Click on a marker to view more details.
Use filters to get refined search results.

## Note:
This is a practice project created using Next.js and different other technologies.


