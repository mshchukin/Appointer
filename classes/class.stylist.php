<?php
//CREATED BY MITCHELL STEFFENSEN AND MIKHAIL SHCHUKIN
if(!defined('ALLOW_ACCESS')) exit(header('Location: /')); //Only allow access to this file through the router

/*
    The Stylist class extends the Customer class, overriding the view
    function to provide the stylist views, and adding the changeProfile
    function, allowing stylists to modify the information displayed on their
    profile.
*/
class Stylist extends Customer
{
    //Override the Customer view function
    public function view($view) //Show the specified view
    {
        if($view == 'home')
        {
            include(__DIR__ . '/../pages/html/stylist_view.html'); //Display the home view
        }
        else if($view == 'settings')
        {
            include(__DIR__ . '/../pages/html/stylist_settings.html'); //Display the settings view
        }
        else if($view == 'profile')
        {
            include(__DIR__ . '/../pages/html/stylist_profile.html'); //Display the profile view
        }
        else //Invalid view
        {
            exit(header('Location: /home')); //Send the user back to their home view and kill the script
        }
    }

    public function changeProfile() //Change the stylist's profile information
    {
        //NOT IMPLEMENTED
    }

    public function changeSettings() //Change the stylist's settings
    {
        //NOT IMPLEMENTED
    }
}
