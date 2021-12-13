<?php
//CREATED BY MITCHELL STEFFENSEN AND MIKHAIL SHCHUKIN
if(!defined('ALLOW_ACCESS')) exit(header('Location: /')); //Only allow access to this file through the router

/*
    The Core class provides the core functionality for the entire
    system by creating the required objects and routing all requests
    to the appropriate pages and functions.
*/
class Core
{
    private $database, //Stores the database connection
            $user; //Stores the user object

    public function __construct($database) //Set up the core by copying the specified database connection and creating a new user object
    {
        session_start(); //Start a PHP session
        mb_internal_encoding('UTF-8'); //Set the default internal encoding
        date_default_timezone_set('UTC'); //Set the default timezone to UTC to make life easy

        $this->database = $database; //Copy the database connection

        /*
            We always need one of the three user objects when someone is accessing the system
            so we can determine what functionality they have. To do this we check if they have a
            PHP session containing their rank, and if they do we create the appropriate user object,
            otherwise we create a simple customer object.
        */
        if(isset($_SESSION['rank']) && $_SESSION['rank'] == 2) //A manager is accessing the system
        {
            $this->user = new Manager($this->database); //Create a Manager object for the user to extra functionality
        }
        else if(isset($_SESSION['rank']) && $_SESSION['rank'] == 1) //A stylist is accessing the system
        {
            $this->user = new Stylist($this->database); //Create a Manager object for the user to extra functionality
        }
        else //A customer is trying to access the system
        {
            $this->user = new Customer($this->database); //Create a Customer object for basic functionality
        }
    }

	public function route() //Route the user's request to the appropriate function or page
	{
        $request = array_slice(explode('/', str_replace('?' . $_SERVER['QUERY_STRING'], '', $_SERVER['REQUEST_URI'])), 1); //Split the request into an array

        if($this->user->validSession()) //The user has a valid session
        {
            if($request[0] == 'home' || $request[0] == 'profile' || $request[0] == 'settings' || $request[0] == 'stylists' || $request[0] == 'addstylist' || $request[0] == 'viewstylist' )
            {
                $this->user->view($request[0]); //Send the user to the appropriate view
            }
            else if($request[0] == 'logout')
            {
                $this->user->logout(); //Log the user out
            }
            else if($request[0] == 'salon') //Salon function request
            {
                $salon = new Salon($this->database); //Create a new Salon object

                if($request[1] == 'unavailable')
                {
                    if(isset($_GET['location']) && $_SESSION['rank'] == 0) //The location GET variable is set and the user is a customer
                    {
                        $salon->getUnavailableTimesJSON($_SESSION['id'], $_SESSION['rank'], $_GET['location']); //Fetch the unavailable times (existing appointments, meetings, business hours, etc.)
                    }
                    else if($_SESSION['rank'] > 0) //The user is a stylist or a manager
                    {
                        $salon->getUnavailableTimesJSON($_SESSION['id'], $_SESSION['rank'], $_SESSION['location']); //Fetch the unavailable times (existing appointments, meetings, business hours, etc.)
                    }
                    else //The user is a customer and the location GET variable is not set
                    {
                        $salon->getUnavailableTimesJSON($_SESSION['id'], $_SESSION['rank'], null); //Fetch the unavailable times (existing appointments, meetings, business hours, etc.)
                    }
                }
                else if($request[1] == 'businessHours')
                {
                    if(isset($_GET['location']) && $_SESSION['rank'] == 0) //The location GET variable is set and the user is a customer
                    {
                        $salon->getBusinessHoursJSON($_GET['location']); //Fetch the business hours
                    }
                    else if($_SESSION['rank'] > 0) //The user is a stylist or a manager
                    {
                        $salon->getBusinessHoursJSON($_SESSION['location']); //Fetch the business hours
                    }
                }
                else if($request[1] == 'services')
                {
                    $salon->getServicesJSON(); //Fetch the list of services
                }
                else if($request[1] == 'locations')
                {
                    $this->user->getUserBy('id', $_SESSION['id']); //Get the current user's information
                    $salon->getLocationsJSON($this->user->getData('country'), $this->user->getData('province'), $this->user->getData('city')); //Fetch the list of stylists based on the user's location
                }
                else if($request[1] == 'stylists')
                {
                    $salon->getStylistsJSON(); //Fetch the list of stylists
                }
                else if($request[1] == 'schedule')
                {
                    if(isset($_POST['location']) && $_SESSION['rank'] == 0)
                    {
                        $salon->scheduleAppointment($_SESSION['id'], $_POST['location'], $_SESSION['rank']); //Schedule an appointment
                    }
                    else if($_SESSION['rank'] > 0)
                    {
                        $salon->scheduleAppointment($_SESSION['id'], $_SESSION['location'], $_SESSION['rank']); //Schedule an appointment
                    }
                }
                else if($request[1] == 'cancel')
                {
                    $salon->cancelAppointment($_SESSION['id'], $_SESSION['rank']); //Cancel an appointment
                }
                else //Invalid request
                {
                    exit(header('Location: /home')); //Send the user back to their home view and kill the script
                }
            }
            else if($request[0] == 'core') //System function request
            {
                if($request[1] == 'upload')
                {
                    $this->uploadImage(); //Upload an image
                }
                else //Invalid request
                {
                    exit(header('Location: /home')); //Send the user back to their home view and kill the script
                }
            }
            else //Invalid request
            {
                exit(header('Location: /home')); //Send the user back to their home view and kill the script
            }
        }
        else //The user doesn't have a valid session
        {
            if($request[0] == 'login')
            {
                $this->user->login(); //Log the user in
            }
            else if($request[0] == 'register')
            {
                $this->user->register(); //Register the user
            }
            else if($request[0] != '') //Invalid request
            {
                exit(header('Location: /')); //Send the user back to the index page and kill the script
            }
            else
            {
                include(__DIR__ . '/../pages/html/index.html'); //Display the index page
            }
        }
	}

    function uploadImage() //Upload an image to the /uploads folder with AJAX
    {
        header('Content-type: application/json; charset=utf-8'); //Set the content type to JSON
        $response = array(); //Stores the response to send back to the requesting script

        if(isset($_FILES['file'])) //A file was specified
        {
            $directory = __DIR__ . '/../uploads/'; //Set the target directory to /uploads
            $extension = strtolower(pathinfo(basename($_FILES['file']['name']), PATHINFO_EXTENSION)); //Get the file extension
            $file = round(microtime(true)) . '.' . $extension; //Generate a file name from the current time
            $valid = true; //Mark the file to valid before we check it

            if(getimagesize($_FILES['file']['tmp_name']) == false) //If we can't get the image size, the user didn't upload an image
            {
                $valid = false; //Mark the file as invalid
            }

            if ($_FILES['file']['size'] > 1000000) //The image is too large (> 1MB)
            {
                $valid = false; //Mark the file as invalid
            }

            if($extension != 'png' && $extension != 'jpg' && $extension != 'jpeg') //The image has an invalid extension
            {
                $valid = false; //Mark the file as invalid
            }

            while (file_exists($file)) //If somehow (magic?) another file is uploaded at the exact same time and has the same name, we need to loop until we find a new valid name
            {
                $file = round(microtime(true)) . '.' . $extension; //Generate a new file name from the current time
            }

            if($valid && move_uploaded_file($_FILES['file']['tmp_name'], $directory . $file)) //The image is valid and was successfully moved to /uploads
            {
               print json_encode(array('file' => $file, 'success' => true));
            }
            else
            {
               print json_encode(array('success' => false));
            }
        }
        else //A file was not specified
        {
            print json_encode(array('success' => false));
        }
    }
}