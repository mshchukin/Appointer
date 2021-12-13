<?php
//CREATED BY MITCHELL STEFFENSEN AND MIKHAIL SHCHUKIN
if(!defined('ALLOW_ACCESS')) exit(header('Location: /')); //Only allow access to this file through the router

/*
    The Manager class extends the Customer class, overriding the view
    function to provide the manager views, adding the changeProfile
    function, allowing managers to modify the information displayed on their
    profile, adding the addStylist function to allow managers to create new
    stylist accounts and adding the removeStylist function to allow managers
    to remove stylist accounts.
*/
class Manager extends Customer
{
    //Override the Customer view function
    public function view($view) //Show the specified view
    {
        if($view == 'home')
        {
            include(__DIR__ . '/../pages/html/manager_view.html'); //Display the home view
        }
        else if($view == 'settings')
        {
            include(__DIR__ . '/../pages/html/manager_settings.html'); //Display the settings view
        }
        else if($view == 'profile')
        {
            include(__DIR__ . '/../pages/html/manager_profile.html'); //Display the profile view
        }
        else if($view == 'addstylist')
        {
            include(__DIR__ . '/../pages/html/manager_add_stylist.html'); //Display the add stylist view
        }
        else if($view == 'stylists')
        {
            include(__DIR__ . '/../pages/html/manager_stylists.html'); //Display the employee view
        }
        else if($view == 'viewstylist')
        {
            include(__DIR__ . '/../pages/html/manager_view_stylist.html'); //Display the calendar view
        }
        else //Invalid view
        {
            exit(header('Location: /home')); //Send the user back to their home view and kill the script
        }
    }

    public function changeProfile() //Change the manager's profile information
    {
        //NOT IMPLEMENTED
    }

    public function addStylist() //Add a stylist
    {
        //NOT IMPLEMENTED
    }

    public function removeStylist($id) //Remove a stylist
    {
        //NOT IMPLEMENTED
    }
}
